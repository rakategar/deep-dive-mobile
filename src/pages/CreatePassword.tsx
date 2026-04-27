import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/layout/MobileShell";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  return (
    <MobileShell>
      <div className="min-h-screen flex flex-col px-6 pt-16">
        <div className="bg-secondary rounded-3xl p-6 shadow-card flex flex-col min-h-[600px]">
          <h2 className="font-display text-3xl text-primary text-center">Create Password</h2>
          <p className="font-display text-primary/80 text-center text-base mt-1">
            Enter your email to sign up for this app
          </p>

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

          <div className="flex-1" />

          <button
            onClick={() => navigate("/home")}
            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-display text-lg shadow-card active:scale-[0.99] transition"
          >
            sign up
          </button>
        </div>
      </div>
    </MobileShell>
  );
};

export default CreatePassword;
