import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import guide from "@/assets/avatars/guide.png";

const Certificate = () => {
  return (
    <MobileShell>
      <div className="min-h-screen flex flex-col items-center px-6 pt-16 pb-10">
        <div className="rounded-3xl bg-gradient-to-br from-secondary to-card p-6 w-full shadow-elevated border border-primary/10">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Award className="h-8 w-8 text-amber-600" />
            </div>
            <p className="font-display text-3xl text-primary mt-3">Sertifikat</p>
            <p className="text-sm text-muted-foreground">Penyelesaian Inkuiri</p>
            <img src={guide} alt="" className="h-40 w-40 object-contain mt-3" />
            <h2 className="font-display text-2xl text-foreground text-center mt-2">
              Inkuiri Gelombang Bunyi
            </h2>
            <p className="text-sm text-foreground/80 text-center mt-2">
              Telah berhasil menyelesaikan 6 tahap perjalanan inkuiri Efek Doppler dengan kerangka berpikir kritis
              Facione.
            </p>
            <p className="text-xs text-muted-foreground mt-4">— Indeep Learning · Grade 11 Physics —</p>
          </div>
        </div>
        <Link
          to="/home"
          className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-4 text-center font-semibold shadow-card"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </MobileShell>
  );
};

export default Certificate;
