import { useNavigate } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Brain, Waves } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import buddyTeacher from "@/assets/buddy-teacher.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <MobileShell>
      <div className="min-h-screen safe-px pt-12 pb-12 flex flex-col">
        {/* Top right user */}
        <div className="flex justify-end">
          <UserButton afterSignOutUrl="/login" appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
        </div>

        {/* Brand mark */}
        <div className="flex flex-col items-center mt-4">
          <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center shadow-elevated">
            <Waves className="h-10 w-10 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground tracking-tight">Gelombang Bunyi</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelas 11 Fisika</p>
        </div>

        {/* Critical thinking card */}
        <div className="mt-6 rounded-3xl bg-primary text-primary-foreground p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary-foreground/15 flex items-center justify-center shrink-0">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base leading-tight">
                Terintegrasi Keterampilan Berpikir Kritis
              </h2>
              <p className="text-sm text-primary-foreground/80">Facione's Framework</p>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/90 mt-4 leading-relaxed">
            Setiap tahapan inquiry mengembangkan keterampilan berpikir kritis spesifik:{" "}
            <span className="font-semibold">Interpretation</span>,{" "}
            <span className="font-semibold">Analysis</span>,{" "}
            <span className="font-semibold">Inference</span>,{" "}
            <span className="font-semibold">Evaluation</span>, dan{" "}
            <span className="font-semibold">Explanation</span>.
          </p>
        </div>

        {/* Buddy character */}
        <div className="flex justify-center mt-6">
          <img
            src={buddyTeacher}
            alt="Karakter pembimbing pembelajaran"
            width={1024}
            height={1024}
            className="h-44 w-auto object-contain select-none pointer-events-none"
          />
        </div>

        {/* Branch buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/intensitas")}
            className="w-full rounded-full bg-card border border-border py-4 text-base font-semibold text-foreground shadow-card active:scale-[0.99] transition"
          >
            Intensitas Bunyi
          </button>
          <button
            onClick={() => navigate("/doppler")}
            className="w-full rounded-full bg-card border border-border py-4 text-base font-semibold text-foreground shadow-card active:scale-[0.99] transition"
          >
            Efek Doppler
          </button>
        </div>
      </div>
    </MobileShell>
  );
};

export default Home;
