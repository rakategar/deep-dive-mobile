import { Eye, HelpCircle, Lightbulb, Database, FlaskConical, CheckCircle2 } from "lucide-react";
import type { Stage } from "./stages";

/**
 * Stages khusus cabang "Intensitas Bunyi".
 * Strukturnya identik dengan Doppler (6 tahap inquiry), tapi materi/LKPD beda.
 */
export const stagesIntensitas: Stage[] = [
  {
    id: 1,
    slug: "orientasi",
    title: "Orientation",
    titleId: "Orientasi",
    blurbId: "Jelajahi fenomena intensitas bunyi nyata dan observasi awal",
    thinking: "Interpretasi",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menginterpretasikan fenomena intensitas bunyi nyata dengan memahami informasi visual dan kontekstual, mengidentifikasi konsep kunci seperti taraf intensitas dan daya sumber, serta mengungkapkan pemahamanmu terhadap apa yang diamati.",
    Icon: Eye,
    colorVar: "bg-stage-1",
    textColor: "text-stage-1",
    ctaLabel: "Lanjut ke Perumusan Masalah",
    next: "/intensitas/stage/perumusan-masalah",
    materi: [
      { title: "Mengenal Intensitas Bunyi", key: "intensitas-intro" },
      { title: "Intensitas Bunyi di Kehidupan Nyata", key: "intensitas-real-world" },
    ],
    lkpdTitle: "Kegiatan Observasi: Intensitas Bunyi",
    lkpdKey: "intensitas-observation",
  },
  {
    id: 2,
    slug: "perumusan-masalah",
    title: "Problem Formulation",
    titleId: "Perumusan Masalah",
    blurbId: "Ubah observasimu menjadi pertanyaan penelitian ilmiah tentang intensitas bunyi",
    thinking: "Analisis",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menganalisis fenomena intensitas bunyi dengan memecahnya menjadi komponen-komponen, mengidentifikasi variabel seperti daya sumber (P), luas bidang (A), dan jarak (r), serta merumuskan pertanyaan yang dapat diselidiki.",
    Icon: HelpCircle,
    colorVar: "bg-stage-2",
    textColor: "text-stage-2",
    ctaLabel: "Lanjut ke Perumusan Hipotesis",
    next: "/intensitas/stage/perumusan-hipotesis",
    materi: [
      { title: "Variabel Intensitas Bunyi", key: "intensitas-variables" },
      { title: "Apa itu Pertanyaan Penelitian yang Baik?", key: "intensitas-good-question" },
    ],
    lkpdTitle: "Rumuskan Pertanyaan Penelitianmu",
    lkpdKey: "intensitas-formulate-question",
  },
  {
    id: 3,
    slug: "perumusan-hipotesis",
    title: "Hypothesis Formulation",
    titleId: "Perumusan Hipotesis",
    blurbId: "Kembangkan prediksi logis berdasarkan hukum kuadrat terbalik",
    thinking: "Inferensi",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menggunakan inferensi untuk menarik kesimpulan logis tentang bagaimana daya sumber dan jarak memengaruhi intensitas bunyi yang diterima pengamat.",
    Icon: Lightbulb,
    colorVar: "bg-stage-3",
    textColor: "text-stage-3",
    ctaLabel: "Lanjut ke Pengumpulan Data",
    next: "/intensitas/stage/pengumpulan-data",
    materi: [{ title: "Persamaan Intensitas Bunyi", key: "intensitas-equation" }],
    lkpdTitle: "Rumuskan Hipotesismu",
    lkpdKey: "intensitas-hypothesis",
  },
  {
    id: 4,
    slug: "pengumpulan-data",
    title: "Data Collection",
    titleId: "Pengumpulan Data",
    blurbId: "Jelajahi simulator interaktif intensitas bunyi dan kumpulkan data eksperimental",
    thinking: "Analisis + Evaluasi",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menganalisis data intensitas bunyi yang dikumpulkan dengan mengidentifikasi pola hubungan antara daya, jarak, intensitas, dan taraf intensitas, lalu mengevaluasi keakuratannya untuk menguji hipotesismu.",
    Icon: Database,
    colorVar: "bg-stage-4",
    textColor: "text-stage-4",
    ctaLabel: "Lanjut ke Pengujian Hipotesis",
    next: "/intensitas/stage/pengujian-hipotesis",
    materi: [{ title: "Variabel Intensitas Bunyi", key: "intensitas-variables" }],
    lkpdTitle: "Simulator Intensitas Bunyi",
    lkpdKey: "intensitas-simulator",
  },
  {
    id: 5,
    slug: "pengujian-hipotesis",
    title: "Hypothesis Testing",
    titleId: "Pengujian Hipotesis",
    blurbId: "Analisis data dan bandingkan hasilnya dengan prediksimu",
    thinking: "Evaluasi + Inferensi",
    thinkingDetailId:
      "Pada tahap ini, kamu akan **mengevaluasi** kekuatan dan kredibilitas datamu dengan membandingkannya terhadap hipotesis, lalu menarik **inferensi** apakah bukti mendukung atau menyangkal prediksimu.",
    Icon: FlaskConical,
    colorVar: "bg-stage-5",
    textColor: "text-stage-5",
    ctaLabel: "Lanjut ke Penarikan Kesimpulan",
    next: "/intensitas/stage/penarikan-kesimpulan",
    materi: [{ title: "Menganalisis Data Intensitas Bunyi", key: "intensitas-analyze" }],
    lkpdTitle: "Data & Analisis Intensitas Bunyi",
    lkpdKey: "intensitas-data-analysis",
  },
  {
    id: 6,
    slug: "penarikan-kesimpulan",
    title: "Conclusion Drawing",
    titleId: "Penarikan Kesimpulan",
    blurbId: "Sintesis temuan dan hubungkan dengan aplikasi dunia nyata",
    thinking: "Eksplanasi",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menjelaskan temuanmu tentang intensitas bunyi dengan menyatakan kesimpulan secara jelas dan menghubungkannya dengan situasi dunia nyata.",
    Icon: CheckCircle2,
    colorVar: "bg-stage-6",
    textColor: "text-stage-6",
    ctaLabel: "Kembali ke Beranda",
    next: "/home",
    materi: [
      { title: "Ringkasan Konsep Intensitas Bunyi", key: "intensitas-summary" },
      { title: "Intensitas Bunyi di Kehidupan Nyata", key: "intensitas-real-world" },
    ],
    lkpdTitle: "Tarik Kesimpulanmu",
    lkpdKey: "intensitas-conclusion",
  },
];

export const getIntensitasStageBySlug = (slug?: string) =>
  stagesIntensitas.find((s) => s.slug === slug);
