import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { toast } from "@/hooks/use-toast";

const CreatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, isLoaded, setActive } = useSignUp();
  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (!email || !pw) {
      toast({ title: "Lengkapi form", description: "Email dan password wajib diisi.", variant: "destructive" });
      return;
    }
    if (pw !== pw2) {
      toast({ title: "Password tidak cocok", description: "Konfirmasi password berbeda.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email, password: pw });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStage("verify");
      toast({ title: "Cek email kamu", description: "Kode verifikasi telah dikirim." });
    } catch (err: any) {
      toast({
        title: "Gagal mendaftar",
        description: err?.errors?.[0]?.message ?? "Coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        navigate("/home", { replace: true });
      } else {
        toast({ title: "Verifikasi belum lengkap", description: "Coba kode lagi.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({
        title: "Kode salah",
        description: err?.errors?.[0]?.message ?? "Periksa kembali.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell>
      <div className="min-h-screen flex flex-col px-6 pt-16">
        <div className="bg-secondary rounded-3xl p-6 shadow-card flex flex-col min-h-[600px]">
          <h2 className="font-display text-3xl text-primary text-center">
            {stage === "form" ? "Create Password" : "Verify Email"}
          </h2>
          <p className="font-display text-primary/80 text-center text-base mt-1">
            {stage === "form"
              ? "Enter your email to sign up for this app"
              : "Masukkan kode verifikasi yang dikirim ke emailmu"}
          </p>

          {stage === "form" ? (
            <div className="space-y-3 mt-6">
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
              <input
                type="password"
                placeholder="confirm password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-card text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ) : (
            <div className="space-y-3 mt-6">
              <input
                type="text"
                inputMode="numeric"
                placeholder="kode verifikasi"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-card text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-primary/30 tracking-widest text-center"
              />
            </div>
          )}

          <div className="flex-1" />

          <button
            onClick={stage === "form" ? handleSignUp : handleVerify}
            disabled={loading}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-display text-lg shadow-card active:scale-[0.99] transition disabled:opacity-60"
          >
            {loading ? "loading..." : stage === "form" ? "sign up" : "verify"}
          </button>
        </div>
      </div>
    </MobileShell>
  );
};

export default CreatePassword;
