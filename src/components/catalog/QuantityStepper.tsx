import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Степпер количества. Тап-таргеты 36×36 — удобно и мышью, и с телефона
 * (каталог используют на участках с мобильных).
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  unit,
  size = "md",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  /** Ограничение сверху — например, свободный остаток на РЕСХ. */
  max?: number;
  unit?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const clamp = (next: number) =>
    Math.max(min, max === undefined ? next : Math.min(max, next));

  const box = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const field = size === "sm" ? "h-8 w-12 text-xs" : "h-9 w-14 text-sm";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-border bg-card p-0.5",
        className
      )}
    >
      <button
        type="button"
        aria-label="Уменьшить количество"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className={cn(
          box,
          "flex shrink-0 items-center justify-center rounded text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <Minus className="h-4 w-4" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        aria-label="Количество"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const parsed = Number.parseInt(e.target.value, 10);
          onChange(Number.isNaN(parsed) ? min : clamp(parsed));
        }}
        className={cn(
          field,
          "shrink-0 border-0 bg-transparent text-center font-semibold tabular-nums text-foreground outline-none",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        )}
      />

      {unit && (
        <span className="shrink-0 pr-1 text-xs text-muted-foreground">{unit}</span>
      )}

      <button
        type="button"
        aria-label="Увеличить количество"
        onClick={() => onChange(clamp(value + 1))}
        disabled={max !== undefined && value >= max}
        className={cn(
          box,
          "flex shrink-0 items-center justify-center rounded text-muted-foreground transition-colors",
          "hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
