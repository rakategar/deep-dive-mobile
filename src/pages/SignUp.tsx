import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/layout/MobileShell";
import buddySignup from "@/assets/avatars/buddy-signup.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  return (
    <MobileShell>
      <div className="min-h-screen flex flex-col items-center px-6 pt-12">
        <img
          src={buddySignup}
          alt="Karakter sambutan"
          className="w-48 h-48 object-contain"
        />

        <div className="w-full bg-secondary rounded-3xl p-6 -mt-4 shadow-card">
          <h2 className="font-display text-3xl text-primary text-center">Create an account</h2>
          <p className="font-display text-primary/80 text-center text-base mt-1">
            Enter your email to sign up for this app
          </p>

          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-5 px-4 py-3 rounded-full bg-card text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-2 focus:ring-primary/30"
          />

          <button
            onClick={() => navigate("/create-password")}
            className="w-full mt-3 py-3 rounded-full bg-primary text-primary-foreground font-display text-lg shadow-card active:scale-[0.99] transition"
          >
            Sign up with email
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-primary/15" />
            <span className="text-xs text-primary/60">or continue with</span>
            <div className="h-px flex-1 bg-primary/15" />
          </div>

          <button
            onClick={() => navigate("/home")}
            className="w-full py-3 rounded-full bg-card text-foreground flex items-center justify-center gap-3 shadow-card active:scale-[0.99] transition"
          >
            <GoogleIcon />
            <span className="font-medium">Google</span>
          </button>

          <p className="text-xs text-center text-primary/70 mt-4 leading-relaxed">
            By clicking continue, you
            <br />
            agree to our <span className="font-semibold text-primary">Terms of Service</span>
            <br />
            and <span className="font-semibold text-primary">Privacy Policy</span>
          </p>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </MobileShell>
  );
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 11v3.2h7.45c-.3 1.6-1.95 4.7-7.45 4.7-4.5 0-8.15-3.7-8.15-8.3S7.5 2.3 12 2.3c2.55 0 4.25 1.1 5.25 2.05l3.55-3.4C18.55-1.05 15.55-2 12-2 5.4-2 0 3.4 0 10.6S5.4 23.2 12 23.2c6.95 0 11.55-4.85 11.55-11.7 0-.8-.1-1.4-.2-2H12z"
    />
  </svg>
);

export default SignUp;
