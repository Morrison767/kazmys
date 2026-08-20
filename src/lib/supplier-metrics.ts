import { OrderStatus, type Order } from "@/types";

/**
 * Метрики поставщика для админ-панели ТД. Считаются по заказам из общего
 * состояния приложения, поэтому оформленные и проведённые в прототипе
 * заказы сразу попадают в статистику.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Минимальное число завершённых поставок для расчёта среднего срока.
 * Меньше — показываем «Недостаточно данных», а не выдуманное число.
 */
export const MIN_DELIVERY_SAMPLE = 2;

/** Заказы, в которых есть хотя бы одна позиция этого поставщика. */
export function ordersOfSupplier(orders: Order[], supplierId: string): Order[] {
  return orders
    .filter((order) => order.lines.some((line) => line.supplierId === supplierId))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/** Сумма позиций поставщика в заказе, ₸ без НДС. */
export function supplierAmountInOrder(order: Order, supplierId: string): number {
  return order.lines
    .filter((line) => line.supplierId === supplierId)
    .reduce((sum, line) => sum + line.lineTotal, 0);
}

/** Срок поставки одного заказа: «Согласован» → «Получен», дней. */
export function deliveryDaysOf(order: Order): number | null {
  const approvedAt = order.statusHistory.find(
    (e) => e.status === OrderStatus.Approved
  )?.at;
  const receivedAt = order.statusHistory.find(
    (e) => e.status === OrderStatus.Received
  )?.at;
  if (!approvedAt || !receivedAt) return null;

  const days = (new Date(receivedAt).getTime() - new Date(approvedAt).getTime()) / DAY_MS;
  return days >= 0 ? days : null;
}

export interface SupplierMetrics {
  orders: Order[];
  /** Заказы, доведённые до получения. */
  completedCount: number;
  /** Сумма позиций поставщика по всем заказам, ₸ без НДС. */
  totalAmount: number;
  /** Средний срок поставки, дней; null — данных недостаточно. */
  avgDeliveryDays: number | null;
  /** Разброс сроков поставки — минимум и максимум, дней. */
  minDeliveryDays: number | null;
  maxDeliveryDays: number | null;
  /** Число завершённых поставок, попавших в расчёт. */
  sampleSize: number;
}

export function supplierMetrics(
  orders: Order[],
  supplierId: string
): SupplierMetrics {
  const supplierOrders = ordersOfSupplier(orders, supplierId);
  const durations = supplierOrders
    .map(deliveryDaysOf)
    .filter((d): d is number => d !== null);

  const enough = durations.length >= MIN_DELIVERY_SAMPLE;

  return {
    orders: supplierOrders,
    completedCount: supplierOrders.filter(
      (o) => o.status === OrderStatus.Received
    ).length,
    totalAmount: supplierOrders.reduce(
      (sum, order) => sum + supplierAmountInOrder(order, supplierId),
      0
    ),
    avgDeliveryDays: enough
      ? Math.round(
          (durations.reduce((sum, d) => sum + d, 0) / durations.length) * 10
        ) / 10
      : null,
    minDeliveryDays: enough ? Math.round(Math.min(...durations)) : null,
    maxDeliveryDays: enough ? Math.round(Math.max(...durations)) : null,
    sampleSize: durations.length,
  };
}
