import { Clipboard, Scale, Search, Microscope, Siren, Radar, Star, Car, Stethoscope, Ship, Truck } from "lucide-react";
import scientist from "@/assets/avatars/scientist.png";
import { ParenFraction } from "./Fraction";

/* ----------------------------- Materi blocks ----------------------------- */

export const DopplerIntro = () => (
  <div className="space-y-4">
    <div className="rounded-2xl bg-surface-soft-blue p-4">
      <h4 className="font-semibold text-info">Apa itu Efek Doppler?</h4>
      <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
        Efek Doppler adalah perubahan frekuensi gelombang bunyi yang dirasakan oleh pengamat ketika{" "}
        <b>sumber bunyi</b> dan <b>pengamat</b> bergerak secara relatif satu terhadap yang lain.
      </p>
      <div className="mt-3 space-y-1.5 text-sm text-foreground/80">
        <p className="font-semibold">📌 Prinsip Utama:</p>
        <p>• <b>Sumber mendekati pengamat</b> → muka gelombang termampatkan → frekuensi teramati <b>lebih tinggi</b></p>
        <p>• <b>Sumber menjauhi pengamat</b> → muka gelombang merenggang → frekuensi teramati <b>lebih rendah</b></p>
        <p>• Perubahan ini hanya dirasakan <b>pengamat</b>; frekuensi sumber sesungguhnya tidak berubah!</p>
      </div>
    </div>
    <div className="rounded-2xl overflow-hidden bg-black relative w-full" style={{ paddingTop: "177.78%" }}>
      <iframe
        src="https://www.youtube.com/embed/3XbipIKGNv4"
        title="Video Efek Doppler"
        className="absolute inset-0 w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
    <p className="text-xs text-muted-foreground italic">
      Efek Doppler ditemukan oleh fisikawan Austria <b>Christian Doppler</b> pada tahun 1842 dan kini digunakan di
      radar, medis, hingga astronomi.
    </p>
  </div>
);

export const Variables = () => (
  <div className="space-y-3">
    <DopplerFormula />
    {[
      { sym: "fₛ", name: "Frekuensi Sumber", unit: "Hz", desc: "Frekuensi bunyi yang dipancarkan sumber. Nilainya tetap, tidak berubah karena gerak." },
      { sym: "fₚ", name: "Frekuensi Teramati", unit: "Hz", desc: "Frekuensi yang dirasakan pengamat. Inilah yang berubah akibat Efek Doppler." },
      { sym: "vₚ", name: "Kecepatan Pengamat", unit: "m/s", desc: "Seberapa cepat pengamat bergerak terhadap sumber bunyi." },
      { sym: "vₛ", name: "Kecepatan Sumber", unit: "m/s", desc: "Seberapa cepat sumber bunyi bergerak terhadap pengamat." },
      { sym: "v", name: "Kecepatan Bunyi", unit: "343 m/s", desc: "Kecepatan rambat bunyi di udara pada 20°C. Tetap selama medium tidak berubah." },
    ].map((v) => (
      <div key={v.sym} className="rounded-2xl bg-surface-soft-blue p-3 flex gap-3">
        <span className="font-display italic text-2xl text-info w-8 text-center">{v.sym}</span>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">{v.name}</p>
          <p className="text-info text-xs mt-0.5">Satuan: {v.unit}</p>
          <p className="text-xs text-foreground/70 mt-0.5 leading-snug">{v.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

export const GoodQuestion = () => (
  <div className="space-y-3">
    <p className="text-sm text-foreground/80">
      Pertanyaan penelitian ilmiah mengarahkan inkuirimu. Pertanyaan tersebut harus:
    </p>
    {[
      { c: "bg-emerald-50 text-emerald-700", t: "Spesifik dan Terfokus", d: "Mendefinisikan dengan jelas apa yang ingin kamu selidiki" },
      { c: "bg-sky-50 text-sky-700", t: "Terukur", d: "Dapat dijawab melalui observasi dan pengumpulan data" },
      { c: "bg-violet-50 text-violet-700", t: "Berkaitan dengan Variabel", d: "Mengidentifikasi hubungan variabel bebas dan terikat" },
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

export const QuestionTypes = () => (
  <div className="space-y-2.5">
    {[
      { Icon: Clipboard, t: "Pertanyaan Deskriptif", q: '"Faktor apa saja yang mempengaruhi kecepatan bunyi dalam berbagai medium?"' },
      { Icon: Scale, t: "Pertanyaan Komparatif", q: '"Bagaimana hubungan frekuensi gelombang bunyi dengan panjang gelombangnya?"' },
      { Icon: Search, t: "Pertanyaan Kausal", q: '"Mengapa gelombang bunyi memantul dari permukaan tertentu tapi tidak yang lain?"' },
      { Icon: Microscope, t: "Pertanyaan Investigatif", q: '"Bagaimana perubahan amplitudo mempengaruhi intensitas bunyi?"' },
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

export const DopplerFormula = () => (
  <div className="rounded-2xl bg-stage-2 p-4 text-white">
    <p className="text-[10px] tracking-widest font-semibold opacity-80">RUMUS EFEK DOPPLER</p>
    <div className="flex items-center justify-center my-4 font-display italic text-2xl">
      <span>f<sub className="italic">p</sub></span>
      <span className="mx-2">=</span>
      <ParenFraction
        num={<span>v ± v<sub className="italic">p</sub></span>}
        den={<span>v ± v<sub className="italic">s</sub></span>}
      />
      <span className="ml-2">f<sub className="italic">s</sub></span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="rounded-lg bg-white/10 p-2">
        <p className="bg-white/15 rounded px-2 py-0.5 inline-block mb-1">Aturan tanda <i>vₚ</i></p>
        <p>• Pengamat mendekati sumber bunyi → gunakan tanda <b>+</b></p>
        <p>• Pengamat menjauhi sumber bunyi → gunakan tanda <b>−</b></p>
      </div>
      <div className="rounded-lg bg-white/10 p-2">
        <p className="bg-white/15 rounded px-2 py-0.5 inline-block mb-1">Aturan tanda <i>vₛ</i></p>
        <p>• Sumber bunyi mendekati pengamat → gunakan tanda <b>−</b></p>
        <p>• Sumber bunyi menjauhi pengamat → gunakan tanda <b>+</b></p>
      </div>
    </div>
  </div>
);

export const DopplerEquation = () => (
  <div className="space-y-3">
    <DopplerFormula />
    <div className="rounded-2xl bg-amber-50 p-3 text-amber-900 text-sm">
      <p className="font-semibold">💡 Wawasan Kunci:</p>
      <p className="mt-1 text-xs">
        Semakin cepat sumber bunyi bergerak mendekati pengamat (vₛ), penyebut (v − vₛ) semakin kecil, sehingga
        frekuensi yang didengar pengamat semakin besar.
      </p>
    </div>
    <p className="text-sm font-semibold text-foreground">Prediksi untuk Setiap Skenario:</p>
    {[
      { t: "Pengamat mendekati sumber bunyi", r: "fₚ > fₛ (frekuensi teramati lebih tinggi)", c: "text-emerald-600" },
      { t: "Pengamat menjauhi sumber bunyi", r: "fₚ < fₛ (frekuensi teramati lebih rendah)", c: "text-rose-600" },
      { t: "Sumber bunyi mendekati pengamat", r: "fₚ > fₛ (frekuensi teramati lebih tinggi)", c: "text-emerald-600" },
      { t: "Sumber bunyi menjauhi pengamat", r: "fₚ < fₛ (frekuensi teramati lebih rendah)", c: "text-rose-600" },
    ].map((s) => (
      <div key={s.t} className="rounded-xl border border-border p-3">
        <p className="text-sm text-foreground">{s.t}</p>
        <p className={`text-sm font-semibold mt-0.5 ${s.c}`}>→ {s.r}</p>
      </div>
    ))}
  </div>
);

export const AnalyzeData = () => (
  <div className="space-y-3">
    <p className="text-sm text-foreground/80">
      Analisis ilmiah data Efek Doppler memerlukan pemeriksaan pola hubungan antara kecepatan sumber (vₛ) dan
      frekuensi teramati (f').
    </p>
    <div className="rounded-2xl bg-surface-soft-blue p-3 text-sm">
      <p className="font-semibold text-info">📈 Langkah-langkah Analisis Data Doppler:</p>
      <ol className="mt-2 space-y-1 text-foreground/80 text-xs">
        <li><b>1. Hitung:</b> Gunakan rumus Efek Doppler untuk setiap vₛ</li>
        <li><b>2. Isi Tabel:</b> Masukkan nilai f' hasil hitunganmu ke tabel</li>
        <li><b>3. Visualisasi:</b> Amati pola grafik vₛ vs f'</li>
        <li><b>4. Evaluasi:</b> Apakah data mendukung atau menyangkal hipotesis?</li>
      </ol>
    </div>
    <DopplerFormula />
  </div>
);

export const Applications = () => (
  <div className="space-y-3">
    <p className="text-sm text-foreground/80">
      Efek Doppler menjadi dasar bagi banyak teknologi penting dalam kehidupan modern:
    </p>
    {[
      { Icon: Truck, t: "Sirine Ambulans & Pemadam", d: "Perubahan nada sirine yang kita dengar saat ambulans melintas adalah contoh Efek Doppler paling nyata dalam kehidupan sehari-hari." },
      { Icon: Stethoscope, t: "USG Doppler Medis", d: "Dokter menggunakan Doppler ultrasound untuk mengukur kecepatan aliran darah. Pantulan gelombang USG dari sel darah yang bergerak mengalami pergeseran frekuensi Doppler." },
      { Icon: Ship, t: "Sonar Kapal & Kapal Selam", d: "Sonar aktif menggunakan Efek Doppler untuk mendeteksi kecepatan dan arah gerak objek bawah air, termasuk kapal selam lain dan kawanan ikan." },
    ].map((a) => (
      <div key={a.t} className="rounded-2xl bg-card border border-border p-3 flex gap-3">
        <div className="h-10 w-10 rounded-xl bg-stage-6/10 flex items-center justify-center shrink-0">
          <a.Icon className="h-5 w-5 text-stage-6" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{a.t}</p>
          <p className="text-xs text-foreground/70 mt-0.5 leading-snug">{a.d}</p>
        </div>
      </div>
    ))}
  </div>
);

export const RealWorldDoppler = () => (
  <div className="space-y-2.5">
    <p className="text-sm text-foreground/80">Efek Doppler bukan sekadar teori — ia hadir dalam banyak fenomena di sekitar kita:</p>
    {[
      { Icon: Siren, t: "Sirine Ambulans", d: "Nada sirine terdengar lebih tinggi saat mendekati dan lebih rendah saat menjauh — inilah efek Doppler paling dikenal." },
      { Icon: Radar, t: "Radar Kecepatan Polisi", d: "Polisi menggunakan efek Doppler gelombang elektromagnetik untuk mengukur kecepatan kendaraan secara akurat." },
      { Icon: Star, t: "Redshift Bintang & Galaksi", d: "Astronom mengamati pergeseran frekuensi cahaya bintang untuk menentukan arah dan kecepatan gerak bintang." },
      { Icon: Car, t: "Mobil Balap F1", d: "Suara mesin F1 berubah secara dramatis saat mobil melewati penonton yang merupakan contoh efek Doppler ekstrem." },
    ].map((it) => (
      <div key={it.t} className="rounded-2xl border border-border p-3 flex gap-3">
        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <it.Icon className="h-4 w-4 text-foreground/70" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{it.t}</p>
          <p className="text-xs text-foreground/70 mt-0.5 leading-snug">{it.d}</p>
        </div>
      </div>
    ))}
  </div>
);

/* Map material keys to components */
export const materiContent: Record<string, () => JSX.Element> = {
  "doppler-intro": DopplerIntro,
  variables: Variables,
  "good-question": GoodQuestion,
  "question-types": QuestionTypes,
  equation: DopplerEquation,
  analyze: AnalyzeData,
  applications: Applications,
  "real-world": RealWorldDoppler,
};

/* ----------------------------- Reflection card (Stage 1 hero) ----------------------------- */
export const OrientationReflection = () => (
  <div className="rounded-2xl bg-card p-5 shadow-card">
    <div className="flex justify-center -mt-2">
      <img src={scientist} alt="" className="h-32 w-32 object-contain" />
    </div>
    <h3 className="text-center font-bold text-foreground text-xl mt-2">Selamat Datang di Perjalanan Inkuiri!</h3>
    <p className="text-sm text-foreground/80 text-center mt-2 leading-relaxed">
      Mari kita mulai dengan <b>mengamati</b> dan <b>menginterpretasikan</b> bagaimana gelombang bunyi hadir di
      dunia sekitar kita. Perhatikan dengan seksama apa yang kamu lihat, dengar, dan pikirkan.
    </p>
    <div className="rounded-xl border border-info/30 bg-info/5 p-3 mt-4 text-sm text-foreground/85">
      <b className="text-info">Pertanyaan Refleksi:</b> Apa yang sudah kamu ketahui tentang bagaimana bunyi
      merambat? Fenomena apa yang pernah kamu alami yang melibatkan gelombang bunyi?
    </div>
  </div>
);

export const AnalyticalReflection = () => (
  <div className="rounded-2xl bg-card p-4 shadow-card">
    <div className="flex gap-3">
      <img src={scientist} alt="" className="h-24 w-24 object-contain shrink-0" />
      <div>
        <p className="inline-block bg-muted px-2 py-0.5 rounded text-sm font-semibold text-foreground">
          Berpikir Analitis dalam Aksi
        </p>
        <p className="text-xs text-foreground/75 mt-2 leading-relaxed">
          Kamu sudah mengamati perubahan nada bunyi. Kini saatnya memecah fenomena ini — apa variabel-nya? Apa yang
          bisa kamu ubah dan apa yang bisa kamu ukur?
        </p>
      </div>
    </div>
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 mt-3 text-xs text-emerald-900">
      <b>💬 Pikirkan:</b> Dalam Efek Doppler, apa saja yang bisa berubah? Kecepatan sumber? Frekuensi asal? Arah
      gerak? Mana yang paling memengaruhi frekuensi yang kamu dengar?
    </div>
  </div>
);
