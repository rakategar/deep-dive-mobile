import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AuthenticateWithRedirectCallback, ClerkProvider } from "@clerk/clerk-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerkPublishableKey";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PublicOnly } from "@/components/auth/PublicOnly";
import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import CreatePassword from "./pages/CreatePassword";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Doppler from "./pages/Doppler";
import Intensitas from "./pages/Intensitas";
import Stage from "./pages/Stage";
import StageIntensitas from "./pages/StageIntensitas";
import BukuAjar from "./pages/BukuAjar";
import Modul from "./pages/Modul";
import Certificate from "./pages/Certificate";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const MissingClerkKey = () => (
  <div className="min-h-screen flex items-center justify-center px-6 bg-background">
    <div className="max-w-sm rounded-2xl border border-border bg-card p-6 text-sm text-foreground space-y-2">
      <p className="font-semibold text-primary">Clerk publishable key belum diset</p>
      <p className="text-muted-foreground">
        Tambahkan <code className="font-mono">VITE_CLERK_PUBLISHABLE_KEY=pk_...</code> ke file{" "}
        <code className="font-mono">.env</code> lalu reload preview.
      </p>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<Splash />} />
      <Route path="/welcome" element={<PublicOnly><Welcome /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><SignUp /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><SignUp /></PublicOnly>} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route
        path="/sso-callback"
        element={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Menyelesaikan login...</p>
              <div id="clerk-captcha" />
            </div>
            <AuthenticateWithRedirectCallback
              signInForceRedirectUrl="/home"
              signUpForceRedirectUrl="/home"
              signInFallbackRedirectUrl="/home"
              signUpFallbackRedirectUrl="/home"
              continueSignUpUrl="/home"
            />
          </div>
        }
      />
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/intensitas" element={<RequireAuth><Intensitas /></RequireAuth>} />
      <Route path="/doppler" element={<RequireAuth><Doppler /></RequireAuth>} />
      <Route path="/stage/:slug" element={<RequireAuth><Stage /></RequireAuth>} />
      <Route path="/intensitas/stage/:slug" element={<RequireAuth><StageIntensitas /></RequireAuth>} />
      <Route path="/intensitas/buku-ajar" element={<RequireAuth><BukuAjar /></RequireAuth>} />
      <Route path="/intensitas/modul" element={<RequireAuth><Modul /></RequireAuth>} />
      <Route path="/certificate" element={<RequireAuth><Certificate /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const AppRoutes = () => (
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {CLERK_PUBLISHABLE_KEY ? (
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          afterSignOutUrl="/login"
          signInFallbackRedirectUrl="/home"
          signUpFallbackRedirectUrl="/home"
        >
          <AppRoutes />
        </ClerkProvider>
      ) : (
        <MissingClerkKey />
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
