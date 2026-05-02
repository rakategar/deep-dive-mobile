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
  TI: number;
}

const I0 = 1e-12; // ambang pendengaran W/m²

export const IntensitasSimulatorLKPD = () => {
  const [P, setP] = useState(100); // Watt
  const [r, setR] = useState(5); // meter
  const [entries, setEntries] = useState<IntensitasEntry[]>([]);

  const safeR = Math.max(r, 0.1);
  const I = P / (4 * Math.PI * safeR * safeR); // W/m²
  const TI = 10 * Math.log10(I / I0);
  const safeAtIThreshold = TI > 85;

  // Posisi pengamat di canvas (skala 1m = 8px, max 100m)
  const px = Math.min(safeR * 4, 220);

  const handleRecord = () => {
    const entry: IntensitasEntry = {
      no: entries.length + 1,
      P,
      r: safeR,
      I: Number(I.toExponential(2)),
      TI: Number(TI.toFixed(1)),
    };
    setEntries((prev) => [...prev, entry]);
    toast({ title: "Data dicatat", description: `I = ${I.toExponential(2)} W/m², TI = ${TI.toFixed(1)} dB` });
  };

  return (
    <div className="space-y-3">
      {/* Visualisasi */}
      <div className="rounded-xl bg-card border border-border p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">Visualisasi Perambatan Energi</p>
          <span className="text-[10px] text-muted-foreground">P = {P} W</span>
        </div>
        <div className="relative h-32 rounded-lg bg-gradient-to-r from-info/5 to-card overflow-hidden">
          {/* Sumber */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <div className="h-7 w-7 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
              <Volume2 className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          {/* Gelombang konsentris */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border-2 border-info/40"
              style={{
                width: `${i * 50}px`,
                height: `${i * 50}px`,
                transform: `translate(-50%, -50%)`,
                opacity: 1 - i * 0.18,
              }}
            />
          ))}
          {/* Pengamat */}
          <div
            className="absolute top-1/2 -translate-y-1/2 z-10 transition-all"
            style={{ left: `${24 + px}px` }}
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
              👤
            </div>
          </div>
        </div>
      </div>

      {/* Slider Daya Sumber */}
      <div className="rounded-xl bg-card border border-border p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Daya Sumber (P)</span>
          <span className="font-bold text-info">{P} W</span>
        </div>
        <input
          type="range"
          min={1}
          max={1000}
          step={1}
          value={P}
          onChange={(e) => setP(Number(e.target.value))}
          className="w-full accent-info"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 W</span>
          <span>1000 W</span>
        </div>

        <div className="flex justify-between text-sm pt-2">
          <span>Jarak Pengamat (r)</span>
          <span className="font-bold text-lkpd">{safeR} m</span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={r}
          onChange={(e) => setR(Number(e.target.value))}
          className="w-full accent-lkpd"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 m</span>
          <span>100 m</span>
        </div>
      </div>

      {/* Hasil Perhitungan */}
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
        <p className="text-sm font-semibold text-emerald-800">📊 Hasil Perhitungan:</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="rounded-lg bg-card border border-emerald-100 p-2 text-center">
            <p className="text-xs text-info">Intensitas (I)</p>
            <p className="font-bold text-foreground text-sm">{I.toExponential(2)}</p>
            <p className="text-[10px] text-muted-foreground">W/m²</p>
          </div>
          <div className="rounded-lg bg-card border border-emerald-100 p-2 text-center">
            <p className="text-xs text-lkpd">Taraf Intensitas (TI)</p>
            <p className="font-bold text-foreground text-sm">{TI.toFixed(1)}</p>
            <p className="text-[10px] text-muted-foreground">dB</p>
          </div>
        </div>
        {safeAtIThreshold && (
          <div className="mt-2 rounded-lg bg-amber-50 border border-amber-300 p-2 text-[11px] text-amber-900">
            ⚠ <b>Taraf Intensitas {TI.toFixed(0)} dB</b> sudah di atas batas aman pendengaran (85 dB) dalam
            paparan lama!
          </div>
        )}
      </div>

      <button
        onClick={handleRecord}
        className="w-full rounded-xl bg-lkpd text-white py-3 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <Database className="h-4 w-4" /> Catat Data (P={P}W, r={safeR}m)
      </button>

      <div className="rounded-xl bg-card border border-border p-3 text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Data Terkumpul</p>
          {entries.length > 0 && (
            <button
              onClick={() => setEntries([])}
              className="text-xs text-rose-600 flex items-center gap-1 hover:underline"
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
          <div className="mt-2 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-2 font-semibold">No</th>
                  <th className="p-2 font-semibold">P (W)</th>
                  <th className="p-2 font-semibold">r (m)</th>
                  <th className="p-2 font-semibold">I (W/m²)</th>
                  <th className="p-2 font-semibold">TI (dB)</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.no} className="border-t border-border">
                    <td className="p-2">{e.no}</td>
                    <td className="p-2">{e.P}</td>
                    <td className="p-2">{e.r}</td>
                    <td className="p-2 font-semibold">{e.I}</td>
                    <td className="p-2 font-bold text-lkpd">{e.TI}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-surface-soft-purple p-3 text-xs text-foreground/85">
        <p className="font-semibold text-lkpd">💡 Pertanyaan Analisis:</p>
        <p className="mt-1">
          Bagaimana nilai intensitas bunyi (I) berubah jika r dilipat dua? Berdasarkan datamu, apakah konsisten
          dengan hukum kuadrat terbalik (I ∝ 1/r²)?
        </p>
      </div>
    </div>
  );
};

/* ============================ Tahap 5: Data & Analisis ============================ */
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
