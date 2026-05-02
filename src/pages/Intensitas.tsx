import { Link, useNavigate } from "react-router-dom";
import { Info, Brain, BookOpen, FileText, Pencil, Waves, ChevronLeft } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { stagesIntensitas } from "@/data/stagesIntensitas";

const Intensitas = () => {
  const navigate = useNavigate();
  return (
    <MobileShell>
      <div className="min-h-screen safe-px pt-12 pb-12">
        {/* Top bar: back + info + user */}
        <div className="flex items-center justify-between gap-2">
          <button
            aria-label="Kembali"
            onClick={() => navigate("/home")}
            className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-foreground/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              aria-label="Info"
              className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-foreground/60"
            >
              <Info className="h-4 w-4" />
            </button>
            <UserButton afterSignOutUrl="/login" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
          </div>
        </div>

        {/* Brand mark */}
        <div className="flex flex-col items-center mt-2">
          <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center shadow-elevated">
            <Waves className="h-10 w-10 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground tracking-tight">Intensitas Bunyi</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelas 11 Fisika</p>
          <p className="text-sm text-muted-foreground text-center mt-1 px-4">
            Perjalanan inquiry deep learning tentang Intensitas Bunyi
          </p>
        </div>



        {/* Resources */}
        <div className="mt-5 rounded-3xl bg-card p-5 shadow-card">
          <h3 className="font-semibold text-foreground">Buku Ajar & Modul Latihan Soal</h3>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <ResourceTile
              Icon={BookOpen}
              label="Buku Ajar"
              tint="bg-surface-soft-blue"
              iconColor="text-info"
              onClick={() => navigate("/intensitas/buku-ajar")}
            />
            <ResourceTile
              Icon={FileText}
              label="Modul"
              tint="bg-surface-pink"
              iconColor="text-primary"
              onClick={() => navigate("/intensitas/modul")}
            />
            <ResourceTile Icon={Pencil} label="Latihan Soal" tint="bg-surface-pink" iconColor="text-stage-5" />
          </div>
        </div>

        {/* Journey */}
        <h3 className="font-semibold text-foreground mt-7 mb-3">6 Tahapan Pembelajaran Inquiry</h3>
        <div className="space-y-3">
          {stagesIntensitas.map((s) => (
            <Link
              key={s.id}
              to={`/intensitas/stage/${s.slug}`}
              className="block rounded-3xl bg-card p-4 shadow-card active:scale-[0.99] transition"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`h-14 w-14 rounded-2xl ${s.colorVar} flex items-center justify-center shrink-0 shadow-card`}
                >
                  <s.Icon className="h-7 w-7 text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-mono">{String(s.id).padStart(2, "0")}</p>
                  <p className="font-semibold text-foreground leading-tight">{s.titleId}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">{s.blurbId}</p>
                  <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-info font-medium">
                    <span className="inline-block h-3 w-3 rounded-full border-2 border-info" />
                    {s.thinking}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
};

const ResourceTile = ({
  Icon,
  label,
  tint,
  iconColor,
  onClick,
}: {
  Icon: typeof BookOpen;
  label: string;
  tint: string;
  iconColor: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center active:scale-[0.97] transition disabled:opacity-100"
  >
    <div className={`h-14 w-14 rounded-2xl ${tint} flex items-center justify-center`}>
      <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={2} />
    </div>
    <span className="text-xs text-foreground mt-2 text-center">{label}</span>
  </button>
);

export default Intensitas;
