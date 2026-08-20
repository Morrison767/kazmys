import type { HTMLAttributes } from "react";

import { ORDER_STATUS_META, type StatusTone } from "@/config/order-status";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export type BadgeTone = StatusTone;

/**
 * Бейдж в стиле донора: rounded-md px-2 py-0.5 text-xs font-semibold
 * с мягкой заливкой. Тона привязаны к семантическим токенам темы.
 */
const TONES: Record<BadgeTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info-soft text-info-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success-soft text-success-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-danger-soft text-danger-foreground",
};

const TONES_OUTLINE: Record<BadgeTone, string> = {
  neutral: "border-border text-muted-foreground",
  info: "border-info-border text-info-foreground",
  primary: "border-primary/30 text-primary",
  success: "border-success-border text-success-foreground",
  warning: "border-warning-border text-warning-foreground",
  danger: "border-danger-border text-danger-foreground",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Контурный вариант — для второстепенных пометок в таблицах. */
  outline?: boolean;
  /** Точка-индикатор слева. */
  dot?: boolean;
}

export function Badge({
  tone = "neutral",
  outline = false,
  dot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold",
        // Смена статуса заказа не должна быть резким скачком цвета.
        "transition-colors duration-300",
        outline ? cn("border bg-card", TONES_OUTLINE[tone]) : TONES[tone],
        className
      )}
      {...rest}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300",
            tone === "neutral" && "bg-muted-foreground",
            tone === "info" && "bg-info",
            tone === "primary" && "bg-primary",
            tone === "success" && "bg-success",
            tone === "warning" && "bg-warning",
            tone === "danger" && "bg-destructive"
          )}
        />
      )}
      {children}
    </span>
  );
}

/**
 * Бейдж статуса заказа — свой тон на каждый статус жизненного цикла
 * (см. src/config/order-status.ts).
 */
export function OrderStatusBadge({
  status,
  showStep = false,
  className,
}: {
  status: OrderStatus;
  /** Показать номер шага пути заказа: «3 · На согласовании». */
  showStep?: boolean;
  className?: string;
}) {
  const meta = ORDER_STATUS_META[status];
  return (
    <Badge tone={meta.tone} dot title={meta.hint} className={className}>
      {showStep && meta.step !== null && (
        <span className="tabular-nums opacity-70">{meta.step} ·</span>
      )}
      {meta.label}
    </Badge>
  );
}

/** Код / артикул моно-шрифтом — паттерн донора для кодов ТН ВЭД. */
export function CodeBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
