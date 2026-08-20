import { Store } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Знак и название продукта. Логотипа-файла у прототипа нет — используем
 * бренд-синий знак в языке донора (скруглённый квадрат с иконкой).
 */
export function Logo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[#0463b3] text-primary-foreground">
        <Store className="h-5 w-5" strokeWidth={2} />
      </span>
      {!compact && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-bold tracking-tight text-foreground">
            МП Торгового Дома
          </span>
          <span className="truncate text-xs text-muted-foreground">
            Корпорация Казахмыс
          </span>
        </span>
      )}
    </div>
  );
}
