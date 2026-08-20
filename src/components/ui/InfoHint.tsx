import { useState, type ReactNode } from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Иконка «i» с всплывающей подсказкой. Работает и на мышке (hover),
 * и с клавиатуры (focus), и по тапу на мобильных (click), плюс title
 * как запасной вариант.
 */
export function InfoHint({
  text,
  label = "Пояснение",
  side = "right",
  className,
}: {
  text: ReactNode;
  label?: string;
  /** С какой стороны раскрывать подсказку на широких экранах. */
  side?: "right" | "left";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const plain = typeof text === "string" ? text : undefined;

  return (
    <span className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        title={plain}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-primary focus-visible:ring-2 focus-visible:ring-ring",
          open && "bg-muted text-primary"
        )}
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {open && (
        <span
          role="tooltip"
          className={cn(
            "animate-fade-in absolute bottom-full z-30 mb-2 w-[min(320px,70vw)] rounded-xl border border-border bg-card p-3",
            "text-xs font-normal leading-5 text-muted-foreground shadow-xl",
            side === "right" ? "left-0" : "right-0"
          )}
        >
          {text}
        </span>
      )}
    </span>
  );
}
