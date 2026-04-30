import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { toast } from "@/hooks/use-toast";
import buddyLogin from "@/assets/avatars/buddy-login.png";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!isLoaded) return;
    if (!email || !pw) {
      toast({ title: "Lengkapi form", description: "Email dan password wajib diisi.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await signIn.create({ identifier: email, password: pw });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        navigate("/home", { replace: true });
      } else {
        toast({ title: "Butuh verifikasi tambahan", description: "Lanjutkan proses login di provider.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({
        title: "Gagal login",
        description: err?.errors?.[0]?.message ?? "Periksa email dan password kamu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${window.location.origin}/login`,
        redirectUrlComplete: `${window.location.origin}/home`,
      });
    } catch (err: any) {
      toast({ title: "Google sign-in gagal", description: err?.message ?? "Coba lagi.", variant: "destructive" });
    }
  };

  return (
    <MobileShell>
      <div className="min-h-screen flex flex-col items-center px-6 pt-12">
        <img src={buddyLogin} alt="Karakter sambutan" className="w-56 h-56 object-contain" />

        <div className="w-full bg-secondary rounded-3xl p-6 -mt-2 shadow-card">
          <h2 className="font-display text-3xl text-primary text-center">Have an account</h2>
          <p className="font-display text-primary/80 text-center text-base mt-1">
            Enter your email to log in for this app
          </p>

          <div className="space-y-3 mt-5">
            <input
              type="email"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-card text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="password"
              placeholder="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-card text-foreground placeholder:text-primary/40 outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleEmailLogin}
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-display text-lg shadow-card active:scale-[0.99] transition disabled:opacity-60"
            >
              {loading ? "logging in..." : "log in"}
            </button>

            <div className="flex items-center gap-3 my-1 pt-1">
              <div className="h-px flex-1 bg-primary/15" />
              <span className="text-xs text-primary/60">or continue with</span>
              <div className="h-px flex-1 bg-primary/15" />
            </div>

            <button
              onClick={handleGoogle}
              className="w-full py-3 rounded-full bg-card text-foreground flex items-center justify-center gap-3 shadow-card active:scale-[0.99] transition"
            >
              <GoogleIcon />
              <span className="font-medium">Login with Google</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          New here?{" "}
          <Link to="/signup" className="text-primary font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </MobileShell>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#EA4335" d="M12 11v3.2h7.45c-.3 1.6-1.95 4.7-7.45 4.7-4.5 0-8.15-3.7-8.15-8.3S7.5 2.3 12 2.3c2.55 0 4.25 1.1 5.25 2.05l3.55-3.4C18.55-1.05 15.55-2 12-2 5.4-2 0 3.4 0 10.6S5.4 23.2 12 23.2c6.95 0 11.55-4.85 11.55-11.7 0-.8-.1-1.4-.2-2H12z" />
  </svg>
);

export default Login;
