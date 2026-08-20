import { useMemo } from "react";
import { Mail, Phone, User } from "lucide-react";

import {
  Badge,
  DefinitionList,
  Drawer,
  OrderStatusBadge,
  Table,
  type Column,
} from "@/components/ui";
import {
  CONTRACT_STATUS_LABEL,
  CONTRACT_STATUS_TONE,
  contractStateOf,
} from "@/lib/supplier-contract";
import {
  MIN_DELIVERY_SAMPLE,
  deliveryDaysOf,
  supplierAmountInOrder,
  supplierMetrics,
} from "@/lib/supplier-metrics";
import { formatDate, formatMoney } from "@/lib/utils";
import { useCatalogStore, useOrdersStore } from "@/store";
import type { Order, Supplier } from "@/types";

/**
 * Карточка поставщика: договор, контакты, заказы по его номенклатуре
 * и средний срок поставки. Заказы берутся из общего состояния, поэтому
 * оформленные в прототипе заказы сразу попадают в статистику.
 */
export function SupplierDrawer({
  supplier,
  onClose,
  today,
}: {
  supplier: Supplier | null;
  onClose: () => void;
  today: Date;
}) {
  const orders = useOrdersStore((s) => s.orders);
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);
  const workshops = useCatalogStore((s) => s.workshops);

  const metrics = useMemo(
    () => (supplier ? supplierMetrics(orders, supplier.id) : null),
    [orders, supplier]
  );

  if (!supplier || !metrics) return null;

  const state = contractStateOf(supplier, today);
  const categoryName =
    categories.find((c) => c.id === supplier.categoryId)?.name ?? supplier.categoryId;
  const positionsInCatalog = products.filter(
    (p) => p.supplierId === supplier.id && !p.isArchived
  ).length;
  const workshopName = (id: string) =>
    workshops.find((w) => w.id === id)?.name ?? id;

  const orderColumns: Column<Order>[] = [
    {
      key: "number",
      header: "Заказ",
      cell: (order) => (
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{order.number}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(order.createdAt)} · {workshopName(order.workshopId)}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Сумма",
      align: "right",
      cell: (order) => (
        <span className="whitespace-nowrap text-sm text-foreground">
          {formatMoney(supplierAmountInOrder(order, supplier.id))}
        </span>
      ),
    },
    {
      key: "status",
      header: "Статус",
      cell: (order) => {
        const days = deliveryDaysOf(order);
        return (
          <div className="flex flex-col items-start gap-1">
            <OrderStatusBadge status={order.status} />
            {days !== null && (
              <span className="text-xs text-muted-foreground">
                поставка {Math.round(days)} дн.
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Drawer open onClose={onClose} title={supplier.name}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={CONTRACT_STATUS_TONE[state.status]} dot>
            {CONTRACT_STATUS_LABEL[state.status]}
          </Badge>
          <Badge tone="neutral" outline>
            {categoryName}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {state.status === "expired"
            ? `Договор истёк ${Math.abs(state.daysLeft)} дн. назад — требуется новый тендер через СЭТ.`
            : state.status === "expiring"
              ? `До окончания договора ${state.daysLeft} дн. — пора планировать тендер.`
              : `Договор действует ещё ${state.daysLeft} дн.`}
        </p>
      </div>

      <DefinitionList
        rows={[
          { label: "БИН", value: supplier.bin },
          { label: "Рамочный договор", value: supplier.contractNumber },
          {
            label: "Срок действия",
            value: `${formatDate(supplier.contractDateFrom)} — ${formatDate(
              supplier.contractDateTo
            )}`,
          },
          { label: "Лот / тендер СЭТ", value: supplier.tenderNumber ?? "—" },
          {
            label: "Покрытие номенклатуры",
            value:
              supplier.nomenclatureCoverage !== undefined
                ? `${supplier.nomenclatureCoverage}%`
                : "—",
          },
          { label: "Позиций в каталоге", value: `${positionsInCatalog}` },
        ]}
      />

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Контакты
        </p>
        <div className="flex flex-col gap-1.5 rounded-xl border border-border p-3">
          <span className="flex items-center gap-2 text-sm text-foreground">
            <User className="h-4 w-4 shrink-0 text-muted-foreground" />
            {supplier.contactPerson ?? "Контактное лицо не указано"}
          </span>
          <span className="flex items-center gap-2 text-sm text-foreground">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
            {supplier.contactPhone ?? "—"}
          </span>
          <span className="flex items-center gap-2 break-all text-sm text-foreground">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            {supplier.contactEmail ?? "—"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Средний срок поставки
        </p>
        <div className="rounded-xl border border-border p-3">
          {metrics.avgDeliveryDays !== null ? (
            <>
              <p className="text-lg font-bold tabular-nums tracking-tight text-foreground">
                {metrics.avgDeliveryDays} дн.
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                От согласования до получения · разброс{" "}
                {metrics.minDeliveryDays}–{metrics.maxDeliveryDays} дн. · по{" "}
                {metrics.sampleSize} завершённым поставкам
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-foreground">
                Недостаточно данных
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Завершённых поставок: {metrics.sampleSize} из{" "}
                {MIN_DELIVERY_SAMPLE} необходимых для расчёта среднего срока.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Заказы по номенклатуре поставщика
          </p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {metrics.orders.length} шт. · {formatMoney(metrics.totalAmount)}
          </p>
        </div>
        <Table
          columns={orderColumns}
          rows={metrics.orders}
          rowKey={(order) => order.id}
          compact
          emptyMessage="Заказов по этому поставщику ещё нет"
        />
      </div>
    </Drawer>
  );
}
