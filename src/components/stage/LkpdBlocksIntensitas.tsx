import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Volume2, MessageCircle, Lightbulb, Trash2, Database, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* ============================ Tahap 1: Observasi ============================ */
export const IntensitasObservationLKPD = () => (
  <div className="space-y-3">
    <p className="text-sm font-medium text-foreground">Fenomena intensitas bunyi yang diamati:</p>
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-1">
      <Volume2 className="h-6 w-6 text-foreground/70" />
      <span className="text-sm font-semibold">Sound 1 (Keras)</span>
      <span className="text-xs text-muted-foreground">~110–120 dB</span>
    </div>
    <p className="text-sm font-medium text-foreground mt-3">
      Catat hasil observasimu tentang intensitas bunyi:
    </p>
    <div className="rounded-xl border border-border bg-card p-3 text-xs text-foreground/75 space-y-1.5">
      <p>Apa yang kamu perhatikan? Pertimbangkan:</p>
      <p>• Seberapa keras bunyi terdengar?</p>
      <p>• Apakah berubah jika kamu menjauh dari sumber?</p>
      <p>• Sumber bunyi mana yang paling intens?</p>
    </div>
    <textarea
      placeholder="Tuliskan observasimu di sini... contoh: Saat aku berdiri 1 meter dari speaker, bunyi terasa sangat menyakitkan; saat aku menjauh 4 meter, intensitasnya turun drastis..."
      className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-24 outline-none focus:ring-2 focus:ring-lkpd/30"
    />
    <div className="rounded-xl bg-surface-soft-purple p-3 text-xs text-foreground/85">
      <b className="text-lkpd">💡 Pertanyaan Refleksi:</b>
      <p className="mt-1">
        Menurut kamu, apakah intensitas bunyi yang kamu dengar bergantung pada jarak dan daya sumber? Tuliskan
        perkiraanmu!
      </p>
    </div>
  </div>
);

/* ====================== Tahap 2: Rumuskan Pertanyaan ====================== */
export const IntensitasFormulateQuestionLKPD = () => (
  <div className="space-y-3">
    <div className="rounded-xl bg-card border border-border p-3">
      <p className="text-sm font-semibold flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-lkpd" /> Pemandu Pertanyaan:
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {[
          "Faktor apa yang mempengaruhi I...",
          "Mengapa TI berubah saat...",
          "Apa hubungan jarak dengan...",
          "Bagaimana daya P mempengaruhi...",
        ].map((c) => (
          <span key={c} className="text-xs px-3 py-1 rounded-full bg-surface-soft-purple text-lkpd">
            {c}
          </span>
        ))}
      </div>
    </div>
    <p className="text-sm font-medium text-foreground">
      Tuliskan rumusan pertanyaan penelitianmu tentang intensitas bunyi:
    </p>
    <textarea
      placeholder="contoh: Bagaimana pengaruh jarak (r) terhadap taraf intensitas (TI) bunyi yang diterima pengamat dari sumber dengan daya tetap P?"
      className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
    />
    <div className="rounded-xl bg-surface-soft-blue p-3 space-y-2">
      <p className="text-sm font-semibold flex items-center gap-2 text-info">
        <Lightbulb className="h-4 w-4" /> Identifikasi Variabelmu
      </p>
      {[
        ["Variabel Bebas (Yang kamu ubah):", "contoh: jarak r, daya sumber P..."],
        ["Variabel Terikat (Yang kamu ukur):", "contoh: intensitas I, taraf intensitas TI..."],
        ["Variabel Kontrol (Yang kamu jaga tetap):", "contoh: medium udara, intensitas referensi I₀..."],
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

/* ========================= Tahap 3: Hipotesis ========================= */
export const IntensitasHypothesisLKPD = () => (
  <div className="space-y-3">
    <div className="rounded-xl bg-card border border-border p-3">
      <p className="text-sm font-semibold">📝 Template Hipotesis Intensitas Bunyi:</p>
      <p className="text-xs text-foreground/80 mt-2">
        <b>Jika</b> jarak r dari sumber bunyi diperbesar dengan daya sumber tetap...
      </p>
      <p className="text-xs text-foreground/80 mt-1">
        <b>Maka</b> intensitas bunyi I yang diterima pengamat akan menurun secara kuadrat terbalik (∝ 1/r²)...
      </p>
      <p className="text-xs text-foreground/80 mt-1"><b>Karena</b> ...</p>
    </div>
    <p className="text-sm font-medium">Prediksi hubungan antara variabel:</p>
    <div className="grid grid-cols-2 gap-2">
      {[
        "I ∝ P (berbanding lurus)",
        "I ∝ 1/r² (kuadrat terbalik)",
        "TI naik saat r turun",
        "TI turun saat r naik",
      ].map((c) => (
        <button
          key={c}
          className="rounded-xl border border-border bg-card text-xs px-2 py-2 hover:bg-secondary"
        >
          {c}
        </button>
      ))}
    </div>
    <textarea
      placeholder="contoh: Jika jarak r diperbesar 2× dengan P tetap, maka I akan turun menjadi ¼-nya..."
      className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
    />
    <div className="rounded-xl bg-surface-soft-purple p-3 text-xs text-foreground/85">
      <p className="font-semibold text-lkpd">✓ Daftar Periksa Hipotesis:</p>
      <p>☐ Menyebutkan variabel bebas dengan jelas (P atau r)</p>
      <p>☐ Menyebutkan variabel terikat dengan jelas (I atau TI)</p>
      <p>☐ Menyertakan penalaran berbasis rumus I = P/4πr²</p>
    </div>
  </div>
);

/* ============================ Tahap 4: Simulator ============================ */
interface IntensitasEntry {
  no: number;
  P: number;
  r: number;
  I: number;
  TI: string;        // user-entered, manual
  rowNumber?: number; // spreadsheet row, returned by edge function
  saveStatus?: "idle" | "saving" | "saved" | "error";
}

const I0 = 1e-12; // ambang pendengaran W/m²

const formatI = (I: number) =>
  I >= 1e-4 ? I.toFixed(4) : I.toExponential(2);

/* ---- Visualisasi Penyebaran Energi (SVG) ---- */
const EnergyVisualization = ({ P, r }: { P: number; r: number }) => {
  // Map r (1..100m) into svg x position (40..360)
  const svgW = 400;
  const svgH = 180;
  const sourceX = 40;
  const sourceY = svgH / 2;
  const observerX = sourceX + (Math.min(r, 100) / 100) * (svgW - 80);

  // Concentric "energy" rings — opacity decays with distance & grows with P
  const rings = [1, 2, 3, 4, 5, 6];
  const powerBoost = Math.min(1, P / 1000); // 0..1

  return (
    <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-br from-rose-50 via-white to-indigo-50 overflow-hidden">
      {/* Header / legend */}
      <div className="flex items-center justify-between px-3 pt-3 text-xs">
        <span className="font-semibold text-foreground">Visualisasi Penyebaran Energi</span>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Tinggi
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-info" /> Rendah
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-44">
        <defs>
          <radialGradient id="energyGrad" cx="0" cy="0.5" r="1">
            <stop offset="0%" stopColor="hsl(0 85% 60%)" stopOpacity="0.55" />
            <stop offset="40%" stopColor="hsl(28 90% 60%)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="hsl(220 80% 60%)" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* Energy field */}
        <rect
          x={sourceX - 10}
          y={0}
          width={svgW - sourceX + 10}
          height={svgH}
          fill="url(#energyGrad)"
          opacity={0.7 + 0.3 * powerBoost}
        />

        {/* Concentric rings */}
        {rings.map((i) => {
          const radius = i * 28;
          const op = Math.max(0.05, (0.45 - i * 0.06) * (0.5 + powerBoost));
          return (
            <circle
              key={i}
              cx={sourceX}
              cy={sourceY}
              r={radius}
              fill="none"
              stroke={i <= 2 ? "hsl(0 85% 60%)" : i <= 4 ? "hsl(28 90% 60%)" : "hsl(220 80% 60%)"}
              strokeWidth={1.4}
              opacity={op}
            >
              <animate
                attributeName="r"
                from={radius}
                to={radius + 8}
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={`${op};${op * 0.3};${op}`}
                dur={`${2 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Distance line */}
        <line
          x1={sourceX}
          y1={sourceY}
          x2={observerX}
          y2={sourceY}
          stroke="hsl(270 60% 55%)"
          strokeWidth={1.2}
          strokeDasharray="4 4"
          opacity={0.7}
        />
        {/* Vertical guide at observer */}
        <line
          x1={observerX}
          y1={20}
          x2={observerX}
          y2={svgH - 20}
          stroke="hsl(270 60% 55%)"
          strokeWidth={1}
          strokeDasharray="3 3"
          opacity={0.5}
        />
        <text
          x={observerX}
          y={16}
          textAnchor="middle"
          className="fill-violet-700"
          fontSize="11"
          fontWeight="600"
        >
          P ({r}m)
        </text>

        {/* Source */}
        <circle cx={sourceX} cy={sourceY} r={9} fill="hsl(35 95% 55%)" />
        <circle cx={sourceX} cy={sourceY} r={4} fill="white" />
        <text x={sourceX} y={svgH - 8} textAnchor="middle" fontSize="10" className="fill-foreground/60">
          Sumber
        </text>

        {/* Observer */}
        <circle cx={observerX} cy={sourceY} r={7} fill="hsl(15 70% 35%)" />
      </svg>
    </div>
  );
};

export const IntensitasSimulatorLKPD = () => {
  const [P, setP] = useState(448); // Watt
  const [r, setR] = useState(90); // meter
  const [entries, setEntries] = useState<IntensitasEntry[]>([]);
  const [recording, setRecording] = useState(false);
  const debounceTimers = useRef<Record<number, number>>({});
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const safeR = Math.max(r, 1);
  const I = P / (4 * Math.PI * safeR * safeR);

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
        `https://${projectId}.supabase.co/functions/v1/append-intensity-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            power: P,
            distance: safeR,
            intensity: Number(I.toExponential(4)),
          }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error ?? "Gagal mencatat data");

      setEntries((prev) => [
        ...prev,
        {
          no: data.no ?? prev.length + 1,
          P,
          r: safeR,
          I,
          TI: "",
          rowNumber: data.rowNumber,
          saveStatus: "idle",
        },
      ]);
      toast({ title: "Data berhasil dicatat", description: `P=${P}W, r=${safeR}m, I=${formatI(I)} W/m²` });
    } catch (err: any) {
      console.error("intensity record error", err);
      toast({
        title: "Gagal mencatat data. Coba lagi.",
        description: err?.message ?? "",
        variant: "destructive",
      });
    } finally {
      setRecording(false);
    }
  };

  const updateTiOnServer = async (index: number, value: string) => {
    const entry = entries[index];
    if (!entry?.rowNumber) return;
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, saveStatus: "saving" } : e)),
    );
    try {
      const token = await getToken();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/update-intensity-ti`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rowNumber: entry.rowNumber, tiHitung: value }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error ?? "Gagal menyimpan");
      setEntries((prev) =>
        prev.map((e, i) => (i === index ? { ...e, saveStatus: "saved" } : e)),
      );
    } catch (err) {
      console.error("intensity TI update error", err);
      setEntries((prev) =>
        prev.map((e, i) => (i === index ? { ...e, saveStatus: "error" } : e)),
      );
    }
  };

  const handleTiChange = (index: number, value: string) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, TI: value, saveStatus: "idle" } : e)),
    );
    // Debounce server update
    const timers = debounceTimers.current;
    if (timers[index]) window.clearTimeout(timers[index]);
    timers[index] = window.setTimeout(() => updateTiOnServer(index, value), 700);
  };

  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Visualisasi */}
      <EnergyVisualization P={P} r={safeR} />

      {/* Sliders */}
      <div className="rounded-2xl bg-card border border-primary/15 p-4 space-y-3 shadow-card">
        <div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Daya Sumber (P)</span>
            <span className="font-bold text-amber-600">{P} W</span>
          </div>
          <input
            type="range"
            min={1}
            max={1000}
            step={1}
            value={P}
            onChange={(e) => setP(Number(e.target.value))}
            className="w-full mt-1 accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>1 W</span>
            <span>1000 W</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Jarak Pengamat (r)</span>
            <span className="font-bold text-violet-600">{safeR} m</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full mt-1 accent-violet-600"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>1 m</span>
            <span>100 m</span>
          </div>
        </div>
      </div>

      {/* Hasil pengukuran */}
      <div className="rounded-2xl border border-primary/15 bg-violet-50/60 p-4 space-y-3">
        <p className="text-sm font-semibold flex items-center gap-1">📊 Hasil Pengukuran:</p>
        <div className="rounded-xl bg-card border border-violet-200 p-3 text-center">
          <p className="text-xs text-info">Intensitas (I)</p>
          <p className="font-bold text-foreground text-lg leading-tight">{formatI(I)}</p>
          <p className="text-[10px] text-muted-foreground">W/m²</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-[11px] text-amber-900 leading-relaxed">
          ⚠️ <b>Taraf Intensitas (TI)</b> tidak ditampilkan — hitung sendiri menggunakan rumus{" "}
          <span className="font-mono">TI = 10 log(I / I₀)</span> dan isi di kolom tabel!
        </div>
        <div className="rounded-lg bg-card border border-border p-2 text-center font-mono text-[11px] text-foreground/80">
          I = {P}/(4π×{safeR}²) = {formatI(I)} W/m²
        </div>
      </div>

      {/* Catat data */}
      <button
        onClick={handleRecord}
        disabled={recording}
        className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3.5 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60 shadow-elevated"
      >
        <Database className="h-4 w-4" />
        {recording ? "Mencatat..." : `Catat Data (P=${P}W, r=${safeR}m)`}
      </button>

      {/* Tabel data terkumpul */}
      <div className="rounded-2xl bg-card border border-primary/15 p-3 text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Data Terkumpul</p>
          {entries.length > 0 && (
            <button
              onClick={() => setEntries([])}
              className="text-xs text-rose-600 flex items-center gap-1 hover:underline"
              title="Hanya menghapus tampilan lokal — data di spreadsheet tetap tersimpan."
            >
              <Trash2 className="h-3 w-3" /> Hapus
            </button>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Belum ada data. Atur P & r lalu tekan "Catat Data".
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-2 font-semibold">#</th>
                  <th className="p-2 font-semibold">P (W)</th>
                  <th className="p-2 font-semibold">r (m)</th>
                  <th className="p-2 font-semibold">I (W/m²)</th>
                  <th className="p-2 font-semibold bg-amber-50">TI hitung (dB) ✏️</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={`${e.no}-${i}`} className="border-t border-border">
                    <td className="p-2">{e.no}</td>
                    <td className="p-2">{e.P}</td>
                    <td className="p-2">{e.r}</td>
                    <td className="p-2 font-semibold">{formatI(e.I)}</td>
                    <td className="p-2 bg-amber-50/40">
                      <input
                        value={e.TI}
                        onChange={(ev) => handleTiChange(i, ev.target.value)}
                        placeholder="hitung..."
                        className="w-24 rounded-md border border-amber-300 bg-card px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-amber-300"
                      />
                      {e.saveStatus === "saving" && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">Menyimpan...</p>
                      )}
                      {e.saveStatus === "saved" && (
                        <p className="text-[10px] text-emerald-600 mt-0.5">Tersimpan</p>
                      )}
                      {e.saveStatus === "error" && (
                        <p className="text-[10px] text-rose-600 mt-0.5">Gagal menyimpan</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-[11px] text-foreground/70 mt-2 leading-snug">
          💡 Isi kolom <b>TI hitung</b> dengan: TI = 10 × log₁₀(I / 10⁻¹²) — data ini akan muncul di halaman
          Pengujian Hipotesis.
        </p>
      </div>

      {/* Pertanyaan analisis */}
      <div className="rounded-2xl bg-violet-50/70 border border-primary/15 p-3">
        <p className="text-sm font-semibold text-lkpd flex items-center gap-1">📊 Pertanyaan Analisis:</p>
        <p className="text-xs text-foreground/80 mt-1">
          Bagaimana nilai intensitas bunyi (I) ketika jarak pengamat (r) diubah-ubah?
        </p>
        <textarea
          placeholder="Berdasarkan data yang saya kumpulkan, ketika jarak..."
          className="w-full mt-2 rounded-lg border border-primary/20 bg-card p-2 text-xs min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
        />
      </div>
    </div>
  );
};

/* ============================ Video YouTube + Simulator wrapper ============================ */
export const IntensitasObservationVideoLKPD = () => {
  // (Reserved — currently observation LKPD shown in stage 1, video lives in simulator stage)
  return null;
};


export const IntensitasDataAnalysisLKPD = () => (
  <div className="space-y-3">
    <div className="rounded-xl bg-surface-soft-purple p-3">
      <p className="text-sm font-semibold text-lkpd">📋 Data dari Pengumpulan Data</p>
      <p className="text-xs text-foreground/75 mt-1">
        Cek isi TI hitung — apakah hitungannya benar?
      </p>
      <textarea
        placeholder="Salin/tempel data yang kamu kumpulkan di tahap Pengumpulan Data, atau deskripsikan tabel TI hitungmu di sini..."
        className="w-full mt-2 rounded-lg border border-border bg-card p-2 text-xs min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
      />
      <button className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-lkpd text-white font-semibold">
        Cek Jawaban (Soal TI hitung)
      </button>
    </div>

    <div className="rounded-xl bg-card border border-border p-3">
      <p className="text-sm font-semibold">Deskripsikan pola yang kamu temukan dari data:</p>
      <textarea
        placeholder="contoh: Saat r dilipat dua, I turun menjadi seperempatnya. Pola ini sesuai hukum kuadrat terbalik. Saat P dinaikkan, TI bertambah ≈ 3 dB tiap P digandakan..."
        className="w-full mt-2 rounded-lg border border-border bg-card p-2 text-xs min-h-24 outline-none focus:ring-2 focus:ring-lkpd/30"
      />
    </div>

    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
      <p className="text-sm font-semibold text-emerald-800">
        Apakah hipotesismu tentang Intensitas Bunyi:
      </p>
      <p className="text-xs text-emerald-900 mt-1">
        Jelaskan dengan data yang kamu kumpulkan, apakah mendukung atau menyangkal?
      </p>
      <textarea
        placeholder="contoh: Hipotesis saya didukung — data menunjukkan bahwa I ∝ 1/r²..."
        className="w-full mt-2 rounded-lg border border-emerald-200 bg-card p-2 text-xs min-h-20 outline-none focus:ring-2 focus:ring-emerald-300"
      />
    </div>
  </div>
);

/* ============================ Tahap 6: Kesimpulan ============================ */
export const IntensitasConclusionLKPD = () => (
  <div className="space-y-3">
    <div className="rounded-xl bg-card border border-border p-3">
      <p className="text-sm font-semibold flex items-center gap-2">
        ✓ Kesimpulan Ilmiah
      </p>
      <p className="text-xs text-foreground/75 mt-1">
        Rangkum temuanmu dalam satu pernyataan ilmiah tentang intensitas bunyi.
      </p>
      <textarea
        placeholder="contoh: Intensitas bunyi I berbanding lurus dengan daya sumber P dan berbanding terbalik dengan kuadrat jarak r dari sumber, sesuai persamaan I = P/4πr². Taraf intensitas TI mengikuti skala logaritmik..."
        className="w-full mt-2 rounded-lg border border-border bg-card p-2 text-xs min-h-24 outline-none focus:ring-2 focus:ring-lkpd/30"
      />
    </div>
    <div className="rounded-xl bg-surface-soft-purple p-3">
      <p className="text-sm font-semibold flex items-center gap-2 text-lkpd">
        💡 Koneksi Aplikasi Nyata
      </p>
      <p className="text-xs text-foreground/75 mt-1">
        Pilih satu situasi/fenomena intensitas bunyi di kehidupan nyata dan jelaskan bagaimana ia menerapkan
        konsep intensitas bunyi yang kamu pelajari.
      </p>
      <textarea
        placeholder="contoh: Pemakaian APD pada konser adalah penerapan langsung dari batas TI 85 dB..."
        className="w-full mt-2 rounded-lg border border-border bg-card p-2 text-xs min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
      />
    </div>
  </div>
);

/* Map LKPD keys to components */
export const lkpdContentIntensitas: Record<string, () => JSX.Element> = {
  "intensitas-observation": IntensitasObservationLKPD,
  "intensitas-formulate-question": IntensitasFormulateQuestionLKPD,
  "intensitas-hypothesis": IntensitasHypothesisLKPD,
  "intensitas-simulator": IntensitasSimulatorLKPD,
  "intensitas-data-analysis": IntensitasDataAnalysisLKPD,
  "intensitas-conclusion": IntensitasConclusionLKPD,
};
