import { ReactNode } from "react";

interface MobileShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centered mobile container. On wider screens, the mobile app stays
 * centered with a soft shadow framing it (not a desktop layout).
 */
export const MobileShell = ({ children, className = "" }: MobileShellProps) => {
  return (
    <div className="min-h-screen w-full bg-muted/40 flex justify-center">
      <div className={`mobile-shell ${className}`}>{children}</div>
    </div>
  );
};
