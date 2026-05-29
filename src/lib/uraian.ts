const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const BASE = `https://${projectId}.supabase.co/functions/v1`;

/**
 * In-session cache of loaded LKPD essay answers, keyed by sheet name.
 * Lets the menu pages prefetch all answers so that opening a stage shows the
 * saved text instantly (no fetch wait, no flash of an empty field). Kept fresh
 * on every save.
 */
const cache = new Map<string, Record<string, string>>();

/** Sheet names per learning path — used for prefetching from the menu pages. */
export const DOPPLER_SHEETS = [
  "Orientasi - Doppler",
  "Perumusan Masalah - Doppler",
  "Perumusan Hipotesis - Doppler",
  "Pengumpulan Data - Doppler",
  "Pengujian Hipotesis - Doppler",
  "Penarikan Kesimpulan - Doppler",
];

export const INTENSITAS_SHEETS = [
  "Orientasi - Intensitas",
  "Perumusan Masalah - Intensitas",
  "Perumusan Hipotesis - Intensitas",
  "Pengumpulan Data - Intensitas",
  "Pengujian Hipotesis - Intensitas",
  "Penarikan Kesimpulan - Intensitas",
];

/** Synchronously read already-cached fields for a sheet (undefined if not loaded yet). */
export function getCachedUraian(sheetName: string): Record<string, string> | undefined {
  return cache.get(sheetName);
}

export async function saveUraian(
  token: string | null,
  sheetName: string,
  fields: Record<string, string>,
): Promise<void> {
  if (!token) throw new Error("No auth token");
  // Optimistically keep the cache in sync with the latest edits.
  cache.set(sheetName, { ...fields });
  const res = await fetch(`${BASE}/save-lkpd-uraian`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ sheetName, fields }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data?.error ?? "Gagal menyimpan");
}

export async function getUraian(
  token: string | null,
  sheetName: string,
  opts: { force?: boolean } = {},
): Promise<Record<string, string>> {
  if (!opts.force) {
    const cached = cache.get(sheetName);
    if (cached) return cached;
  }
  if (!token) return {};
  const res = await fetch(
    `${BASE}/get-lkpd-uraian?sheetName=${encodeURIComponent(sheetName)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await res.json();
  if (!res.ok || !data.success) return {};
  const fields = data.fields ?? {};
  cache.set(sheetName, fields);
  return fields;
}

/**
 * Warm the cache for a set of sheets in the background. Call this from a menu
 * page so the answers are already loaded by the time a stage is opened.
 * Failures are swallowed — a stage will simply fetch on its own as a fallback.
 */
export async function prefetchUraian(token: string | null, sheetNames: string[]): Promise<void> {
  if (!token) return;
  await Promise.all(
    sheetNames.map((s) => getUraian(token, s).catch(() => ({}))),
  );
}
