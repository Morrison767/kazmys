import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipboardList, LayoutGrid, X } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  OrderStatusBadge,
  Select,
  Table,
  type Column,
} from "@/components/ui";
import { ORDER_STATUS_FLOW, ORDER_STATUS_META } from "@/config/order-status";
import {
  filterOrders,
  hasActiveFilters,
  scopeOrdersForUser,
  type OrderFilters,
} from "@/lib/order-scope";
import { formatDate, formatMoney } from "@/lib/utils";
import { useCatalogStore, useOrdersStore, useSessionStore } from "@/store";
import { OrderStatus, type Order } from "@/types";

const ANY = "any";

/**
 * Список заказов. Данные берутся из общего состояния, поэтому решения
 * согласующего из /approvals видны здесь сразу, без перезагрузки.
 *
 * Область видимости: заказчик видит свои заказы, согласующий — заказы
 * подотчётных цехов.
 */
export default function OrdersPage() {
  const navigate = useNavigate();
  const role = useSessionStore((s) => s.role);
  const user = useSessionStore((s) => s.currentUser);
  const orders = useOrdersStore((s) => s.orders);
  const workshops = useCatalogStore((s) => s.workshops);
  const products = useCatalogStore((s) => s.products);

  /**
   * Фильтры можно задать ссылкой: /orders?workshop=…&product=…
   * Так работает переход «Проверить» из блока аномалий в аналитике.
   */
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<string>(ANY);
  const [workshopId, setWorkshopId] = useState<string>(
    () => searchParams.get("workshop") ?? ANY
  );
  const [productId, setProductId] = useState<string | null>(
    () => searchParams.get("product")
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const isApprover = role === "approver";

  const scopedOrders = useMemo(
    () => scopeOrdersForUser(orders, user, role),
    [orders, user, role]
  );

  /** Цеха, встречающиеся в области видимости — для фильтра. */
  const workshopOptions = useMemo(() => {
    const ids = [...new Set(scopedOrders.map((o) => o.workshopId))];
    return ids.map((id) => ({
      id,
      name: workshops.find((w) => w.id === id)?.name ?? id,
    }));
  }, [scopedOrders, workshops]);

  const filters: OrderFilters = useMemo(
    () => ({
      status: status === ANY ? null : (status as OrderStatus),
      workshopId: workshopId === ANY ? null : workshopId,
      productId,
      dateFrom,
      dateTo,
    }),
    [status, workshopId, productId, dateFrom, dateTo]
  );

  const filtered = useMemo(
    () => filterOrders(scopedOrders, filters),
    [scopedOrders, filters]
  );

  const hasFilters = hasActiveFilters(filters);

  const resetFilters = () => {
    setStatus(ANY);
    setWorkshopId(ANY);
    setProductId(null);
    setDateFrom("");
    setDateTo("");
    setSearchParams({}, { replace: true });
  };

  const workshopName = (id: string) =>
    workshops.find((w) => w.id === id)?.name ?? id;
  const productName = (id: string) =>
    products.find((p) => p.id === id)?.name ?? id;

  const totalAmount = filtered.reduce((sum, o) => sum + o.totalWithVat, 0);

  const columns: Column<Order>[] = [
    {
      key: "number",
      header: "Номер",
      cell: (order) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{order.number}</p>
          <p className="text-xs text-muted-foreground">
            {order.lines.length} поз.
            {order.autoApproved ? " · авто-одобрение" : ""}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Заказчик",
      hideOnMobile: true,
      cell: (order) => (
        <span className="text-sm text-foreground">{order.customerName}</span>
      ),
    },
    {
      key: "workshop",
      header: "Цех / участок",
      hideOnMobile: true,
      cell: (order) => (
        <div className="min-w-0">
          <p className="text-sm text-foreground">
            {workshopName(order.workshopId)}
          </p>
          {order.erp?.isOutsideErp && (
            <Badge tone="neutral" className="mt-1">
              вне D365 F&O
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "date",
      header: "Дата",
      hideOnMobile: true,
      cell: (order) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(order.createdAt)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Сумма с НДС",
      align: "right",
      cell: (order) => (
        <span className="font-semibold text-foreground">
          {formatMoney(order.totalWithVat)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Статус",
      cell: (order) => (
        <div className="flex flex-col items-start gap-1">
          <OrderStatusBadge status={order.status} showStep />
          {order.status === OrderStatus.Rejected && order.rejectionReason && (
            <span
              className="max-w-[220px] truncate text-xs text-muted-foreground"
              title={order.rejectionReason}
            >
              {order.rejectionReason}
            </span>
          )}
        </div>
      ),
    },
  ];

  if (!user) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Пользователь не выбран"
        description="Выберите роль в шапке, чтобы увидеть заказы."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={isApprover ? "Все заказы" : "Мои заказы"}
        description={
          isApprover
            ? "Заказы подотчётных цехов и их движение по жизненному циклу."
            : "Ваши заказы: от черновика до получения на предприятии."
        }
        actions={
          !isApprover ? (
            <Button
              variant="secondary"
              icon={LayoutGrid}
              onClick={() => navigate("/catalog")}
            >
              В каталог
            </Button>
          ) : undefined
        }
      />

      <Card className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Статус" htmlFor="filter-status">
            <Select
              id="filter-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={ANY}>Все статусы</option>
              {[...ORDER_STATUS_FLOW, OrderStatus.Rejected].map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_META[s].label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Цех / участок" htmlFor="filter-workshop">
            <Select
              id="filter-workshop"
              value={workshopId}
              onChange={(e) => setWorkshopId(e.target.value)}
            >
              <option value={ANY}>Все цеха</option>
              {workshopOptions.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Дата с" htmlFor="filter-from">
            <Input
              id="filter-from"
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </Field>

          <Field label="Дата по" htmlFor="filter-to">
            <Input
              id="filter-to"
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </Field>
        </div>

        {productId && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
            <span className="text-xs text-muted-foreground">Фильтр по позиции:</span>
            <Badge tone="primary">{productName(productId)}</Badge>
            <button
              type="button"
              onClick={() => {
                setProductId(null);
                searchParams.delete("product");
                setSearchParams(searchParams, { replace: true });
              }}
              className="ml-auto text-xs font-semibold text-primary transition-colors hover:underline"
            >
              Убрать
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground tabular-nums">
            Показано заказов: {filtered.length} из {scopedOrders.length} · сумма{" "}
            {formatMoney(totalAmount)}
          </p>
          {hasFilters && (
            <Button variant="ghost" size="sm" icon={X} onClick={resetFilters}>
              Сбросить фильтры
            </Button>
          )}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={hasFilters ? "Под фильтры ничего не подошло" : "Заказов пока нет"}
          description={
            hasFilters
              ? "Измените статус, цех или период — по текущим условиям заказов не найдено."
              : isApprover
                ? "По подотчётным цехам заказов ещё нет."
                : "Оформите первый заказ в каталоге — он появится здесь со статусом и суммой."
          }
          action={
            hasFilters ? (
              <Button variant="secondary" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            ) : !isApprover ? (
              <Button onClick={() => navigate("/catalog")}>
                Перейти в каталог
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Table
          columns={columns}
          rows={filtered}
          rowKey={(order) => order.id}
          onRowClick={(order) => navigate(`/orders/${order.id}`)}
        />
      )}
    </div>
  );
}
