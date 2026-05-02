import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Database, Pause, Play, RotateCcw, Siren, MessageCircle, Lightbulb, Target, Trash2, FileSpreadsheet } from "lucide-react";
import { DopplerWaveCanvas, type DopplerWaveCanvasHandle } from "./DopplerWaveCanvas";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DopplerEntry {
  no: number;
  mode: "approach" | "leave";
  fs: number;
  vs: number;
  fp: string;
}


export const ObservationLKPD = () => (
  <div className="space-y-3">
    <p className="text-sm font-medium text-foreground">Pilih fenomena Efek Doppler untuk diamati:</p>
    <button className="w-full rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-1">
      <Siren className="h-5 w-5 text-foreground/70" />
      <span className="text-sm font-medium">Sirine Ambulans</span>
    </button>
    <p className="text-sm font-medium text-foreground mt-3">Catat hasil observasimu tentang Efek Doppler:</p>
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-sm text-foreground/85">
        Mengapa nada suara ambulans yang lewat terdengar lebih tinggi saat mendekat dan lebih rendah saat menjauh?
      </p>
      <textarea
        placeholder="Tuliskan observasimu di sini... contoh: Saat ambulans mendekat, suara sirine terdengar lebih tinggi dan makin keras, lalu tiba-tiba menjadi lebih rendah setelah melewati saya..."
        className="w-full mt-2 rounded-lg border border-border bg-card p-3 text-xs text-foreground/75 min-h-24 outline-none focus:ring-2 focus:ring-lkpd/30"
      />
    </div>
  </div>
);

export const FormulateQuestionLKPD = () => (
  <div className="space-y-3">
    <div className="rounded-xl bg-card border border-border p-3">
      <p className="text-sm font-semibold flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-lkpd" /> Pemandu Pertanyaan:
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {["Faktor apa yang mempengaruhi...", "Mengapa...", "Apa hubungan antara...", "Bagaimana... mempengaruhi..."].map(
          (c) => (
            <span key={c} className="text-xs px-3 py-1 rounded-full bg-surface-soft-purple text-lkpd">
              {c}
            </span>
          )
        )}
      </div>
    </div>
    <p className="text-sm font-medium text-foreground">Tuliskan pertanyaan penelitianmu:</p>
    <textarea
      placeholder="contoh: Bagaimana pengaruh kecepatan gerak sumber bunyi terhadap frekuensi yang terdengar oleh pengamat dalam efek Doppler?"
      className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
    />
    <div className="rounded-xl bg-surface-soft-blue p-3 space-y-2">
      <p className="text-sm font-semibold flex items-center gap-2 text-info">
        <Lightbulb className="h-4 w-4" /> Identifikasi Variabelmu
      </p>
      {[
        ["Variabel Bebas (Yang kamu ubah):", "contoh: kecepatan sumber (vₛ), arah gerak..."],
        ["Variabel Terikat (Yang kamu ukur):", "contoh: frekuensi pengamat, ..."],
        ["Variabel Kontrol (Yang kamu jaga tetap):", "contoh: frekuensi sumber, kecepatan pengamat..."],
      ].map(([label, ph]) => (
        <div key={label}>
          <p className="text-xs font-semibold text-info">{label}</p>
          <input
            placeholder={ph}
            className="w-full mt-1 rounded-lg border border-info/30 bg-card px-2.5 py-1.5 text-xs outline-none"
          />
        </div>
      ))}
    </div>
  </div>
);

export const HypothesisLKPD = () => (
  <div className="space-y-3">
    <div className="rounded-xl bg-card border border-border p-3">
      <p className="text-sm font-semibold">📝 Template Hipotesis Efek Doppler:</p>
      <p className="text-xs text-foreground/80 mt-2">
        <b>Jika</b> kecepatan sumber bunyi (vₛ) meningkat dan sumber bergerak mendekati pengamat...
      </p>
      <p className="text-xs text-foreground/80 mt-1">
        <b>Maka</b> frekuensi yang terdengar (f') akan semakin tinggi dari frekuensi sumber (f₀)...
      </p>
      <p className="text-xs text-foreground/80 mt-1"><b>Karena</b> ...</p>
    </div>
    <p className="text-sm font-medium">Tuliskan hipotesismu secara lengkap:</p>
    <textarea
      placeholder="contoh: Jika kecepatan sumber bunyi (vₛ) semakin besar saat mendekati pengamat, maka ..."
      className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-28 outline-none focus:ring-2 focus:ring-lkpd/30"
    />
  </div>
);

export const SimulatorLKPD = () => {
  const [direction, setDirection] = useState<"approach" | "leave">("approach");
  const [vs, setVs] = useState(60);
  const [fs, setFs] = useState(300);
  const [isPlaying, setIsPlaying] = useState(true);
  const [entries, setEntries] = useState<DopplerEntry[]>([]);
  const [recording, setRecording] = useState(false);
  const canvasRef = useRef<DopplerWaveCanvasHandle>(null);
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const v = 343;
  const safeVs = Math.min(vs, 300);
  const denom = direction === "approach" ? v - safeVs : v + safeVs;
  const fp = ((fs * v) / denom).toFixed(1);

  const fsPercent = ((fs - 100) / 900) * 100;

  const handleRecord = async () => {
    if (!isSignedIn || !user) {
      toast({
        title: "Login dulu",
        description: "Kamu perlu login untuk mencatat data ke spreadsheet.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setRecording(true);
    try {
      const token = await getToken();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/append-doppler-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mode: direction === "approach" ? "Mendekati" : "Menjauh",
            fs,
            vs: safeVs,
            fp: Number(fp),
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Gagal mencatat data");

      setEntries((prev) => [
        ...prev,
        { no: data.no ?? prev.length + 1, mode: direction, fs, vs: safeVs, fp },
      ]);
      toast({ title: "Data berhasil dicatat", description: `f' = ${fp} Hz pada vₛ = ${safeVs} m/s` });
    } catch (err: any) {
      console.error("catat-data error", err);
      toast({
        title: "Gagal mencatat",
        description: err?.message ?? "Coba lagi sebentar.",
        variant: "destructive",
      });
    } finally {
      setRecording(false);
    }
  };


  const handleClear = () => setEntries([]);
  const handleReset = () => canvasRef.current?.reset();

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-card border border-border p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Visualisasi Muka Gelombang</p>
          <div className="flex gap-1">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="h-7 w-7 rounded-md bg-lkpd/15 text-lkpd flex items-center justify-center"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={handleReset}
              className="h-7 w-7 rounded-md bg-muted flex items-center justify-center"
              aria-label="Reset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <DopplerWaveCanvas
          ref={canvasRef}
          frequency={fs}
          sourceSpeed={safeVs}
          mode={direction}
          isPlaying={isPlaying}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setDirection("approach")}
          className={`rounded-xl border p-2 text-sm transition-colors ${
            direction === "approach"
              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
              : "border-border bg-card text-foreground/70"
          }`}
        >
          🚗 → 👂 Mendekati
        </button>
        <button
          onClick={() => setDirection("leave")}
          className={`rounded-xl border p-2 text-sm transition-colors ${
            direction === "leave"
              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
              : "border-border bg-card text-foreground/70"
          }`}
        >
          👂 ← 🚗 Menjauh
        </button>
      </div>

      <div className="rounded-xl bg-card border border-border p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Frekuensi Sumber (f₀)</span>
          <span className="font-bold text-info">{fs} Hz</span>
        </div>
        <input
          type="range"
          min={100}
          max={1000}
          step={10}
          value={fs}
          onChange={(e) => setFs(Number(e.target.value))}
          className="w-full accent-info"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100 Hz</span><span>{Math.round(fsPercent)}%</span><span>1000 Hz</span>
        </div>
        <div className="flex justify-between text-sm pt-2">
          <span>Kecepatan Sumber (vₛ)</span>
          <span className="font-bold text-lkpd">{safeVs} m/s</span>
        </div>
        <input
          type="range"
          min={0}
          max={300}
          value={vs}
          onChange={(e) => setVs(Number(e.target.value))}
          className="w-full accent-lkpd"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 m/s (diam)</span><span>300 m/s</span>
        </div>
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
        <p className="text-sm font-semibold text-emerald-800 flex items-center gap-1">
          📊 Hasil Perhitungan Efek Doppler:
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="rounded-lg bg-card border border-emerald-100 p-2 text-center">
            <p className="text-xs text-info">f₀ (Sumber)</p>
            <p className="font-bold text-foreground">{fs} Hz</p>
          </div>
          <div className="rounded-lg bg-card border border-emerald-100 p-2 text-center">
            <p className="text-xs text-lkpd">f' (Teramati)</p>
            <p className="font-bold text-foreground">{fp} Hz</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleRecord}
        disabled={recording}
        className="w-full rounded-xl bg-lkpd text-white py-3 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
      >
        <Database className="h-4 w-4" /> {recording ? "Mencatat..." : "Catat Data"}
      </button>

      <div className="rounded-xl bg-card border border-border p-3 text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Data yang Terkumpul</p>
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 flex items-center gap-1 hover:underline"
            >
              <Trash2 className="h-3 w-3" /> Hapus Data
            </button>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Belum ada data. Atur parameter lalu tekan "Catat Data".
          </p>
        ) : (
          <div className="mt-2 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-2 font-semibold">No</th>
                  <th className="p-2 font-semibold">Mode</th>
                  <th className="p-2 font-semibold">f₀</th>
                  <th className="p-2 font-semibold">vₛ</th>
                  <th className="p-2 font-semibold">f'</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.no} className="border-t border-border animate-fade-in">
                    <td className="p-2">{e.no}</td>
                    <td className="p-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          e.mode === "approach"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {e.mode === "approach" ? "Mendekati" : "Menjauh"}
                      </span>
                    </td>
                    <td className="p-2">{e.fs}</td>
                    <td className="p-2 font-bold">{e.vs}</td>
                    <td className="p-2 font-bold text-lkpd">{e.fp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export const DataTableLKPD = () => {
  const rows = [0, 30, 60, 90, 120, 150, 180, 200];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 text-sm py-2">
          🚗 → Mendekati
        </button>
        <button className="rounded-xl bg-card border border-border text-sm py-2">← 🚗 Menjauh</button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden text-xs">
        <div className="bg-surface-soft-blue p-2">
          <p className="font-mono">🧮 Hitung fp menggunakan rumus Doppler</p>
          <p className="font-mono text-foreground/70">vp = 0 m/s · fs = 500 Hz · v = 343 m/s</p>
        </div>
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="text-left">
              <th className="p-2 font-semibold">No</th>
              <th className="p-2 font-semibold">vₛ</th>
              <th className="p-2 font-semibold">vₚ</th>
              <th className="p-2 font-semibold">fs</th>
              <th className="p-2 font-semibold">fp</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((vs, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-2">{i + 1}</td>
                <td className="p-2 font-bold">{vs}</td>
                <td className="p-2">0</td>
                <td className="p-2">500</td>
                <td className="p-2">
                  <input className="w-16 rounded border border-border px-1 py-0.5" placeholder="hitung..." />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
        <b>📈 Interpretasi Grafik:</b> Kurva non-linear naik — semakin besar vₛ, semakin tinggi f'. Penyebut (v − vₛ)
        mengecil drastis mendekati vₛ = 343 m/s.
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold">Identifikasi Hubungan vₛ dan f':</p>
        {[
          ["📈", "Berbanding Lurus", "vₛ naik → f' naik (sumber mendekati)"],
          ["📉", "Berbanding Terbalik", "vₛ naik → f' turun (sumber menjauh)"],
          ["—", "Tidak Ada Hubungan", "vₛ tidak memengaruhi f'"],
        ].map(([e, t, d]) => (
          <button key={t} className="w-full rounded-xl border border-border bg-card p-2.5 text-left flex gap-2">
            <span>{e}</span>
            <div>
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-xs text-foreground/70">{d}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ConclusionLKPD = () => (
  <div className="space-y-3">
    <div className="rounded-xl bg-card border border-border p-3">
      <p className="text-sm font-semibold flex items-center gap-2">
        <Target className="h-4 w-4 text-lkpd" /> Kesimpulan Ilmiah
      </p>
      <p className="text-xs text-foreground/75 mt-1">Rangkum temuanmu tentang Efek Doppler dari seluruh proses inkuiri.</p>
      <textarea
        placeholder="Berdasarkan penyelidikanku, aku menemukan bahwa Efek Doppler menyebabkan... Data menunjukkan bahwa saat kecepatan sumber meningkat... Rumus Efek Doppler terbukti karena... Hipotesisku tentang hubungan vₛ dan f'..."
        className="w-full mt-2 rounded-lg border border-border bg-card p-2.5 text-xs min-h-28 outline-none"
      />
    </div>
    <div className="rounded-xl bg-surface-soft-purple p-3 text-xs">
      <p className="font-semibold text-lkpd">Sertakan dalam kesimpulanmu:</p>
      <p>• Penjelasan mekanisme Efek Doppler</p>
      <p>• Penjelasan hasil hipotesis dan percobaanmu</p>
      <p>• Perbedaan kondisi mendekati vs menjauh berdasarkan data</p>
    </div>
    <div className="rounded-xl bg-card border border-border p-3">
      <p className="text-sm font-semibold flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-500" /> Koneksi Aplikasi Nyata
      </p>
      <p className="text-xs text-foreground/75 mt-1">
        Pilih salah satu aplikasi di atas dan jelaskan bagaimana prinsip Efek Doppler yang kamu pelajari diterapkan
        dalam teknologi tersebut.
      </p>
      <textarea
        placeholder="Prinsip Efek Doppler yang kupelajari dapat menjelaskan..."
        className="w-full mt-2 rounded-lg border border-border bg-card p-2.5 text-xs min-h-20 outline-none"
      />
    </div>
    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs">
      <p className="font-semibold flex items-center gap-2 text-emerald-800">
        <FileSpreadsheet className="h-4 w-4" /> Buku Ajar & Modul Latihan Soal:
      </p>
      <p className="mt-1">📚 <b>Buku Ajar:</b> Materi Efek Doppler dipelajari secara terstruktur</p>
      <p>📋 <b>Modul:</b> Panduan inkuiri mandiri setiap tahap terpenuhi</p>
      <p>✏️ <b>Latihan Soal:</b> Hitung f' dengan berbagai nilai vₛ dan f₀</p>
    </div>
  </div>
);

export const lkpdContent: Record<string, () => JSX.Element> = {
  observation: ObservationLKPD,
  "formulate-question": FormulateQuestionLKPD,
  hypothesis: HypothesisLKPD,
  simulator: SimulatorLKPD,
  "data-table": DataTableLKPD,
  conclusion: ConclusionLKPD,
};
