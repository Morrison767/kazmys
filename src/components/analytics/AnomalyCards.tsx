import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Search, TrendingUp } from "lucide-react";

import { Badge, Button, Card, CardHeader } from "@/components/ui";
import { ANOMALY_GROWTH_FACTOR, type AnomalyRow } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Аномалии потребления. Набор считается динамически (см. detectAnomalies),
 * поэтому число карточек здесь всегда совпадает с KPI-счётчиком сверху —
 * это один и тот же расчёт.
 *
 * Кнопка «Проверить» ведёт в список заказов с фильтром по цеху и позиции.
 */
export function AnomalyCards({ rows }: { rows: AnomalyRow[] }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title={`Аномалии потребления · ${rows.length}`}
        description={`Позиции, по которым число заказов выросло более чем в ${ANOMALY_GROWTH_FACTOR} раза относительно предыдущего сопоставимого периода.`}
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Аномального роста потребления не выявлено.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-4",
                row.severity === "high"
                  ? "border-danger-border bg-danger-soft"
                  : "border-warning-border bg-warning-soft"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      row.severity === "high"
                        ? "text-danger-foreground"
                        : "text-warning-foreground"
                    )}
                  >
                    {row.productName}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-xs",
                      row.severity === "high"
                        ? "text-danger-foreground"
                        : "text-warning-foreground"
                    )}
                  >
                    {row.workshopName} · {row.periodLabel}
                  </p>
                </div>
                <Badge tone={row.severity === "high" ? "danger" : "warning"}>
                  <TrendingUp className="h-3 w-3" />×{row.growthFactor}
                </Badge>
              </div>

              <div className="flex items-end gap-4">
                <Metric label="Было" value={`${row.previousCount}`} />
                <ArrowUpRight
                  className={cn(
                    "mb-1 h-4 w-4 shrink-0",
                    row.severity === "high"
                      ? "text-danger-foreground"
                      : "text-warning-foreground"
                  )}
                />
                <Metric label="Стало" value={`${row.currentCount}`} strong />
                <Metric label="Рост" value={`+${row.growthPercent}%`} />
              </div>

              <Button
                variant="secondary"
                size="sm"
                icon={Search}
                className="self-start"
                onClick={() =>
                  navigate(
                    `/orders?workshop=${row.workshopId}&product=${row.productId}`
                  )
                }
              >
                Проверить заказы
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function Metric({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium">{label}</p>
      <p
        className={cn(
          "tabular-nums",
          strong ? "text-xl font-bold" : "text-base font-semibold"
        )}
      >
        {value}
      </p>
    </div>
  );
}
