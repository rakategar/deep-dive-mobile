// Append a Sound Intensity (Intensitas Bunyi) data row to the "Intensitas Bunyi" tab.
// Returns the spreadsheet row number so the client can later update column H (TI hitung).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface IntensityPayload {
  power: number;     // Watt
  distance: number;  // meter
  intensity: number; // W/m²
}

const CLERK_SECRET_KEY = Deno.env.get("CLERK_SECRET_KEY") ?? "";
const SHEETS_CLIENT_EMAIL = Deno.env.get("GOOGLE_SHEETS_CLIENT_EMAIL") ?? "";
const SHEETS_PRIVATE_KEY = (Deno.env.get("GOOGLE_SHEETS_PRIVATE_KEY") ?? "").replace(/\\n/g, "\n");
const SHEETS_SPREADSHEET_ID = Deno.env.get("GOOGLE_SHEETS_SPREADSHEET_ID") ?? "";
const SHEET_TAB = "Intensitas Bunyi";
// Sheets API needs the tab name URL-encoded when it contains spaces.
const SHEET_TAB_ENC = encodeURIComponent(SHEET_TAB);

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64url(input: string): string {
  return b64urlFromBytes(new TextEncoder().encode(input));
}

function pemToPkcs8Bytes(pem: string): Uint8Array {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const bin = atob(body);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function getGoogleAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: SHEETS_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  const keyBytes = pemToPkcs8Bytes(SHEETS_PRIVATE_KEY);
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(unsigned)),
  );
  const jwt = `${unsigned}.${b64urlFromBytes(sig)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(`Google token exchange failed: ${JSON.stringify(data)}`);
  }
  return data.access_token as string;
}

async function verifyClerkUser(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  let sub: string | undefined;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    sub = payload.sub;
  } catch {
    return null;
  }
  if (!sub) return null;

  const userRes = await fetch(`https://api.clerk.com/v1/users/${sub}`, {
    headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
  });
  if (!userRes.ok) return null;
  return await userRes.json();
}

function deriveIdentity(user: any) {
  const email: string =
    user?.email_addresses?.find((e: any) => e.id === user?.primary_email_address_id)?.email_address ??
    user?.email_addresses?.[0]?.email_address ??
    "";
  const username: string =
    user?.username ?? (email ? email.split("@")[0] : "") ?? "";
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() ||
    username ||
    email;
  return { userId: user?.id ?? "", username, fullName, email };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    if (!CLERK_SECRET_KEY) return json(500, { error: "CLERK_SECRET_KEY not configured" });
    if (!SHEETS_CLIENT_EMAIL || !SHEETS_PRIVATE_KEY || !SHEETS_SPREADSHEET_ID) {
      return json(500, { error: "Google Sheets credentials not configured" });
    }

    const user = await verifyClerkUser(req.headers.get("Authorization"));
    if (!user) return json(401, { error: "Unauthorized" });

    const body = (await req.json()) as IntensityPayload;
    if (
      typeof body?.power !== "number" ||
      typeof body?.distance !== "number" ||
      typeof body?.intensity !== "number"
    ) {
      return json(400, { error: "power, distance, intensity must be numbers" });
    }

    const accessToken = await getGoogleAccessToken();
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_SPREADSHEET_ID}`;

    // Read existing rows from row 7 onward in column A to compute next "No"
    const readUrl = `${baseUrl}/values/${SHEET_TAB_ENC}!A7:A`;
    const readRes = await fetch(readUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const readData = await readRes.json();
    if (!readRes.ok) {
      console.error("Sheets read error", readData);
      return json(502, { error: "Failed to read sheet", detail: readData });
    }
    const existing = (readData.values ?? []) as string[][];
    const filledCount = existing.filter((r) => r[0] && String(r[0]).trim() !== "").length;
    const nextNo = filledCount + 1;
    const rowNumber = 7 + filledCount; // exact row we will write to

    const id = deriveIdentity(user);
    const row = [
      nextNo,
      id.userId,
      id.username,
      id.fullName,
      body.power,
      body.distance,
      body.intensity,
      "", // TI hitung — left blank, filled by user
    ];

    // Write directly to the computed row to guarantee a known rowNumber for later updates.
    const writeUrl =
      `${baseUrl}/values/${SHEET_TAB_ENC}!A${rowNumber}:H${rowNumber}` +
      `?valueInputOption=USER_ENTERED`;
    const writeRes = await fetch(writeUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });
    const writeData = await writeRes.json();
    if (!writeRes.ok) {
      console.error("Sheets write error", writeData);
      return json(502, { error: "Failed to write row", detail: writeData });
    }

    return json(200, { success: true, rowNumber, no: nextNo, identity: id });
  } catch (err) {
    console.error("append-intensity-data error", err);
    return json(500, { error: (err as Error).message });
  }
});
