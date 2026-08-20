import type { HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Карточка — базовая поверхность интерфейса (паттерн донора:
 * rounded-2xl border border-border bg-card p-6).
 */
export function Card({
  className,
  children,
  padded = true,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { padded?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card",
        // Единый шаг отступов: 16px на мобильном, 24px от sm и шире.
        padded && "p-4 sm:p-6",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Шапка карточки: заголовок, подпись и слот действий справа. */
export function CardHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-base font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Вложенная плитка внутри карточки (паттерн донора: bg-muted/30). */
export function Tile({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-muted/30 p-4",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Пустое состояние — dashed-рамка, иконка, пояснение, опциональное действие.
 * Используется заглушками страниц на этом этапе.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-card p-6",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        {Icon && (
          <Icon className="h-10 w-10 text-muted-foreground" strokeWidth={1.6} />
        )}
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description && (
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
