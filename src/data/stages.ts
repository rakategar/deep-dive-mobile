import { Eye, HelpCircle, Lightbulb, Database, FlaskConical, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Stage {
  id: number;
  slug: string;
  title: string; // English short
  titleId: string; // Indonesian
  blurbId: string;
  thinking: string;
  thinkingDetailId: string;
  Icon: LucideIcon;
  colorVar: string; // tailwind bg-stage-N
  textColor: string;
  ctaLabel: string;
  next?: string;
  materi: { title: string; key: string }[];
  lkpdTitle: string;
  lkpdKey: string;
}

export const stages: Stage[] = [
  {
    id: 1,
    slug: "orientasi",
    title: "Orientation",
    titleId: "Orientasi",
    blurbId: "Observasi fenomena gelombang bunyi dalam kehidupan sehari-hari",
    thinking: "Interpretation",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menginterpretasikan fenomena bunyi nyata dengan memahami informasi visual dan kontekstual, mengidentifikasi konsep kunci, serta mengungkapkan pemahamanmu terhadap apa yang diamati.",
    Icon: Eye,
    colorVar: "bg-stage-1",
    textColor: "text-stage-1",
    ctaLabel: "Lanjut ke Perumusan Masalah",
    next: "/stage/perumusan-masalah",
    materi: [{ title: "Mengenal Efek Doppler", key: "doppler-intro" }],
    lkpdTitle: "Kegiatan Observasi: Efek Doppler",
    lkpdKey: "observation",
  },
  {
    id: 2,
    slug: "perumusan-masalah",
    title: "Problem Formulation",
    titleId: "Perumusan Masalah",
    blurbId: "Merumuskan pertanyaan penelitian dari fenomena yang disajikan",
    thinking: "Analysis",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menganalisis fenomena yang diamati dengan memecahnya menjadi komponen-komponen, mengidentifikasi variabel beserta hubungannya, dan merumuskan pertanyaan yang dapat diselidiki.",
    Icon: HelpCircle,
    colorVar: "bg-stage-2",
    textColor: "text-stage-2",
    ctaLabel: "Lanjut ke Perumusan Hipotesis",
    next: "/stage/perumusan-hipotesis",
    materi: [
      { title: "Variabel-variabel dalam Efek Doppler", key: "variables" },
      { title: "Apa itu Pertanyaan Penelitian yang Baik?", key: "good-question" },
    ],
    lkpdTitle: "Rumuskan Pertanyaan Penelitianmu",
    lkpdKey: "formulate-question",
  },
  {
    id: 3,
    slug: "perumusan-hipotesis",
    title: "Hypothesis Formulation",
    titleId: "Perumusan Hipotesis",
    blurbId: "Membuat hipotesis dari rumusan masalah yang telah dibuat sebelumnya",
    thinking: "Inference",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menggunakan inferensi untuk menarik kesimpulan logis dari pengetahuan dan observasi sebelumnya, membangun prediksi yang dapat diuji tentang perilaku gelombang bunyi.",
    Icon: Lightbulb,
    colorVar: "bg-stage-3",
    textColor: "text-stage-3",
    ctaLabel: "Lanjut ke Pengumpulan Data",
    next: "/stage/pengumpulan-data",
    materi: [{ title: "Persamaan Efek Doppler", key: "equation" }],
    lkpdTitle: "Rumuskan Hipotesismu",
    lkpdKey: "hypothesis",
  },
  {
    id: 4,
    slug: "pengumpulan-data",
    title: "Data Collection",
    titleId: "Pengumpulan Data",
    blurbId: "Mengumpulkan data dari simulasi yang dilakukan",
    thinking: "Analysis + Evaluation",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menganalisis data yang dikumpulkan dengan mengidentifikasi pola dan hubungan, lalu mengevaluasi keakuratan, relevansi, dan keandalannya untuk menguji hipotesismu.",
    Icon: Database,
    colorVar: "bg-stage-4",
    textColor: "text-stage-4",
    ctaLabel: "Lanjut ke Pengujian Hipotesis",
    next: "/stage/pengujian-hipotesis",
    materi: [{ title: "Persamaan Efek Doppler", key: "equation" }],
    lkpdTitle: "Simulator Efek Doppler Interaktif",
    lkpdKey: "simulator",
  },
  {
    id: 5,
    slug: "pengujian-hipotesis",
    title: "Hypothesis Testing",
    titleId: "Pengujian Hipotesis",
    blurbId: "Menganalisis data simulasi dan menguji hipotesis yang telah dibuat sebelumnya",
    thinking: "Evaluation + Inference",
    thinkingDetailId:
      "Pada tahap ini, kamu akan mengevaluasi kekuatan dan kredibilitas datamu dengan membandingkannya terhadap hipotesis, lalu menarik inferensi apakah bukti mendukung atau menyangkal prediksimu.",
    Icon: FlaskConical,
    colorVar: "bg-stage-5",
    textColor: "text-stage-5",
    ctaLabel: "Lanjut ke Penarikan Kesimpulan",
    next: "/stage/penarikan-kesimpulan",
    materi: [{ title: "Menganalisis Data Efek Doppler", key: "analyze" }],
    lkpdTitle: "Tabel Data & Analisis Efek Doppler",
    lkpdKey: "data-table",
  },
  {
    id: 6,
    slug: "penarikan-kesimpulan",
    title: "Conclusion Drawing",
    titleId: "Penarikan Kesimpulan",
    blurbId: "Sintesis temuan dan hubungkan dengan aplikasi dunia nyata",
    thinking: "Eksplanasi",
    thinkingDetailId:
      "Pada tahap ini, kamu akan menjelaskan temuanmu dengan menyatakan kesimpulan secara jelas dan membenarkannya dengan bukti.",
    Icon: CheckCircle2,
    colorVar: "bg-stage-6",
    textColor: "text-stage-6",
    ctaLabel: "Kembali ke Beranda",
    next: "/home",
    materi: [{ title: "Aplikasi Efek Doppler di Dunia Nyata", key: "applications" }],
    lkpdTitle: "Tarik Kesimpulanmu",
    lkpdKey: "conclusion",
  },
];

export const getStageBySlug = (slug?: string) => stages.find((s) => s.slug === slug);
