import { useState } from "react";
import { Database, Play, RotateCcw, Siren, MessageCircle, Lightbulb, Target, FileSpreadsheet } from "lucide-react";

export const ObservationLKPD = () => (
  <div className="space-y-3">
    <p className="text-sm font-medium text-foreground">Pilih fenomena Efek Doppler untuk diamati:</p>
    <button className="w-full rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-1">
      <Siren className="h-5 w-5 text-foreground/70" />
      <span className="text-sm font-medium">Sirine Ambulans</span>
    </button>
    <p className="text-sm font-medium text-foreground mt-3">Catat hasil observasimu tentang Efek Doppler:</p>
    <div className="rounded-xl border border-border bg-card p-3 text-xs text-foreground/75 space-y-1.5">
      <p>Apa yang kamu perhatikan tentang perubahan bunyi? Pertimbangkan:</p>
      <p>• Apa yang terjadi pada nada saat sumber mendekatimu?</p>
      <p>• Bagaimana nada berubah saat sumber menjauh?</p>
      <p>• Apakah sumber bunyi itu sendiri berubah bunyinya?</p>
      <p>• Faktor apa yang memengaruhi seberapa besar perubahannya?</p>
    </div>
    <textarea
      placeholder="Tuliskan observasimu di sini... contoh: Saat ambulans mendekat, suara sirine terdengar lebih tinggi dan makin keras, lalu tiba-tiba menjadi lebih rendah setelah melewati saya..."
      className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-24 outline-none focus:ring-2 focus:ring-lkpd/30"
    />
    <div className="rounded-xl bg-surface-soft-purple p-3 text-xs text-foreground/85">
      <b className="text-lkpd">💡 Pertanyaan Refleksi:</b>
      <p className="mt-1">
        Menurut kamu, apakah perubahan nada yang terdengar bergantung pada seberapa cepat sumber bergerak? Semakin
        cepat berarti perubahan lebih besar? Tuliskan perkiraanmu!
      </p>
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
    <div className="rounded-xl bg-surface-soft-purple p-3 text-xs text-foreground/85">
      <p className="font-semibold text-lkpd flex items-center gap-1">🎯 Cek Kualitas:</p>
      <p>✓ Apakah pertanyaanmu berfokus pada variabel Efek Doppler?</p>
      <p>✓ Dapatkah kamu mengujinya dengan simulator atau eksperimen?</p>
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
    <p className="text-sm font-medium">Prediksi hubungan antara variabel Doppler:</p>
    <div className="grid grid-cols-2 gap-2">
      {["Berbanding lurus", "Berbanding terbalik", "f' > f₀ saat mendekati", "f' < f₀ saat menjauh"].map((c) => (
        <button key={c} className="rounded-xl border border-border bg-card text-xs px-2 py-2 hover:bg-secondary">
          {c}
        </button>
      ))}
    </div>
    <textarea
      placeholder="contoh: Jika kecepatan sumber bunyi (vₛ) semakin besar saat mendekati pengamat, maka ..."
      className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
    />
    <div className="rounded-xl bg-surface-soft-purple p-3 text-xs text-foreground/85">
      <p className="font-semibold text-lkpd">✓ Daftar Periksa Hipotesis:</p>
      <p>☐ Menyebutkan variabel bebas dengan jelas</p>
      <p>☐ Menyebutkan variabel terikat dengan jelas</p>
      <p>☐ Menyertakan penalaran berbasis rumus Doppler</p>
      <p>☐ Membedakan kondisi mendekati dan menjauh</p>
    </div>
  </div>
);

export const SimulatorLKPD = () => {
  const [direction, setDirection] = useState<"approach" | "leave">("approach");
  const [vs, setVs] = useState(60);
  const fs = 300;
  const v = 343;
  const denom = direction === "approach" ? v - vs : v + vs;
  const fp = ((fs * v) / denom).toFixed(1);

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-card border border-border p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Visualisasi Muka Gelombang</p>
          <div className="flex gap-1">
            <button className="h-7 w-7 rounded-md bg-lkpd/15 text-lkpd flex items-center justify-center">
              <Play className="h-3.5 w-3.5" />
            </button>
            <button className="h-7 w-7 rounded-md bg-muted flex items-center justify-center">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <DopplerSim direction={direction} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setDirection("approach")}
          className={`rounded-xl border p-2 text-sm ${
            direction === "approach"
              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
              : "border-border bg-card text-foreground/70"
          }`}
        >
          🚗 → 👂 Mendekati
        </button>
        <button
          onClick={() => setDirection("leave")}
          className={`rounded-xl border p-2 text-sm ${
            direction === "leave"
              ? "border-rose-300 bg-rose-50 text-rose-700"
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
        <div className="h-1.5 bg-info/15 rounded-full overflow-hidden">
          <div className="h-full bg-info" style={{ width: "30%" }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>100 Hz</span><span>1000 Hz</span>
        </div>
        <div className="flex justify-between text-sm pt-2">
          <span>Kecepatan Sumber (vₛ)</span>
          <span className="font-bold text-lkpd">{vs} m/s</span>
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

      <button className="w-full rounded-xl bg-lkpd text-white py-3 font-semibold flex items-center justify-center gap-2">
        <Database className="h-4 w-4" /> Catat Data
      </button>
      <div className="rounded-xl bg-card border border-border p-3 text-sm">
        <p className="font-semibold">Data yang Terkumpul</p>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Belum ada data. Atur parameter lalu tekan "Catat Data".
        </p>
      </div>
    </div>
  );
};

const DopplerSim = ({ direction }: { direction: "approach" | "leave" }) => (
  <svg viewBox="0 0 340 160" className="w-full mt-2">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(var(--surface-soft-purple))" />
        <stop offset="100%" stopColor="hsl(var(--surface-pink))" />
      </linearGradient>
    </defs>
    <rect width="340" height="160" rx="12" fill="url(#bg)" />
    {[20, 38, 56, 74, 92].map((r, i) => (
      <circle
        key={r}
        cx={direction === "approach" ? 100 + i * 4 : 100 - i * 2}
        cy={80}
        r={r}
        fill="none"
        stroke="hsl(var(--lkpd) / 0.45)"
        strokeWidth={1.2}
      />
    ))}
    <circle cx={100} cy={80} r={14} fill="hsl(var(--stage-5))" />
    <text x={100} y={84} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">S</text>
    <text x={100} y={108} textAnchor="middle" fontSize={9} fill="hsl(var(--foreground))">Sumber</text>
    <circle cx={290} cy={80} r={14} fill="hsl(var(--stage-3))" />
    <text x={290} y={84} textAnchor="middle" fontSize={10} fill="white" fontWeight="bold">P</text>
    <text x={290} y={108} textAnchor="middle" fontSize={9} fill="hsl(var(--foreground))">Pengamat</text>
    <text x={170} y={30} textAnchor="middle" fontSize={9} fill="hsl(var(--stage-3))">
      → {direction === "approach" ? "Mendekati Pengamat" : "Menjauhi Pengamat"}
    </text>
  </svg>
);

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
