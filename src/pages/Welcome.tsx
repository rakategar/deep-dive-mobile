import { Link } from "react-router-dom";
import { MobileShell } from "@/components/layout/MobileShell";
import buddyWelcome from "@/assets/avatars/buddy-welcome.png";

const Welcome = () => {
  return (
    <MobileShell>
      <div className="min-h-screen flex flex-col items-center px-6 pt-16 pb-10">
        <img
          src={buddyWelcome}
          alt="Karakter pemandu Indeep"
          className="w-64 h-64 object-contain drop-shadow-[0_20px_30px_rgba(139,14,46,0.18)]"
        />

        <h1 className="font-display text-6xl text-primary leading-none mt-2 text-center">
          welcome
          <br />
          buddy
        </h1>

        <p className="font-display text-primary mt-10 text-xl">this is your space</p>

        <div className="w-full mt-6 space-y-3">
          <Link
            to="/signup"
            className="block w-full py-4 rounded-full bg-card text-primary text-center font-display text-lg shadow-card active:scale-[0.99] transition"
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="block w-full py-4 rounded-full bg-card text-primary text-center font-display text-lg shadow-card active:scale-[0.99] transition"
          >
            Login
          </Link>
        </div>
      </div>
    </MobileShell>
  );
};

export default Welcome;
