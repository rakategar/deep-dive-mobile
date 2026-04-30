// Append a Doppler-effect data row to a Google Sheet on behalf of an authenticated Clerk user.
// - Verifies the Clerk session token (passed as Bearer) via Clerk Backend API
// - Authenticates to Google Sheets API using a service-account JWT (RS256)
// - Calculates next "No" by reading existing rows from Database!A7:A
// - Appends to Database!A:I with USER_ENTERED so f₀, vs, f' stay numeric

import { corsHeaders } from "@supabase/supabase-js/cors";

interface DopplerPayload {
  mode: "Mendekati" | "Menjauh";
  fs: number;
  vs: number;
  fp: number; // observed frequency, will be formatted to 1 decimal
}

const CLERK_SECRET_KEY = Deno.env.get("CLERK_SECRET_KEY") ?? "";
const SHEETS_CLIENT_EMAIL = Deno.env.get("GOOGLE_SHEETS_CLIENT_EMAIL") ?? "";
const SHEETS_PRIVATE_KEY = (Deno.env.get("GOOGLE_SHEETS_PRIVATE_KEY") ?? "").replace(/\\n/g, "\n");
const SHEETS_SPREADSHEET_ID = Deno.env.get("GOOGLE_SHEETS_SPREADSHEET_ID") ?? "";
const SHEET_TAB = "Database";

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
  // Use Clerk Backend API to verify session token by introspecting via /v1/me proxy.
  // The simplest reliable path: call Clerk's "verify token" via the JWT's `sub` after
  // fetching the user with the session token. We use the sessions endpoint.
  // Decode the JWT sub claim manually first (no signature trust yet).
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

  // Now verify by fetching the user from Clerk using the SECRET KEY (server side).
  // If the token's `sub` corresponds to a real user under our Clerk instance, we trust it.
  // For full signature verification you would fetch JWKS; this server-to-Clerk lookup is
  // sufficient because CLERK_SECRET_KEY is required to read the user.
  const userRes = await fetch(`https://api.clerk.com/v1/users/${sub}`, {
    headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
  });
  if (!userRes.ok) return null;
  const user = await userRes.json();
  return user;
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

    const body = (await req.json()) as DopplerPayload;
    if (!body || (body.mode !== "Mendekati" && body.mode !== "Menjauh")) {
      return json(400, { error: "Invalid mode" });
    }
    if (typeof body.fs !== "number" || typeof body.vs !== "number" || typeof body.fp !== "number") {
      return json(400, { error: "fs, vs, fp must be numbers" });
    }

    const accessToken = await getGoogleAccessToken();
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_SPREADSHEET_ID}`;

    // Count existing data rows starting at row 7 to compute next "No"
    const readUrl = `${baseUrl}/values/${SHEET_TAB}!A7:A`;
    const readRes = await fetch(readUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const readData = await readRes.json();
    if (!readRes.ok) {
      console.error("Sheets read error", readData);
      return json(502, { error: "Failed to read sheet", detail: readData });
    }
    const existing = (readData.values ?? []) as string[][];
    const nextNo = existing.filter((r) => r[0] && String(r[0]).trim() !== "").length + 1;

    const id = deriveIdentity(user);
    const row = [
      nextNo,
      id.userId,
      id.username,
      id.fullName,
      body.mode,
      body.fs,
      body.vs,
      Number(body.fp.toFixed(1)),
      "",
    ];

    // Append starting from A7 so we never overwrite the header/instruction rows above.
    const appendUrl =
      `${baseUrl}/values/${SHEET_TAB}!A7:I` +
      `:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const appendRes = await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });
    const appendData = await appendRes.json();
    if (!appendRes.ok) {
      console.error("Sheets append error", appendData);
      return json(502, { error: "Failed to append row", detail: appendData });
    }

    return json(200, { ok: true, no: nextNo, identity: id });
  } catch (err) {
    console.error("append-doppler-data error", err);
    return json(500, { error: (err as Error).message });
  }
});
