import { ReactNode } from "react";

/** Inline stacked fraction with a horizontal bar. */
export const Fraction = ({
  num,
  den,
  className = "",
}: {
  num: ReactNode;
  den: ReactNode;
  className?: string;
}) => (
  <span className={`inline-flex flex-col items-center align-middle mx-1 leading-none ${className}`}>
    <span className="px-1.5 pb-0.5">{num}</span>
    <span className="block w-full border-t border-current" />
    <span className="px-1.5 pt-0.5">{den}</span>
  </span>
);

/** Optional surrounding parentheses that scale to the fraction height. */
export const ParenFraction = ({
  num,
  den,
  className = "",
}: {
  num: ReactNode;
  den: ReactNode;
  className?: string;
}) => (
  <span className={`inline-flex items-center align-middle ${className}`}>
    <span className="text-[1.6em] leading-none font-light">(</span>
    <Fraction num={num} den={den} />
    <span className="text-[1.6em] leading-none font-light">)</span>
  </span>
);
