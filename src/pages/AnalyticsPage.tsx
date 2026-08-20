import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";

import { AnomalyCards } from "@/components/analytics/AnomalyCards";
import { BudgetExecutionWidget } from "@/components/analytics/BudgetExecutionWidget";
import { DeliveryTimesWidget } from "@/components/analytics/DeliveryTimesWidget";
import { KpiCards } from "@/components/analytics/KpiCards";
import { PurchaseVolumeChart } from "@/components/analytics/PurchaseVolumeChart";
import { ToolWearTable } from "@/components/analytics/ToolWearTable";
import { TopProductsWidget } from "@/components/analytics/TopProductsWidget";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, EmptyState } from "@/components/ui";
import {
  budgetExecutionByWorkshop,
  computeKpi,
  deliveryByCategory,
  deliveryBySupplier,
  detectAnomalies,
  purchaseVolumeByMonth,
  toolWearRows,
  topProducts,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { TOOL_USAGE_HISTORY } from "@/mocks";
import {
  useCatalogStore,
  useLimitsStore,
  useOrdersStore,
  useSessionStore,
} from "@/store";

/** Сколько месяцев показывать в диаграмме объёма и в спарклайнах. */
const MONTHS_ON_CHART = 4;

type Tab = "operational" | "wear";

export default function AnalyticsPage() {
  const role = useSessionStore((s) => s.role);
  const orders = useOrdersStore((s) => s.orders);
  const limits = useLimitsStore((s) => s.limits);
  const workshops = useCatalogStore((s) => s.workshops);
  const enterprises = useCatalogStore((s) => s.enterprises);
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);
  const suppliers = useCatalogStore((s) => s.suppliers);

  const [tab, setTab] = useState<Tab>("operational");

  /** Отчётная дата фиксируется на монтировании страницы. */
  const reference = useMemo(() => new Date(), []);

  const rootCategories = useMemo(
    () => categories.filter((c) => c.parentId === null),
    [categories]
  );

  // Ходимость и аномалии считаются из архива перезаказов по датам.
  const wearRows = useMemo(() => toolWearRows(TOOL_USAGE_HISTORY), []);
  const anomalies = useMemo(
    () => detectAnomalies(TOOL_USAGE_HISTORY, reference),
    [reference]
  );

  // KPI берёт то же число аномалий, что показано в карточках ниже.
  const kpi = useMemo(
    () => computeKpi({ orders, limits, anomaliesCount: anomalies.length }),
    [orders, limits, anomalies.length]
  );

  const volume = useMemo(
    () =>
      purchaseVolumeByMonth({
        orders,
        categories: rootCategories,
        reference,
        monthsCount: MONTHS_ON_CHART,
      }),
    [orders, rootCategories, reference]
  );

  const budgetRows = useMemo(
    () => budgetExecutionByWorkshop({ limits, workshops, reference }),
    [limits, workshops, reference]
  );

  const deliveryCategories = useMemo(
    () => deliveryByCategory({ orders, categories: rootCategories, suppliers }),
    [orders, rootCategories, suppliers]
  );
  const deliverySuppliers = useMemo(
    () => deliveryBySupplier({ orders, suppliers }),
    [orders, suppliers]
  );

  const top = useMemo(
    () =>
      topProducts({
        orders,
        products,
        reference,
        monthsCount: MONTHS_ON_CHART,
        limit: 10,
      }),
    [orders, products, reference]
  );

  if (role !== "admin" && role !== "manager") {
    return (
      <EmptyState
        icon={BarChart3}
        title="Раздел доступен Торговому Дому"
        description="Аналитика открыта администратору ТД и руководителю — переключите роль в шапке."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Аналитика"
        description="Оперативный контроль закупок и ходимость инструмента. Все показатели считаются по текущим данным приложения — заказам, лимитам и договорам."
        actions={
          <Badge tone="neutral" outline>
            {role === "manager" ? "Руководитель ТД" : "Администратор ТД"}
          </Badge>
        }
      />

      <KpiCards kpi={kpi} />

      {/* Вкладки */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        {(
          [
            ["operational", "Оперативная аналитика"],
            ["wear", `Ходимость инструмента${anomalies.length > 0 ? ` · ${anomalies.length}` : ""}`],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            aria-pressed={tab === value}
            className={cn(
              "-mb-px border-b-2 px-1 pb-3 pt-1 text-sm transition-colors",
              tab === value
                ? "border-primary font-semibold text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "operational" ? (
        <div className="flex flex-col gap-6">
          <PurchaseVolumeChart
            rows={volume.rows}
            categoryIds={volume.categoryIds}
            categories={rootCategories}
          />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <BudgetExecutionWidget
              rows={budgetRows}
              categories={rootCategories}
              enterpriseName={(id) =>
                enterprises.find((e) => e.id === id)?.shortName ?? id
              }
            />
            <DeliveryTimesWidget
              byCategory={deliveryCategories}
              bySupplier={deliverySuppliers}
            />
          </div>

          <TopProductsWidget rows={top} categories={rootCategories} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <ToolWearTable rows={wearRows} />
          <AnomalyCards rows={anomalies} />
        </div>
      )}
    </div>
  );
}
