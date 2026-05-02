import { Clipboard, Scale, Search, Microscope, Music, Plane, MessageSquare, AlertTriangle, Play } from "lucide-react";
import scientist from "@/assets/avatars/scientist.png";
import { Fraction } from "./Fraction";

/* ----------------------- Reusable formula card ----------------------- */
export const IntensitasFormula = () => (
  <div className="rounded-2xl bg-stage-2 p-4 text-white space-y-3">
    <div>
      <p className="text-[10px] tracking-widest font-semibold opacity-80">RUMUS INTENSITAS BUNYI</p>
      <div className="flex items-center justify-center my-3 font-display italic text-2xl">
        <span>I</span>
        <span className="mx-2">=</span>
        <Fraction num={<span>P</span>} den={<span>A</span>} />
        <span className="mx-2">=</span>
        <Fraction num={<span>P</span>} den={<span>4πr²</span>} />
      </div>
    </div>
    <div className="border-t border-white/15 pt-3">
      <p className="text-[10px] tracking-widest font-semibold opacity-80">RUMUS TARAF INTENSITAS BUNYI</p>
      <div className="flex items-center justify-center my-3 font-display italic text-2xl">
        <span>TI</span>
        <span className="mx-2">= 10 log</span>
        <span className="text-[1.4em] leading-none font-light">(</span>
        <Fraction num={<span>I</span>} den={<span>I₀</span>} />
        <span className="text-[1.4em] leading-none font-light">)</span>
      </div>
    </div>
  </div>
);

/* --------------------------- Materi blocks --------------------------- */

export const IntensitasIntro = () => (
  <div className="space-y-4">
    <div className="rounded-2xl bg-surface-soft-blue p-4">
      <h4 className="font-semibold text-info">Apa itu Intensitas Bunyi?</h4>
      <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
        Intensitas bunyi (I) adalah besaran energi gelombang bunyi yang melewati suatu satuan luas per
        satuan waktu. Makin jauh sumber bunyi dari pendengar, intensitas yang terdeteksi makin kecil — itulah
        sebabnya suara petasan dari dekat terasa jauh lebih keras dibanding dari kejauhan.
      </p>
    </div>
    <div className="rounded-2xl overflow-hidden bg-black relative w-full" style={{ paddingTop: "177.78%" }}>
      <iframe
        src="https://www.youtube.com/embed/BSS-znCnkSU"
        title="Video Mengenal Intensitas Bunyi"
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  </div>
);

export const IntensitasRealWorld = () => (
  <div className="space-y-2.5">
    <p className="text-sm text-foreground/80">
      Intensitas bunyi hadir di hampir semua aktivitas sehari-hari dengan rentang yang sangat lebar:
    </p>
    {[
      {
        Icon: Music,
        t: "Konser Musik Rock",
        badge: "110–120 dB",
        badgeColor: "bg-rose-500",
        d: "Intensitas bunyi di depan panggung bisa mencapai 110–120 dB — cukup untuk merusak pendengaran.",
      },
      {
        Icon: Plane,
        t: "Pesawat Terbang",
        badge: "130–140 dB",
        badgeColor: "bg-rose-600",
        d: "Mesin jet saat lepas landas menghasilkan intensitas hingga ~140 dB — sudah di ambang rasa sakit.",
      },
      {
        Icon: MessageSquare,
        t: "Percakapan Normal",
        badge: "60–65 dB",
        badgeColor: "bg-emerald-500",
        d: "Percakapan sehari-hari menghasilkan sekitar 60–65 dB — nyaman dan aman untuk telinga dalam waktu lama.",
      },
      {
        Icon: AlertTriangle,
        t: "Polusi Suara Lalu Lintas",
        badge: "70–80 dB",
        badgeColor: "bg-amber-500",
        d: "Bising kendaraan di jalan raya bisa mencapai 70–80 dB dan berdampak buruk pada kesehatan jangka panjang.",
      },
    ].map((it) => (
      <div key={it.t} className="rounded-2xl border border-border p-3 flex gap-3 items-start">
        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <it.Icon className="h-5 w-5 text-foreground/70" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-foreground text-sm">{it.t}</p>
            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full whitespace-nowrap ${it.badgeColor}`}>
              {it.badge}
            </span>
          </div>
          <p className="text-xs text-foreground/70 mt-1 leading-snug">{it.d}</p>
        </div>
      </div>
    ))}
  </div>
);

export const IntensitasVariables = () => (
  <div className="space-y-3">
    <IntensitasFormula />
    {[
      { sym: "I", name: "Intensitas Bunyi", unit: "W/m²", desc: "Energi gelombang bunyi yang melewati satu satuan luas per satuan waktu. Inilah yang kita ukur sebagai 'kuat' bunyi." },
      { sym: "P", name: "Daya Sumber Bunyi", unit: "Watt (W)", desc: "Energi yang dipancarkan sumber per detik. Nilainya tetap selama sumber tidak berubah — tidak bergantung pada jarak." },
      { sym: "A", name: "Luas Bidang dilalui Bunyi", unit: "m²", desc: "Luas bidang yang dilalui sumber bunyi. Jika sumber bunyi memancar ke segala arah maka luas bidangnya bola: A = 4πr²." },
      { sym: "r", name: "Jarak dari Sumber", unit: "meter (m)", desc: "Jarak antara sumber bunyi dan pengamat. Variabel ini paling sering kamu ubah dalam eksperimen." },
      { sym: "TI", name: "Taraf Intensitas", unit: "decibel (dB)", desc: "Ukuran logaritmik dari intensitas bunyi. TI = 10 log (I / I₀). Inilah yang sering kita sebut 'volume bunyi' dalam dB." },
      { sym: "I₀", name: "Intensitas Referensi", unit: "10⁻¹² W/m²", desc: "Intensitas ambang pendengaran manusia, dipakai sebagai pembanding pada perhitungan TI. Nilainya tetap." },
    ].map((v) => (
      <div key={v.sym} className="rounded-2xl bg-surface-soft-blue p-3 flex gap-3">
        <span className="font-display italic text-2xl text-info w-10 text-center shrink-0">{v.sym}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">
            {v.name} <span className="text-info text-xs ml-1">Satuan: {v.unit}</span>
          </p>
          <p className="text-xs text-foreground/70 mt-0.5 leading-snug">{v.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

export const IntensitasGoodQuestion = () => (
  <div className="space-y-3">
    <p className="text-sm text-foreground/80">
      Pertanyaan penelitian ilmiah mengarahkan inkuirimu. Pertanyaan tersebut harus:
    </p>
    {[
      { c: "bg-emerald-50 text-emerald-700", t: "Spesifik dan Terfokus", d: "Mendefinisikan dengan jelas apa yang ingin kamu selidiki tentang intensitas bunyi." },
      { c: "bg-sky-50 text-sky-700", t: "Terukur", d: "Dapat dijawab melalui observasi dan pengumpulan data intensitas (W/m²) atau taraf intensitas (dB)." },
      { c: "bg-violet-50 text-violet-700", t: "Berkaitan dengan Variabel", d: "Mengidentifikasi hubungan antara variabel bebas (P, r) dan variabel terikat (I, TI)." },
    ].map((it) => (
      <div key={it.t} className={`rounded-xl p-3 ${it.c}`}>
        <p className="text-sm font-semibold">✓ {it.t}</p>
        <p className="text-xs mt-0.5 opacity-90">{it.d}</p>
      </div>
    ))}
    <div className="rounded-xl bg-amber-50 p-3 text-amber-900">
      <p className="text-sm font-semibold">Kerangka Pertanyaan:</p>
      <p className="text-sm mt-1 font-mono">
        Bagaimana [<span className="text-rose-700">variabel bebas</span>] mempengaruhi [
        <span className="text-rose-700">variabel terikat</span>]?
      </p>
    </div>
  </div>
);

export const IntensitasQuestionTypes = () => (
  <div className="space-y-2.5">
    {[
      { Icon: Clipboard, t: "Pertanyaan Deskriptif", q: '"Faktor apa saja yang mempengaruhi besar intensitas bunyi yang diterima pengamat?"' },
      { Icon: Scale, t: "Pertanyaan Komparatif", q: '"Bagaimana hubungan daya sumber (P) dengan intensitas bunyi (I) pada jarak yang sama?"' },
      { Icon: Search, t: "Pertanyaan Kausal", q: '"Mengapa intensitas bunyi berkurang drastis ketika jarak dari sumber bertambah dua kali?"' },
      { Icon: Microscope, t: "Pertanyaan Investigatif", q: '"Bagaimana perubahan jarak (r) memengaruhi taraf intensitas (TI) yang terdengar?"' },
    ].map((it) => (
      <div key={it.t} className="rounded-2xl bg-surface-soft-purple p-3 flex gap-3">
        <div className="h-9 w-9 rounded-lg bg-card flex items-center justify-center shrink-0">
          <it.Icon className="h-4 w-4 text-foreground/70" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{it.t}</p>
          <p className="text-xs italic text-foreground/70 mt-0.5">{it.q}</p>
        </div>
      </div>
    ))}
  </div>
);

export const IntensitasEquation = () => (
  <div className="space-y-3">
    <IntensitasFormula />
    <div className="rounded-xl bg-amber-50 p-3 text-amber-900 text-sm">
      <p className="font-semibold">⚠ Hukum Kuadrat Terbalik:</p>
      <p className="mt-1 text-xs leading-relaxed">
        Karena bunyi merambat ke segala arah membentuk bola, luas bidangnya A = 4πr². Bila kamu menambahkan
        jarak r menjadi 2× lipat, luasnya membesar 4×, sehingga{" "}
        <b>intensitas turun menjadi seperempat (¼)-nya</b>.
      </p>
    </div>
  </div>
);

export const IntensitasAnalyze = () => (
  <div className="space-y-3">
    <p className="text-sm text-foreground/80">
      Analisis ilmiah data intensitas bunyi memerlukan pemeriksaan pola hubungan antara daya (P), jarak (r),
      intensitas (I), dan taraf intensitas (TI).
    </p>
    <div className="rounded-2xl bg-surface-soft-blue p-3 text-sm">
      <p className="font-semibold text-info">📈 Langkah-langkah:</p>
      <ol className="mt-2 space-y-1 text-foreground/80 text-xs">
        <li><b>1. Hitung I rata-rata</b> menggunakan I = P / 4πr² untuk tiap data.</li>
        <li><b>2. Hitung TI</b> menggunakan TI = 10 log (I / I₀).</li>
        <li><b>3. Bandingkan</b> antara nilai I dan TI hasil hitunganmu.</li>
        <li><b>4. Analisis data:</b> Apakah pola sesuai hipotesis?</li>
      </ol>
    </div>
    <IntensitasFormula />
  </div>
);

export const IntensitasSummary = () => {
  const scale: { value: string; color: string; label: string }[] = [
    { value: "0", color: "bg-zinc-300 text-zinc-900", label: "Ambang pendengaran" },
    { value: "10", color: "bg-zinc-400 text-white", label: "Ruang sunyi, gemerisik daun" },
    { value: "30", color: "bg-emerald-300 text-emerald-900", label: "Percakapan ringan" },
    { value: "60", color: "bg-emerald-500 text-white", label: "Percakapan normal" },
    { value: "85", color: "bg-amber-400 text-amber-900", label: "Keras, sebaiknya pakai APD" },
    { value: "100", color: "bg-amber-500 text-white", label: "Hati-hati, sangat keras" },
    { value: "120", color: "bg-rose-500 text-white", label: "Sakit / gangguan permanen" },
    { value: "140", color: "bg-rose-700 text-white", label: "Ambang nyeri" },
  ];
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-stage-2 p-4 text-white space-y-3">
        <p className="text-[10px] tracking-widest font-semibold opacity-80">RINGKASAN KONSEP</p>
        <div className="space-y-2.5 text-sm">
          <div>
            <p className="font-semibold">Hukum Kuadrat Terbalik</p>
            <p className="opacity-90 text-xs">I ∝ 1 / r² · Intensitas berbanding terbalik dengan kuadrat jarak dari sumber.</p>
          </div>
          <div>
            <p className="font-semibold">Taraf Intensitas</p>
            <p className="opacity-90 text-xs">TI = 10 log (I / I₀) · Skala logaritmik untuk mengukur 'volume' yang dirasakan telinga.</p>
          </div>
          <div>
            <p className="font-semibold">Hubungan Jarak</p>
            <p className="opacity-90 text-xs">ΔTI = 20 log (r₁ / r₂) · Jarak ×2 → TI turun ≈ 6 dB; jarak ×10 → TI turun 20 dB.</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-card border border-border p-3">
        <p className="text-sm font-semibold text-foreground mb-2">Skala Taraf Intensitas Referensi</p>
        <div className="space-y-1.5">
          {scale.map((s) => (
            <div key={s.value} className="flex items-center gap-2 text-xs">
              <span className={`w-10 text-center font-bold rounded-md py-0.5 ${s.color}`}>{s.value}</span>
              <span className="text-foreground/80">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* Map material keys to components */
export const materiContentIntensitas: Record<string, () => JSX.Element> = {
  "intensitas-intro": IntensitasIntro,
  "intensitas-real-world": IntensitasRealWorld,
  "intensitas-variables": IntensitasVariables,
  "intensitas-good-question": IntensitasGoodQuestion,
  "intensitas-question-types": IntensitasQuestionTypes,
  "intensitas-equation": IntensitasEquation,
  "intensitas-analyze": IntensitasAnalyze,
  "intensitas-summary": IntensitasSummary,
};

/* ----------------------- Reflection cards ----------------------- */
export const IntensitasOrientationReflection = () => (
  <div className="rounded-2xl bg-card p-5 shadow-card">
    <div className="flex justify-center -mt-2">
      <img src={scientist} alt="" className="h-32 w-32 object-contain" />
    </div>
    <h3 className="text-center font-bold text-foreground text-xl mt-2">Selamat Datang di Perjalanan Inkuiri!</h3>
    <p className="text-sm text-foreground/80 text-center mt-2 leading-relaxed">
      Mari kita mulai dengan <b>mengamati</b> dan <b>menginterpretasikan</b> bagaimana intensitas bunyi hadir
      di dunia sekitar kita. Perhatikan dengan seksama apa yang kamu dengar dan rasakan.
    </p>
    <div className="rounded-xl border border-info/30 bg-info/5 p-3 mt-4 text-sm text-foreground/85">
      <b className="text-info">Pertanyaan Refleksi:</b> Apa yang sudah kamu ketahui tentang seberapa keras
      bunyi terdengar? Pernahkah kamu mengamati bahwa bunyi yang sama terdengar lebih lemah dari kejauhan?
    </div>
  </div>
);

export const IntensitasAnalyticalReflection = () => (
  <div className="rounded-2xl bg-card p-4 shadow-card">
    <div className="flex gap-3">
      <img src={scientist} alt="" className="h-24 w-24 object-contain shrink-0" />
      <div>
        <p className="inline-block bg-muted px-2 py-0.5 rounded text-sm font-semibold text-foreground">
          Berpikir Analitis dalam Aksi
        </p>
        <p className="text-xs text-foreground/75 mt-2 leading-relaxed">
          Kamu sudah mengamati perbedaan kuat lemahnya bunyi. Kini saatnya memecah fenomena ini — apa
          variabelnya? Apa yang bisa kamu ubah dan apa yang bisa kamu ukur?
        </p>
      </div>
    </div>
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 mt-3 text-xs text-emerald-900">
      <b>💬 Pikirkan:</b> Pada intensitas bunyi, apa saja yang bisa berubah? Daya sumber? Jarak pengamat ke
      sumber? Mana yang paling memengaruhi intensitas yang kamu terima?
    </div>
  </div>
);
