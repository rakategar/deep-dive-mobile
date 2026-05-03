import { Link, useNavigate } from "react-router-dom";
import { Info, BookOpen, FileText, Pencil, Waves, ChevronLeft, Target } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { stages } from "@/data/stages";

const Doppler = () => {
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
          <h1 className="mt-4 text-3xl font-bold text-foreground tracking-tight">Efek Doppler</h1>
        </div>

        {/* Resources */}
        <div className="mt-6 rounded-3xl bg-card p-5 shadow-card">
          <h3 className="font-semibold text-foreground">Buku Ajar & Modul Latihan Soal</h3>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <ResourceTile Icon={BookOpen} label="Buku Ajar" tint="bg-surface-soft-blue" iconColor="text-info" to="/doppler/buku-ajar" />
            <ResourceTile Icon={FileText} label="Modul" tint="bg-surface-pink" iconColor="text-primary" to="/doppler/modul" />
            <ResourceTile Icon={Pencil} label="Latihan Soal" tint="bg-surface-pink" iconColor="text-stage-5" />
          </div>
        </div>

        {/* Journey */}
        <h3 className="font-semibold text-foreground mt-7 mb-3">
          6 Tahapan Pembelajaran <i>Inquiry</i>
        </h3>
        <div className="space-y-3">
          {stages.map((s) => (
            <Link
              key={s.id}
              to={`/stage/${s.slug}`}
              className="block rounded-3xl bg-card p-4 shadow-card active:scale-[0.99] transition"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`h-14 w-14 rounded-2xl ${s.colorVar} flex items-center justify-center shrink-0 shadow-card`}
                >
                  <s.Icon className="h-7 w-7 text-white" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="leading-tight">
                    <span className="text-sm text-muted-foreground font-mono mr-1.5">
                      {String(s.id).padStart(2, "0")}
                    </span>
                    <span className="font-bold text-foreground">{s.titleId}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">{s.blurbId}</p>
                  <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-primary italic font-medium bg-primary/10 px-2 py-0.5 rounded-md">
                    <Target className="h-3 w-3" />
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
  to,
}: {
  Icon: typeof BookOpen;
  label: string;
  tint: string;
  iconColor: string;
  to?: string;
}) => {
  const content = (
    <>
      <div className={`h-14 w-14 rounded-2xl ${tint} flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${iconColor}`} strokeWidth={2} />
      </div>
      <span className="text-xs text-foreground mt-2 text-center">{label}</span>
    </>
  );
  if (to) {
    return (
      <Link to={to} className="flex flex-col items-center active:scale-[0.97] transition">
        {content}
      </Link>
    );
  }
  return <div className="flex flex-col items-center">{content}</div>;
};

export default Doppler;
