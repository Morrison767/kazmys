import { CalendarClock } from "lucide-react";

import { Badge, Card, CardHeader, ProgressBar } from "@/components/ui";
import { limitTone, usedPercent } from "@/lib/cart-limits";
import type { WorkshopBudgetRow } from "@/lib/analytics";
import { cn, formatDate, formatMoney } from "@/lib/utils";
import type { Category } from "@/types";

/**
 * Исполнение бюджета по цехам: факт против лимита плюс прогноз исчерпания.
 * Используются те же объекты Limit, что редактируются в /admin/limits.
 */
export function BudgetExecutionWidget({
  rows,
  categories,
  enterpriseName,
}: {
  rows: WorkshopBudgetRow[];
  categories: Category[];
  enterpriseName: (enterpriseId: string) => string;
}) {
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="Исполнение бюджета по цехам"
        description="Факт против утверждённого лимита и прогноз исчерпания при текущем темпе расхода."
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Лимиты цехов не настроены.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {rows.map((row) => {
            const tone = limitTone(row.percent);
            const remaining = row.totalLimit - row.totalUsed;

            return (
              <div key={row.workshop.id} className="flex flex-col gap-2 py-3 first:pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {row.workshop.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {enterpriseName(row.workshop.enterpriseId)}
                    </p>
                  </div>
                  <Badge
                    tone={
                      tone === "success"
                        ? "success"
                        : tone === "warning"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {row.percent}%
                  </Badge>
                </div>

                <ProgressBar
                  value={row.totalUsed}
                  max={row.totalLimit}
                  tone={tone}
                />

                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
                  <span className="tabular-nums text-muted-foreground">
                    {formatMoney(row.totalUsed)} из {formatMoney(row.totalLimit)}
                    {remaining > 0
                      ? ` · остаток ${formatMoney(remaining)}`
                      : ` · перерасход ${formatMoney(-remaining)}`}
                  </span>

                  <span
                    className={cn(
                      "flex items-center gap-1.5",
                      row.forecast.daysLeft === null
                        ? "text-muted-foreground"
                        : row.forecast.daysLeft <= 14
                          ? "font-semibold text-danger-foreground"
                          : "text-foreground"
                    )}
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    {row.forecast.daysLeft === null
                      ? "Не исчерпается при текущем темпе"
                      : row.forecast.daysLeft === 0
                        ? "Лимит исчерпан"
                        : `Исчерпание через ${row.forecast.daysLeft} дн.${
                            row.forecast.exhaustAt
                              ? ` (${formatDate(row.forecast.exhaustAt)})`
                              : ""
                          }`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {row.categories.map((category) => (
                    <span key={category.categoryId} className="tabular-nums">
                      {categoryName(category.categoryId)}:{" "}
                      <span
                        className={cn(
                          "font-semibold",
                          usedPercent(
                            category.limit.amountUsed,
                            category.limit.amountLimit
                          ) > 90
                            ? "text-danger-foreground"
                            : "text-foreground"
                        )}
                      >
                        {category.percent}%
                      </span>
                      {category.forecast.dailyBurn > 0 &&
                        ` · ${formatMoney(category.forecast.dailyBurn)}/день`}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
