import { Info } from "lucide-react";

import { Badge, Card, ProgressBar } from "@/components/ui";
import { limitTone, usedPercent } from "@/lib/cart-limits";
import { cn, formatMoney } from "@/lib/utils";
import type { Limit, LimitPeriod } from "@/types";

const PERIOD_LABEL: Record<LimitPeriod, string> = {
  month: "за месяц",
  quarter: "за квартал",
  year: "за год",
};

export interface LimitRow {
  categoryId: string;
  categoryName: string;
  limit?: Limit;
}

/**
 * Виджет лимита цеха: сколько из бюджета категории уже израсходовано.
 * Цвет индикатора: зелёный < 60%, жёлтый 60–90%, красный > 90%.
 *
 * На узких экранах виджет сжимается: пояснения, пороги и нормы количества
 * скрываются, остаётся строка «категория — процент — остаток» с полосой,
 * чтобы не отжимать сетку товаров вниз.
 */
export function LimitWidget({
  rows,
  title = "Лимит цеха",
  className,
}: {
  rows: LimitRow[];
  title?: string;
  className?: string;
}) {
  return (
    <Card
      className={cn("flex flex-col gap-3 p-4 sm:gap-4 sm:p-6", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
            {title}
          </h2>
          <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
            Факт потребления против утверждённой нормы. Лимиты настраивает
            администратор Торгового Дома.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {rows.map((row) => {
          if (!row.limit) {
            return (
              <div
                key={row.categoryId}
                className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 p-3"
              >
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  По категории «{row.categoryName}» лимит не настроен — заказ
                  пойдёт на согласование начальнику цеха.
                </p>
              </div>
            );
          }

          const limit = row.limit;
          const percent = usedPercent(limit.amountUsed, limit.amountLimit);
          const tone = limitTone(percent);
          const remaining = limit.amountLimit - limit.amountUsed;

          return (
            <div key={row.categoryId} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-sm font-semibold text-foreground">
                  {row.categoryName}
                </span>
                <Badge
                  tone={
                    tone === "success"
                      ? "success"
                      : tone === "warning"
                        ? "warning"
                        : "danger"
                  }
                >
                  {percent}% {PERIOD_LABEL[limit.period]}
                </Badge>
              </div>

              <ProgressBar
                value={limit.amountUsed}
                max={limit.amountLimit}
                tone={tone}
              />

              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="tabular-nums">
                  Использовано {formatMoney(limit.amountUsed)} из{" "}
                  {formatMoney(limit.amountLimit)}
                </span>
                <span
                  className={cn(
                    "tabular-nums font-semibold",
                    remaining <= 0 ? "text-danger-foreground" : "text-foreground"
                  )}
                >
                  {remaining > 0
                    ? `Остаток ${formatMoney(remaining)}`
                    : `Превышение ${formatMoney(-remaining)}`}
                </span>
              </div>

              <div className="hidden flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground sm:flex">
                <span>
                  Порог авто-одобрения:{" "}
                  <span className="font-semibold text-foreground">
                    {formatMoney(limit.autoApprovalThreshold)}
                  </span>
                </span>
                {limit.quantityLimit !== null && (
                  <span>
                    Норма количества:{" "}
                    <span className="font-semibold text-foreground">
                      {limit.quantityUsed} из {limit.quantityLimit} ед.
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
