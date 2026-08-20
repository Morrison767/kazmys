import {
  AlertTriangle,
  Clock,
  PiggyBank,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Badge, Card } from "@/components/ui";
import { limitTone } from "@/lib/cart-limits";
import type { AnalyticsKpi } from "@/lib/analytics";
import { cn, formatMoney } from "@/lib/utils";

/**
 * KPI-плитки. Значения приходят из одного расчёта (lib/analytics.ts),
 * в том числе число аномалий — оно же показывается в блоке аномалий
 * на вкладке «Ходимость инструмента».
 */
export function KpiCards({ kpi }: { kpi: AnalyticsKpi }) {
  const budgetTone = limitTone(kpi.budgetExecutionPercent);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        icon={Wallet}
        label="Объём закупок"
        value={formatMoney(kpi.totalAmount)}
        hint={`${kpi.ordersCount} заказов без НДС, кроме отклонённых и черновиков`}
      />

      <KpiCard
        icon={PiggyBank}
        label="Исполнение бюджета"
        value={`${kpi.budgetExecutionPercent}%`}
        hint={`${formatMoney(kpi.totalUsed)} из ${formatMoney(kpi.totalLimit)} по всем цехам`}
        badge={
          <Badge
            tone={
              budgetTone === "success"
                ? "success"
                : budgetTone === "warning"
                  ? "warning"
                  : "danger"
            }
          >
            {budgetTone === "danger"
              ? "критично"
              : budgetTone === "warning"
                ? "внимание"
                : "в норме"}
          </Badge>
        }
      />

      <KpiCard
        icon={Clock}
        label="Средний срок поставки"
        value={
          kpi.avgDeliveryDays !== null ? `${kpi.avgDeliveryDays} дн.` : "нет данных"
        }
        hint={
          kpi.avgDeliveryDays !== null
            ? `От согласования до получения · по ${kpi.deliverySampleSize} поставкам`
            : "Ни один заказ ещё не дошёл до получения"
        }
      />

      <KpiCard
        icon={AlertTriangle}
        label="Выявленных аномалий"
        value={`${kpi.anomaliesCount}`}
        hint="Резкий рост потребления позиции цехом — см. вкладку «Ходимость инструмента»"
        tone={kpi.anomaliesCount > 0 ? "danger" : "neutral"}
      />
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  badge,
  tone = "neutral",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  badge?: React.ReactNode;
  tone?: "neutral" | "danger";
}) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Icon
            className={cn(
              "h-4 w-4",
              tone === "danger" ? "text-destructive" : "text-primary"
            )}
          />
          {label}
        </span>
        {badge}
      </div>

      <p
        className={cn(
          "text-2xl font-bold tabular-nums tracking-tight",
          tone === "danger" ? "text-danger-foreground" : "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}
