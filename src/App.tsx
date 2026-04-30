import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/clerkPublishableKey";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import CreatePassword from "./pages/CreatePassword";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Stage from "./pages/Stage";
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

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/create-password" element={<CreatePassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      <Route path="/stage/:slug" element={<RequireAuth><Stage /></RequireAuth>} />
      <Route path="/certificate" element={<RequireAuth><Certificate /></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {CLERK_PUBLISHABLE_KEY ? (
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/login">
          <AppRoutes />
        </ClerkProvider>
      ) : (
        <MissingClerkKey />
      )}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
