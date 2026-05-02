import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight, Award } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { StageHeader } from "@/components/layout/StageHeader";
import { ContentAccordion } from "@/components/stage/ContentAccordion";
import { getIntensitasStageBySlug, stagesIntensitas } from "@/data/stagesIntensitas";
import {
  materiContentIntensitas,
  IntensitasOrientationReflection,
  IntensitasAnalyticalReflection,
} from "@/components/stage/MateriBlocksIntensitas";
import { lkpdContentIntensitas } from "@/components/stage/LkpdBlocksIntensitas";

const renderBold = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <b key={i}>{part.slice(2, -2)}</b>
    ) : (
      <span key={i}>{part}</span>
    ),
  );

const StageIntensitas = () => {
  const { slug } = useParams();
  const stage = getIntensitasStageBySlug(slug);
  if (!stage) return <Navigate to="/intensitas" replace />;

  const MateriComponents = stage.materi.map((m) => materiContentIntensitas[m.key]);
  const LkpdComponent = lkpdContentIntensitas[stage.lkpdKey];
  const isLast = stage.id === 6;

  return (
    <MobileShell>
      <StageHeader
        title="Inkuiri Intensitas Bunyi"
        subtitle={`Tahap ${stage.id} dari ${stagesIntensitas.length}`}
      />

      <div className="safe-px pb-12">
        {/* Stage hero */}
        <div className="flex items-center gap-4 mt-2">
          <div
            className={`h-14 w-14 rounded-full ${stage.colorVar} flex items-center justify-center shadow-elevated`}
          >
            <stage.Icon className="h-7 w-7 text-white" strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-info">TAHAP {stage.id}</p>
            <h1 className="text-2xl font-bold text-foreground leading-tight">{stage.titleId}</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{stage.blurbId}</p>

        {/* Critical thinking focus */}
        <div className="mt-4 rounded-2xl bg-muted/60 p-4">
          <p className="font-semibold text-foreground text-sm">
            🎯 Fokus Berpikir Kritis: {stage.thinking}
          </p>
          <p className="text-xs text-foreground/75 mt-1.5 leading-relaxed">{renderBold(stage.thinkingDetailId)}</p>
        </div>

        {/* Reflection inserts (stage 1 & 2) */}
        {stage.id === 1 && (
          <div className="mt-3">
            <IntensitasOrientationReflection />
          </div>
        )}
        {stage.id === 2 && (
          <div className="mt-3">
            <IntensitasAnalyticalReflection />
          </div>
        )}

        {/* Materi accordions */}
        <div className="mt-4 space-y-3">
          {stage.materi.map((m, i) => {
            const Comp = MateriComponents[i];
            return (
              <ContentAccordion
                key={m.key + i}
                variant="materi"
                eyebrow="MATERI PEMBELAJARAN"
                title={m.title}
              >
                {Comp ? <Comp /> : <p className="text-sm text-muted-foreground">Materi akan datang.</p>}
              </ContentAccordion>
            );
          })}

          {/* LKPD */}
          <ContentAccordion
            variant="lkpd"
            eyebrow="LEMBAR KERJA PESERTA DIDIK (LKPD)"
            title={stage.lkpdTitle}
          >
            {LkpdComponent ? <LkpdComponent /> : <p className="text-sm">LKPD akan datang.</p>}
          </ContentAccordion>
        </div>

        {/* Final stage extra: certificate */}
        {isLast && (
          <Link
            to="/certificate"
            className="mt-4 w-full rounded-full bg-amber-100 text-amber-900 py-4 flex items-center justify-center gap-2 font-semibold shadow-card active:scale-[0.99] transition"
          >
            <Award className="h-5 w-5" /> Dapatkan Sertifikatmu
          </Link>
        )}

        {/* CTA */}
        <Link
          to={stage.next ?? "/intensitas"}
          className="mt-3 w-full rounded-full bg-primary text-primary-foreground py-4 flex items-center justify-center gap-1 font-semibold shadow-elevated active:scale-[0.99] transition"
        >
          {isLast && <span>🏠 </span>}
          {isLast ? "Kembali ke Beranda" : stage.ctaLabel}
          {!isLast && <ChevronRight className="h-5 w-5" />}
        </Link>

        {isLast && (
          <p className="text-xs text-center text-muted-foreground mt-4">
            🎉 Selamat telah menyelesaikan perjalanan inkuiri Intensitas Bunyi!
          </p>
        )}
      </div>
    </MobileShell>
  );
};

export default StageIntensitas;
