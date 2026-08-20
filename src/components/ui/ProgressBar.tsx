import { cn } from "@/lib/utils";

export type ProgressTone = "primary" | "success" | "warning" | "danger";

/**
 * Индикатор заполнения (паттерн донора: h-2 rounded-full bg-muted + заливка).
 * Основное применение — исполнение лимита цеха: факт vs лимит.
 */
export function ProgressBar({
  value,
  max = 100,
  tone,
  size = "md",
  className,
}: {
  value: number;
  max?: number;
  /** Если не задан — тон выбирается автоматически по доле заполнения. */
  tone?: ProgressTone;
  size?: "sm" | "md";
  className?: string;
}) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const ratio = max > 0 ? value / max : 0;
  const autoTone: ProgressTone =
    ratio >= 1 ? "danger" : ratio >= 0.85 ? "warning" : "primary";
  const resolved = tone ?? autoTone;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "w-full overflow-hidden rounded-full bg-muted",
        size === "sm" ? "h-1.5" : "h-2",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-300",
          resolved === "primary" && "bg-primary",
          resolved === "success" && "bg-success",
          resolved === "warning" && "bg-warning",
          resolved === "danger" && "bg-destructive"
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/**
 * Лимит с подписями: «Факт 1 200 000 ₸ из 2 000 000 ₸» + процент.
 * Собран поверх ProgressBar, чтобы экраны лимитов и аналитики
 * не дублировали разметку.
 */
export function LimitMeter({
  label,
  used,
  limit,
  formatValue = (v) => String(v),
  hint,
  className,
}: {
  label?: string;
  used: number;
  limit: number;
  formatValue?: (value: number) => string;
  hint?: string;
  className?: string;
}) {
  const percent = limit > 0 ? Math.round((used / limit) * 100) : 0;
  const over = percent > 100;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-xs font-semibold text-foreground">
          {label}
        </span>
        <span
          className={cn(
            "shrink-0 text-xs font-semibold tabular-nums",
            over
              ? "text-danger-foreground"
              : percent >= 85
                ? "text-warning-foreground"
                : "text-muted-foreground"
          )}
        >
          {percent}%
        </span>
      </div>
      <ProgressBar value={used} max={limit} />
      <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
        <span className="tabular-nums">
          {formatValue(used)} из {formatValue(limit)}
        </span>
        {hint && <span className="shrink-0 truncate">{hint}</span>}
      </div>
    </div>
  );
}
