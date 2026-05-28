// Fetch a student's saved LKPD essay answers from a per-stage Google Sheet tab.
// Returns empty fields object if the sheet or user row doesn't exist yet.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const SHEET_FIELDS: Record<string, string[]> = {
  "Orientasi - Doppler": ["observasi"],
  "Perumusan Masalah - Doppler": ["pertanyaan_penelitian", "variabel_bebas", "variabel_terikat", "variabel_kontrol"],
  "Perumusan Hipotesis - Doppler": ["hipotesis"],
  "Pengumpulan Data - Doppler": ["pertanyaan_analisis"],
  "Pengujian Hipotesis - Doppler": ["deskripsi_data", "evaluasi_hipotesis"],
  "Penarikan Kesimpulan - Doppler": ["kesimpulan_ilmiah", "koneksi_aplikasi_nyata"],
  "Orientasi - Intensitas": ["observasi"],
  "Perumusan Masalah - Intensitas": ["pertanyaan_penelitian", "variabel_bebas", "variabel_terikat", "variabel_kontrol"],
  "Perumusan Hipotesis - Intensitas": ["hipotesis"],
  "Pengumpulan Data - Intensitas": ["pertanyaan_analisis"],
  "Pengujian Hipotesis - Intensitas": ["deskripsi_data", "evaluasi_hipotesis"],
  "Penarikan Kesimpulan - Intensitas": ["kesimpulan_ilmiah", "koneksi_aplikasi_nyata"],
};

const CLERK_SECRET_KEY = Deno.env.get("CLERK_SECRET_KEY") ?? "";
const SHEETS_CLIENT_EMAIL = Deno.env.get("GOOGLE_SHEETS_CLIENT_EMAIL") ?? "";
const SHEETS_PRIVATE_KEY = (Deno.env.get("GOOGLE_SHEETS_PRIVATE_KEY") ?? "").replace(/\\n/g, "\n");
const SHEETS_SPREADSHEET_ID = Deno.env.get("GOOGLE_SHEETS_SPREADSHEET_ID") ?? "";

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
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  const keyBytes = pemToPkcs8Bytes(SHEETS_PRIVATE_KEY);
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8", keyBytes, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(unsigned)),
  );
  const jwt = `${unsigned}.${b64urlFromBytes(sig)}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) throw new Error(`Google token exchange failed: ${JSON.stringify(data)}`);
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
  } catch { return null; }
  if (!sub) return null;
  const userRes = await fetch(`https://api.clerk.com/v1/users/${sub}`, {
    headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
  });
  if (!userRes.ok) return null;
  return await userRes.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!CLERK_SECRET_KEY) return json(500, { error: "CLERK_SECRET_KEY not configured" });
    if (!SHEETS_CLIENT_EMAIL || !SHEETS_PRIVATE_KEY || !SHEETS_SPREADSHEET_ID) {
      return json(500, { error: "Google Sheets credentials not configured" });
    }

    const user = await verifyClerkUser(req.headers.get("Authorization"));
    if (!user) return json(401, { error: "Unauthorized" });

    const url = new URL(req.url);
    const sheetName = url.searchParams.get("sheetName") ?? "";
    if (!sheetName || !SHEET_FIELDS[sheetName]) {
      return json(400, { error: "Invalid or unknown sheetName" });
    }

    const fieldNames = SHEET_FIELDS[sheetName];
    const accessToken = await getGoogleAccessToken();
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_SPREADSHEET_ID}`;
    const encodedTab = encodeURIComponent(sheetName);
    const lastCol = String.fromCharCode("E".charCodeAt(0) + fieldNames.length - 1);

    const readUrl = `${baseUrl}/values/${encodedTab}!A2:${lastCol}?valueRenderOption=UNFORMATTED_VALUE`;
    const readRes = await fetch(readUrl, { headers: { Authorization: `Bearer ${accessToken}` } });

    // Sheet doesn't exist yet — return empty fields gracefully
    if (readRes.status === 400) {
      return json(200, { success: true, fields: {} });
    }

    const readData = await readRes.json();
    if (!readRes.ok) {
      // Could be sheet-not-found error from Sheets API
      const errMsg = readData?.error?.message ?? "";
      if (errMsg.includes("Unable to parse range")) {
        return json(200, { success: true, fields: {} });
      }
      console.error("Sheets read error", readData);
      return json(502, { error: "Failed to read sheet", detail: readData });
    }

    const rows = (readData.values ?? []) as any[][];
    const userRow = rows.find((r) => r[1] === user.id);
    if (!userRow) return json(200, { success: true, fields: {} });

    // Col A=No, B=userId, C=username, D=fullName, E+=fields
    const fields: Record<string, string> = {};
    fieldNames.forEach((name, i) => {
      fields[name] = userRow[4 + i] !== undefined && userRow[4 + i] !== null
        ? String(userRow[4 + i])
        : "";
    });

    return json(200, { success: true, fields });
  } catch (err) {
    console.error("get-lkpd-uraian error", err);
    return json(500, { error: (err as Error).message });
  }
});
