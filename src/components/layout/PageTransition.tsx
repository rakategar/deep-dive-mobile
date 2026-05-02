import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigationType } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Wraps route content with mobile-app-like slide + fade transitions.
 * Forward navigation slides in from the right; back (POP) slides in from the left.
 */
export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isBack = navigationType === "POP";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ x: isBack ? -32 : 32, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: isBack ? 32 : -32, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
