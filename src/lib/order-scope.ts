import { OrderStatus, type Order, type User, type UserRole } from "@/types";

/**
 * Область видимости заказов и фильтры списка. Чистые функции: их используют
 * и /orders, и /approvals, и проверки данных.
 */

/**
 * Какие заказы видит пользователь:
 * — Заказчик — только свои;
 * — Согласующий — заказы подотчётных цехов;
 * — Администратор ТД и Руководитель — все (для админки и аналитики).
 */
export function scopeOrdersForUser(
  orders: Order[],
  user: User | null,
  role: UserRole
): Order[] {
  if (!user) return [];

  if (role === "approver") {
    const supervised = user.supervisedWorkshopIds;
    // Согласующий без списка подотчётных цехов видит хотя бы свой цех.
    if (!supervised || supervised.length === 0) {
      return orders.filter((o) => o.workshopId === user.workshopId);
    }
    return orders.filter((o) => supervised.includes(o.workshopId));
  }

  if (role === "customer") {
    return orders.filter((o) => o.customerId === user.id);
  }

  return orders;
}

/** Очередь согласований: заказы подотчётных цехов, ожидающие решения. */
export function pendingApprovalsFor(orders: Order[], user: User | null): Order[] {
  if (!user) return [];
  const supervised = user.supervisedWorkshopIds ?? [];
  return orders
    .filter(
      (o) =>
        o.status === OrderStatus.PendingApproval &&
        supervised.includes(o.workshopId)
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export interface OrderFilters {
  /** Статус заказа или null — любой. */
  status: OrderStatus | null;
  /** Цех или null — любой. */
  workshopId: string | null;
  /**
   * Позиция каталога или null — любая. Заказ проходит фильтр, если содержит
   * эту позицию. Используется переходом «Проверить» из аномалий аналитики
   * (query-параметр ?product=…).
   */
  productId: string | null;
  /** Начало периода, YYYY-MM-DD или пустая строка. */
  dateFrom: string;
  /** Конец периода включительно, YYYY-MM-DD или пустая строка. */
  dateTo: string;
}

export const EMPTY_ORDER_FILTERS: OrderFilters = {
  status: null,
  workshopId: null,
  productId: null,
  dateFrom: "",
  dateTo: "",
};

export function hasActiveFilters(filters: OrderFilters): boolean {
  return (
    filters.status !== null ||
    filters.workshopId !== null ||
    filters.productId !== null ||
    filters.dateFrom !== "" ||
    filters.dateTo !== ""
  );
}

/** Фильтр списка по статусу, цеху и диапазону дат создания. Сортировка — новые сверху. */
export function filterOrders(orders: Order[], filters: OrderFilters): Order[] {
  const from = filters.dateFrom
    ? new Date(`${filters.dateFrom}T00:00:00`).getTime()
    : null;
  const to = filters.dateTo
    ? new Date(`${filters.dateTo}T23:59:59.999`).getTime()
    : null;

  return orders
    .filter((order) => {
      if (filters.status !== null && order.status !== filters.status) return false;
      if (filters.workshopId !== null && order.workshopId !== filters.workshopId) {
        return false;
      }
      if (
        filters.productId !== null &&
        !order.lines.some((line) => line.productId === filters.productId)
      ) {
        return false;
      }
      const created = new Date(order.createdAt).getTime();
      if (from !== null && created < from) return false;
      if (to !== null && created > to) return false;
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
