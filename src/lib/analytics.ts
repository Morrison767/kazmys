import { deliveryDaysOf } from "@/lib/supplier-metrics";
import {
  OrderStatus,
  type Category,
  type Limit,
  type Order,
  type Product,
  type Supplier,
  type ToolUsageHistory,
  type Workshop,
} from "@/types";

/**
 * Расчёты аналитики. Все функции чистые и считают только по переданным
 * данным приложения (заказы, лимиты, поставщики, история статусов).
 * «Нарисованных» констант здесь нет: поменялся лимит в /admin/limits —
 * поменялись и цифры на дашборде.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Заказы, отклонённые согласующим, не считаются объёмом закупок. */
export function billableOrders(orders: Order[]): Order[] {
  return orders.filter(
    (o) =>
      o.status !== OrderStatus.Rejected && o.status !== OrderStatus.Draft
  );
}

/** Ключ месяца YYYY-MM и подпись «авг 2026». */
export function monthKeyOf(iso: string): string {
  return iso.slice(0, 7);
}

const MONTH_NAMES = [
  "янв",
  "фев",
  "мар",
  "апр",
  "май",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

export function monthLabelOf(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/** Последние N месяцев, включая месяц отчётной даты. */
export function lastMonthKeys(reference: Date, count: number): string[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(
      Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() - i, 1)
    );
    keys.push(date.toISOString().slice(0, 7));
  }
  return keys;
}

/* ————————————————————————— KPI ————————————————————————— */

export interface AnalyticsKpi {
  /** Объём закупок за период, ₸ без НДС. */
  totalAmount: number;
  ordersCount: number;
  /** Исполнение бюджета: факт / сумма лимитов, %. */
  budgetExecutionPercent: number;
  totalLimit: number;
  totalUsed: number;
  /** Средний срок поставки «Согласован» → «Получен», дней; null — нет данных. */
  avgDeliveryDays: number | null;
  deliverySampleSize: number;
  /** Количество аномалий потребления — то же число, что в блоке аномалий. */
  anomaliesCount: number;
}

export function computeKpi({
  orders,
  limits,
  anomaliesCount,
}: {
  orders: Order[];
  limits: Limit[];
  anomaliesCount: number;
}): AnalyticsKpi {
  const billable = billableOrders(orders);
  const durations = orders
    .map(deliveryDaysOf)
    .filter((d): d is number => d !== null);

  const totalLimit = limits.reduce((sum, l) => sum + l.amountLimit, 0);
  const totalUsed = limits.reduce((sum, l) => sum + l.amountUsed, 0);

  return {
    totalAmount: billable.reduce((sum, o) => sum + o.totalAmount, 0),
    ordersCount: billable.length,
    budgetExecutionPercent:
      totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0,
    totalLimit,
    totalUsed,
    avgDeliveryDays:
      durations.length > 0
        ? Math.round(
            (durations.reduce((sum, d) => sum + d, 0) / durations.length) * 10
          ) / 10
        : null,
    deliverySampleSize: durations.length,
    anomaliesCount,
  };
}

/* ————————————— Объём закупок по месяцам и категориям ————————————— */

export interface MonthlyCategoryVolume {
  monthKey: string;
  monthLabel: string;
  /** Сумма по категории закупа, ₸ (ключ — id категории). */
  [categoryId: string]: string | number;
}

export function purchaseVolumeByMonth({
  orders,
  categories,
  reference,
  monthsCount = 4,
}: {
  orders: Order[];
  /** Категории закупа верхнего уровня. */
  categories: Category[];
  reference: Date;
  monthsCount?: number;
}): { rows: MonthlyCategoryVolume[]; categoryIds: string[] } {
  const months = lastMonthKeys(reference, monthsCount);
  const totals = new Map<string, Map<string, number>>();

  for (const order of billableOrders(orders)) {
    const monthKey = monthKeyOf(order.createdAt);
    if (!months.includes(monthKey)) continue;
    for (const line of order.lines) {
      const byCategory = totals.get(monthKey) ?? new Map<string, number>();
      byCategory.set(
        line.categoryId,
        (byCategory.get(line.categoryId) ?? 0) + line.lineTotal
      );
      totals.set(monthKey, byCategory);
    }
  }

  // В диаграмму попадают только категории, по которым были закупки.
  const usedCategoryIds = categories
    .map((c) => c.id)
    .filter((id) =>
      months.some((month) => (totals.get(month)?.get(id) ?? 0) > 0)
    );

  const rows = months.map((monthKey) => {
    const row: MonthlyCategoryVolume = {
      monthKey,
      monthLabel: monthLabelOf(monthKey),
    };
    for (const categoryId of usedCategoryIds) {
      row[categoryId] = totals.get(monthKey)?.get(categoryId) ?? 0;
    }
    return row;
  });

  return { rows, categoryIds: usedCategoryIds };
}

/* ————————————————— Исполнение бюджета по цехам ————————————————— */

export interface BudgetForecast {
  /** Дней до исчерпания лимита при текущем темпе; null — не исчерпается. */
  daysLeft: number | null;
  /** Прогнозная дата исчерпания (ISO); null — не исчерпается. */
  exhaustAt: string | null;
  /** Средний расход в день за текущий период, ₸. */
  dailyBurn: number;
}

export interface WorkshopBudgetRow {
  workshop: Workshop;
  totalLimit: number;
  totalUsed: number;
  percent: number;
  /** Разрез по категориям. */
  categories: Array<{
    categoryId: string;
    limit: Limit;
    percent: number;
    forecast: BudgetForecast;
  }>;
  /** Самый близкий прогноз исчерпания среди категорий цеха. */
  forecast: BudgetForecast;
}

/**
 * Прогноз исчерпания лимита: остаток / средний расход в день.
 * При нулевом расходе делить не на что — лимит не исчерпается.
 */
export function forecastExhaustion(limit: Limit, reference: Date): BudgetForecast {
  const periodStart = new Date(`${limit.periodStart}T00:00:00.000Z`).getTime();
  const elapsedDays = Math.max(
    1,
    Math.ceil((reference.getTime() - periodStart) / DAY_MS)
  );
  const dailyBurn = limit.amountUsed / elapsedDays;
  const remaining = limit.amountLimit - limit.amountUsed;

  if (dailyBurn <= 0 || remaining <= 0) {
    return {
      daysLeft: remaining <= 0 ? 0 : null,
      exhaustAt: null,
      dailyBurn: Math.round(dailyBurn),
    };
  }

  const daysLeft = Math.floor(remaining / dailyBurn);
  return {
    daysLeft,
    exhaustAt: new Date(reference.getTime() + daysLeft * DAY_MS).toISOString(),
    dailyBurn: Math.round(dailyBurn),
  };
}

export function budgetExecutionByWorkshop({
  limits,
  workshops,
  reference,
}: {
  limits: Limit[];
  workshops: Workshop[];
  reference: Date;
}): WorkshopBudgetRow[] {
  return workshops
    .map((workshop) => {
      const workshopLimits = limits.filter((l) => l.workshopId === workshop.id);
      const totalLimit = workshopLimits.reduce((s, l) => s + l.amountLimit, 0);
      const totalUsed = workshopLimits.reduce((s, l) => s + l.amountUsed, 0);

      const categories = workshopLimits.map((limit) => ({
        categoryId: limit.categoryId,
        limit,
        percent:
          limit.amountLimit > 0
            ? Math.round((limit.amountUsed / limit.amountLimit) * 100)
            : 0,
        forecast: forecastExhaustion(limit, reference),
      }));

      // Для цеха берём самый ранний прогноз исчерпания среди его категорий.
      const soonest = categories
        .map((c) => c.forecast)
        .filter((f) => f.daysLeft !== null)
        .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))[0];

      return {
        workshop,
        totalLimit,
        totalUsed,
        percent: totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0,
        categories,
        forecast:
          soonest ?? { daysLeft: null, exhaustAt: null, dailyBurn: 0 },
      };
    })
    .filter((row) => row.totalLimit > 0)
    .sort((a, b) => b.percent - a.percent);
}

/* ————————————————————— Сроки поставки ————————————————————— */

export interface DeliveryRow {
  key: string;
  label: string;
  avgDays: number;
  /** Нормативный срок по договору, дней; null — не задан. */
  targetDays: number | null;
  /** Отклонение от норматива, дней (плюс — дольше норматива). */
  deviationDays: number | null;
  ordersCount: number;
}

/** Сроки поставки в разрезе категорий закупа. */
export function deliveryByCategory({
  orders,
  categories,
  suppliers,
}: {
  orders: Order[];
  categories: Category[];
  suppliers: Supplier[];
}): DeliveryRow[] {
  const buckets = new Map<string, number[]>();

  for (const order of orders) {
    const days = deliveryDaysOf(order);
    if (days === null) continue;
    // Категории заказа: одна поставка может закрывать несколько категорий.
    for (const categoryId of new Set(order.lines.map((l) => l.categoryId))) {
      buckets.set(categoryId, [...(buckets.get(categoryId) ?? []), days]);
    }
  }

  return [...buckets.entries()]
    .map(([categoryId, durations]) => {
      const avgDays =
        Math.round(
          (durations.reduce((s, d) => s + d, 0) / durations.length) * 10
        ) / 10;
      const target =
        suppliers.find((s) => s.categoryId === categoryId)?.normativeDeliveryDays ??
        null;
      return {
        key: categoryId,
        label: categories.find((c) => c.id === categoryId)?.name ?? categoryId,
        avgDays,
        targetDays: target,
        deviationDays:
          target !== null ? Math.round((avgDays - target) * 10) / 10 : null,
        ordersCount: durations.length,
      };
    })
    .sort((a, b) => (b.deviationDays ?? 0) - (a.deviationDays ?? 0));
}

/** Сроки поставки в разрезе поставщиков. */
export function deliveryBySupplier({
  orders,
  suppliers,
}: {
  orders: Order[];
  suppliers: Supplier[];
}): DeliveryRow[] {
  const buckets = new Map<string, number[]>();

  for (const order of orders) {
    const days = deliveryDaysOf(order);
    if (days === null) continue;
    for (const supplierId of new Set(order.lines.map((l) => l.supplierId))) {
      buckets.set(supplierId, [...(buckets.get(supplierId) ?? []), days]);
    }
  }

  return [...buckets.entries()]
    .map(([supplierId, durations]) => {
      const supplier = suppliers.find((s) => s.id === supplierId);
      const avgDays =
        Math.round(
          (durations.reduce((s, d) => s + d, 0) / durations.length) * 10
        ) / 10;
      const target = supplier?.normativeDeliveryDays ?? null;
      return {
        key: supplierId,
        label: supplier?.name ?? supplierId,
        avgDays,
        targetDays: target,
        deviationDays:
          target !== null ? Math.round((avgDays - target) * 10) / 10 : null,
        ordersCount: durations.length,
      };
    })
    .sort((a, b) => (b.deviationDays ?? 0) - (a.deviationDays ?? 0));
}

/* ————————————————— Топ популярных позиций ————————————————— */

export interface TopProductRow {
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  categoryId: string;
  ordersCount: number;
  quantity: number;
  amount: number;
  /** Количество единиц по месяцам — для спарклайна. */
  trend: Array<{ monthKey: string; monthLabel: string; quantity: number }>;
}

export function topProducts({
  orders,
  products,
  reference,
  monthsCount = 4,
  limit = 10,
}: {
  orders: Order[];
  products: Product[];
  reference: Date;
  monthsCount?: number;
  limit?: number;
}): TopProductRow[] {
  const months = lastMonthKeys(reference, monthsCount);
  const rows = new Map<
    string,
    {
      ordersCount: number;
      quantity: number;
      amount: number;
      productName: string;
      sku: string;
      unit: string;
      categoryId: string;
      byMonth: Map<string, number>;
    }
  >();

  for (const order of billableOrders(orders)) {
    const monthKey = monthKeyOf(order.createdAt);
    for (const line of order.lines) {
      const current =
        rows.get(line.productId) ??
        {
          ordersCount: 0,
          quantity: 0,
          amount: 0,
          productName: line.productName,
          sku: line.sku,
          unit: line.unit,
          categoryId: line.categoryId,
          byMonth: new Map<string, number>(),
        };
      current.ordersCount += 1;
      current.quantity += line.quantity;
      current.amount += line.lineTotal;
      current.byMonth.set(
        monthKey,
        (current.byMonth.get(monthKey) ?? 0) + line.quantity
      );
      rows.set(line.productId, current);
    }
  }

  return [...rows.entries()]
    .map(([productId, row]) => ({
      productId,
      productName: products.find((p) => p.id === productId)?.name ?? row.productName,
      sku: row.sku,
      unit: row.unit,
      categoryId: row.categoryId,
      ordersCount: row.ordersCount,
      quantity: row.quantity,
      amount: row.amount,
      trend: months.map((monthKey) => ({
        monthKey,
        monthLabel: monthLabelOf(monthKey),
        quantity: row.byMonth.get(monthKey) ?? 0,
      })),
    }))
    .sort(
      (a, b) => b.ordersCount - a.ordersCount || b.quantity - a.quantity
    )
    .slice(0, limit);
}

/* ————————————————— Ходимость инструмента ————————————————— */

export interface ToolWearRow {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  workshopId: string;
  workshopName: string;
  /** Средний интервал между перезаказами, дней — считается по датам истории. */
  avgIntervalDays: number;
  serviceLifeDays: number;
  /** Отклонение: интервал минус норматив (отрицательное — перерасход). */
  deviationDays: number;
  /** Доля фактического интервала от норматива, %. */
  ratioPercent: number;
  /** Ниже 70% норматива — сигнал возможного перерасхода. */
  isOverconsumption: boolean;
  reorderCount: number;
  intervals: number[];
}

/** Порог подсветки: фактический интервал меньше 70% нормативного срока. */
export const OVERCONSUMPTION_RATIO = 0.7;

/** Интервалы между перезаказами позиции цехом, дней (из дат истории). */
export function intervalsOf(history: ToolUsageHistory): number[] {
  return history.events.slice(1).map((event, i) =>
    Math.round(
      (new Date(event.at).getTime() -
        new Date(history.events[i].at).getTime()) /
        DAY_MS
    )
  );
}

export function toolWearRows(histories: ToolUsageHistory[]): ToolWearRow[] {
  return histories
    .flatMap((history) => {
      const intervals = intervalsOf(history);
      if (intervals.length === 0) return [];
      const avgIntervalDays =
        Math.round(
          (intervals.reduce((s, d) => s + d, 0) / intervals.length) * 10
        ) / 10;
      const ratio = avgIntervalDays / history.serviceLifeDays;

      return [
        {
          id: history.id,
          productId: history.productId,
          productName: history.productName,
          unit: history.unit,
          workshopId: history.workshopId,
          workshopName: history.workshopName,
          avgIntervalDays,
          serviceLifeDays: history.serviceLifeDays,
          deviationDays:
            Math.round((avgIntervalDays - history.serviceLifeDays) * 10) / 10,
          ratioPercent: Math.round(ratio * 100),
          isOverconsumption: ratio < OVERCONSUMPTION_RATIO,
          reorderCount: history.events.length,
          intervals,
        },
      ];
    })
    // Худшие сверху: наибольший перерасход (самое отрицательное отклонение).
    .sort((a, b) => a.deviationDays - b.deviationDays);
}

/* ————————————————————— Аномалии ————————————————————— */

/** Окно сравнения периодов, дней. */
export const ANOMALY_WINDOW_DAYS = 90;
/** Во сколько раз потребление должно вырасти, чтобы считаться аномалией. */
export const ANOMALY_GROWTH_FACTOR = 1.5;

export interface AnomalyRow {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  workshopId: string;
  workshopName: string;
  /** Заказов в предыдущем сопоставимом периоде. */
  previousCount: number;
  /** Заказов в текущем периоде. */
  currentCount: number;
  /** Во сколько раз выросло число заказов. */
  growthFactor: number;
  /** Рост в процентах. */
  growthPercent: number;
  severity: "medium" | "high";
  periodLabel: string;
}

/**
 * Аномалии потребления: число заказов позиции цехом за последние
 * ANOMALY_WINDOW_DAYS выросло более чем в ANOMALY_GROWTH_FACTOR раз
 * относительно предыдущего такого же периода.
 *
 * Считается динамически по датам истории — набор аномальных позиций
 * не зашит в данные. Этот же расчёт даёт число для KPI-карточки,
 * поэтому счётчик сверху и карточки внизу всегда совпадают.
 */
export function detectAnomalies(
  histories: ToolUsageHistory[],
  reference: Date
): AnomalyRow[] {
  const currentStart = reference.getTime() - ANOMALY_WINDOW_DAYS * DAY_MS;
  const previousStart = currentStart - ANOMALY_WINDOW_DAYS * DAY_MS;

  return histories
    .flatMap((history) => {
      let currentCount = 0;
      let previousCount = 0;

      for (const event of history.events) {
        const at = new Date(event.at).getTime();
        if (at >= currentStart && at <= reference.getTime()) currentCount += 1;
        else if (at >= previousStart && at < currentStart) previousCount += 1;
      }

      if (currentCount === 0) return [];

      // Нет базы для сравнения: аномалией считаем только явную серию заказов.
      const growthFactor =
        previousCount > 0 ? currentCount / previousCount : currentCount;
      const isAnomaly =
        previousCount > 0
          ? growthFactor > ANOMALY_GROWTH_FACTOR
          : currentCount >= 3;
      if (!isAnomaly) return [];

      return [
        {
          id: `anm-${history.id}`,
          productId: history.productId,
          productName: history.productName,
          unit: history.unit,
          workshopId: history.workshopId,
          workshopName: history.workshopName,
          previousCount,
          currentCount,
          growthFactor: Math.round(growthFactor * 10) / 10,
          growthPercent: Math.round((growthFactor - 1) * 100),
          severity: growthFactor >= 2.5 ? ("high" as const) : ("medium" as const),
          periodLabel: `последние ${ANOMALY_WINDOW_DAYS} дней к предыдущим ${ANOMALY_WINDOW_DAYS}`,
        },
      ];
    })
    .sort((a, b) => b.growthFactor - a.growthFactor);
}
