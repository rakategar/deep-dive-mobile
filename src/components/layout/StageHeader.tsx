import { ChevronLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StageHeaderProps {
  title: string;
  subtitle?: string;
}

export const StageHeader = ({ title, subtitle }: StageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur safe-px pt-12 pb-4 flex items-center justify-between">
      <button
        aria-label="Kembali"
        onClick={() => navigate(-1)}
        className="h-10 w-10 -ml-2 flex items-center justify-center text-info hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
      </button>
      <div className="text-center flex-1">
        <h1 className="text-base font-semibold text-foreground leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      <button
        aria-label="Beranda"
        onClick={() => navigate("/home")}
        className="h-10 w-10 -mr-2 flex items-center justify-center text-foreground/70 hover:text-primary transition-colors"
      >
        <Home className="h-5 w-5" strokeWidth={2} />
      </button>
    </header>
  );
};
