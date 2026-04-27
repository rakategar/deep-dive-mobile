import { ReactNode, useState } from "react";
import { ChevronDown, BookOpen, PenTool } from "lucide-react";

interface ContentAccordionProps {
  variant: "materi" | "lkpd";
  eyebrow: string;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const ContentAccordion = ({
  variant,
  eyebrow,
  title,
  defaultOpen = false,
  children,
}: ContentAccordionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const isLkpd = variant === "lkpd";
  const Icon = isLkpd ? PenTool : BookOpen;

  return (
    <div
      className={`rounded-2xl shadow-card overflow-hidden ${
        isLkpd ? "bg-surface-pink" : "bg-card"
      }`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
            isLkpd ? "bg-lkpd/15 text-lkpd" : "bg-info/10 text-info"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-[10px] font-bold tracking-wider ${
              isLkpd ? "text-lkpd" : "text-info"
            }`}
          >
            {eyebrow}
          </p>
          <p className="font-semibold text-foreground leading-tight">{title}</p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-foreground/50 transition-transform shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};
