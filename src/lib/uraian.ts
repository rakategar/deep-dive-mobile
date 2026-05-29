const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const BASE = `https://${projectId}.supabase.co/functions/v1`;

export async function saveUraian(
  token: string | null,
  sheetName: string,
  fields: Record<string, string>,
): Promise<void> {
  if (!token) throw new Error("No auth token");
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
): Promise<Record<string, string>> {
  if (!token) return {};
  const res = await fetch(
    `${BASE}/get-lkpd-uraian?sheetName=${encodeURIComponent(sheetName)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await res.json();
  if (!res.ok || !data.success) return {};
  return data.fields ?? {};
}
