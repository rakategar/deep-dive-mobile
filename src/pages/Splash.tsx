import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/layout/MobileShell";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/welcome"), 1800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <MobileShell className="!bg-primary">
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-primary-foreground">
        <button
          onClick={() => navigate("/welcome")}
          className="font-display text-6xl italic tracking-tight underline underline-offset-[10px] decoration-[1.5px]"
        >
          indeep
        </button>
      </div>
    </MobileShell>
  );
};

export default Splash;
