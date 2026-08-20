import { useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, Truck } from "lucide-react";

import { SupplierDrawer } from "@/components/admin/SupplierDrawer";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Badge,
  Card,
  EmptyState,
  Table,
  type Column,
} from "@/components/ui";
import {
  CONTRACT_STATUS_LABEL,
  CONTRACT_STATUS_TONE,
  EXPIRING_WINDOW_DAYS,
  sortSuppliersByRisk,
  type ContractState,
} from "@/lib/supplier-contract";
import { supplierMetrics } from "@/lib/supplier-metrics";
import { formatDate, formatMoney } from "@/lib/utils";
import { useCatalogStore, useOrdersStore } from "@/store";
import type { Supplier } from "@/types";

interface SupplierRow {
  supplier: Supplier;
  state: ContractState;
}

export default function AdminSuppliersPage() {
  const suppliers = useCatalogStore((s) => s.suppliers);
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);
  const orders = useOrdersStore((s) => s.orders);

  const [selected, setSelected] = useState<Supplier | null>(null);

  /** «Сегодня» фиксируется на монтировании — таблица не мигает при рендерах. */
  const today = useMemo(() => new Date(), []);

  const rows = useMemo<SupplierRow[]>(
    // Истёкшие и истекающие договоры — наверх списка.
    () => sortSuppliersByRisk(suppliers, today),
    [suppliers, today]
  );

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const atRisk = rows.filter(
    (r) => r.state.status === "expired" || r.state.status === "expiring"
  );

  const columns: Column<SupplierRow>[] = [
    {
      key: "supplier",
      header: "Поставщик",
      cell: ({ supplier }) => (
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{supplier.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            БИН {supplier.bin}
            {supplier.tenderNumber ? ` · лот ${supplier.tenderNumber}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Категория",
      cell: ({ supplier }) => (
        <Badge tone="neutral" outline>
          {categoryName(supplier.categoryId)}
        </Badge>
      ),
    },
    {
      key: "contract",
      header: "Рамочный договор",
      hideOnMobile: true,
      cell: ({ supplier }) => (
        <div className="min-w-0">
          <p className="text-sm text-foreground">{supplier.contractNumber}</p>
          <p className="text-xs text-muted-foreground">
            с {formatDate(supplier.contractDateFrom)}
          </p>
        </div>
      ),
    },
    {
      key: "till",
      header: "Действует до",
      align: "right",
      cell: ({ supplier, state }) => (
        <div className="whitespace-nowrap">
          <p className="text-sm text-foreground">
            {formatDate(supplier.contractDateTo)}
          </p>
          <p
            className={
              state.daysLeft < 0
                ? "text-xs font-semibold text-danger-foreground"
                : state.daysLeft <= EXPIRING_WINDOW_DAYS
                  ? "text-xs font-semibold text-warning-foreground"
                  : "text-xs text-muted-foreground"
            }
          >
            {state.daysLeft < 0
              ? `истёк ${Math.abs(state.daysLeft)} дн. назад`
              : `${state.daysLeft} дн.`}
          </p>
        </div>
      ),
    },
    {
      key: "positions",
      header: "Позиций",
      align: "right",
      hideOnMobile: true,
      cell: ({ supplier }) => (
        <span className="text-sm text-foreground tabular-nums">
          {products.filter((p) => p.supplierId === supplier.id && !p.isArchived).length}
        </span>
      ),
    },
    {
      key: "volume",
      header: "Объём заказов",
      align: "right",
      hideOnMobile: true,
      cell: ({ supplier }) => {
        const metrics = supplierMetrics(orders, supplier.id);
        return (
          <div className="whitespace-nowrap">
            <p className="text-sm text-foreground">
              {formatMoney(metrics.totalAmount)}
            </p>
            <p className="text-xs text-muted-foreground">
              {metrics.orders.length} заказ(ов)
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Статус",
      cell: ({ state }) => (
        <Badge tone={CONTRACT_STATUS_TONE[state.status]} dot>
          {CONTRACT_STATUS_LABEL[state.status]}
        </Badge>
      ),
    },
    {
      key: "open",
      header: "",
      align: "right",
      cell: () => <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Поставщики"
        description="Модель «один поставщик на категорию»: по каждой категории закупа действует один рамочный договор, заключённый по итогам тендера в СЭТ."
      />

      {atRisk.length > 0 && (
        <Card className="flex flex-col gap-2 border-warning-border bg-warning-soft py-4">
          {atRisk.map(({ supplier, state }) => (
            <div key={supplier.id} className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              <p className="text-sm text-warning-foreground">
                {state.status === "expired" ? (
                  <>
                    Договор {supplier.contractNumber} по категории «
                    {categoryName(supplier.categoryId)}» истёк{" "}
                    {formatDate(supplier.contractDateTo)} — заказы по категории
                    остались без действующего договора.
                  </>
                ) : (
                  <>
                    Договор {supplier.contractNumber} по категории «
                    {categoryName(supplier.categoryId)}» истекает через{" "}
                    {state.daysLeft} дн. ({formatDate(supplier.contractDateTo)}) —
                    пора готовить тендер.
                  </>
                )}
              </p>
            </div>
          ))}
        </Card>
      )}

      {rows.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="Поставщиков нет"
          description="Поставщик появляется после проведения тендера и заключения рамочного договора на категорию."
        />
      ) : (
        <Table
          columns={columns}
          rows={rows}
          rowKey={({ supplier }) => supplier.id}
          compact
          onRowClick={({ supplier }) => setSelected(supplier)}
        />
      )}

      <SupplierDrawer
        supplier={selected}
        onClose={() => setSelected(null)}
        today={today}
      />
    </div>
  );
}
