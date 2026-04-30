import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const PublicOnly = ({ children }: { children: JSX.Element }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }
  if (isSignedIn) {
    return <Navigate to="/home" replace />;
  }
  return children;
};
