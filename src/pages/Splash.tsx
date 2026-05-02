import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { MobileShell } from "@/components/layout/MobileShell";

const Splash = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(() => {
      navigate(isSignedIn ? "/home" : "/welcome", { replace: true });
    }, 1200);
    return () => clearTimeout(t);
  }, [navigate, isLoaded, isSignedIn]);

  return (
    <MobileShell className="!bg-primary">
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-primary-foreground">
        <button
          onClick={() => navigate(isSignedIn ? "/home" : "/welcome", { replace: true })}
          className="flex flex-col items-center"
        >
          <span className="font-display text-6xl tracking-tight underline underline-offset-[10px] decoration-[1.5px]">
            indeep
          </span>
          <span className="mt-2 text-sm italic text-primary-foreground/90 tracking-wide">
            Inquiry Deep Learning
          </span>
        </button>
      </div>
    </MobileShell>
  );
};

export default Splash;
