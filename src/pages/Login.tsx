import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/layout/MobileShell";
import buddyLogin from "@/assets/avatars/buddy-login.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return (
    <MobileShell>
      <div className="min-h-screen flex flex-col items-center px-6 pt-12">
        <img
          src={buddyLogin}
          alt="Karakter sambutan"
          className="w-56 h-56 object-contain"
        />

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
              onClick={() => navigate("/home")}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-display text-lg shadow-card active:scale-[0.99] transition"
            >
              log in
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

export default Login;
