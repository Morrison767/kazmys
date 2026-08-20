/**
 * Аналитика: оперативный контроль закупок и ходимость инструмента.
 * Типы заложены под дашборды Этапа «Аналитика» и экспорт в BI.
 */

import type { LimitPeriod } from "./limits";

/** Разрез оперативной аналитики. */
export type AnalyticsDimension =
  | "category"
  | "workshop"
  | "enterprise"
  | "supplier"
  | "region"
  | "period";

/** Объём закупок в одном разрезе. */
export interface PurchaseVolumePoint {
  dimension: AnalyticsDimension;
  /** id объекта разреза (categoryId, workshopId, …). */
  key: string;
  label: string;
  amount: number;
  quantity: number;
  orderCount: number;
}

/** Исполнение бюджета цеха: факт vs лимит и прогноз исчерпания. */
export interface BudgetExecution {
  workshopId: string;
  workshopName: string;
  categoryId: string;
  period: LimitPeriod;
  amountLimit: number;
  amountUsed: number;
  /** Доля использования лимита, 0–100+. */
  usedPercent: number;
  /** Прогнозная дата исчерпания лимита (ISO); null — не исчерпается. */
  forecastExhaustionAt: string | null;
}

/** Сроки поставки: среднее время заказ → получение и отклонения. */
export interface DeliveryTimeMetric {
  key: string;
  label: string;
  /** Среднее время от заказа до получения, дней. */
  avgDays: number;
  /** Нормативный срок, дней. */
  targetDays: number;
  /** Отклонение от норматива, дней (со знаком). */
  deviationDays: number;
  orderCount: number;
}

/** Топ популярных позиций. */
export interface TopProductMetric {
  productId: string;
  productName: string;
  categoryId: string;
  orderCount: number;
  quantity: number;
  amount: number;
  /** Динамика к предыдущему периоду, %. */
  trendPercent: number;
}

/**
 * Ходимость инструмента: интервал между повторными заказами одной позиции
 * одним участком, сопоставленный с нормативным сроком службы.
 */
export interface ToolLifecycleMetric {
  productId: string;
  productName: string;
  workshopId: string;
  workshopName: string;
  /** Фактический средний интервал между заказами, дней. */
  avgReorderIntervalDays: number;
  /** Нормативный срок службы позиции, дней. */
  serviceLifeDays: number;
  /** Перерасход: заказывают раньше норматива. */
  isOverconsumption: boolean;
  /** Отклонение от норматива, % (отрицательное — перерасход). */
  deviationPercent: number;
  reorderCount: number;
}

/** Аномалия потребления — сигнал для проверки. */
export interface ConsumptionAnomaly {
  id: string;
  productId: string;
  productName: string;
  workshopId: string;
  workshopName: string;
  /** Рост потребления к среднему, %. */
  growthPercent: number;
  periodLabel: string;
  severity: "low" | "medium" | "high";
  detectedAt: string;
}

/** Факт повторного заказа позиции цехом — «сырое» событие для ходимости. */
export interface ToolUsageEvent {
  /** Заказ, в котором позиция была заказана. */
  orderId: string;
  orderNumber: string;
  /** Дата заказа (ISO) — от неё считаются интервалы между перезаказами. */
  at: string;
  quantity: number;
}

/**
 * История повторных заказов одной позиции одним цехом за период.
 * Из неё считаются ToolLifecycleMetric (срок жизни, перерасход)
 * и ConsumptionAnomaly (резкий рост частоты в последнем периоде).
 */
export interface ToolUsageHistory {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  categoryId: string;
  workshopId: string;
  workshopName: string;
  enterpriseId: string;
  regionId: string;
  /** Нормативный срок службы позиции, дней (из Product.serviceLifeDays). */
  serviceLifeDays: number;
  /** События перезаказа в хронологическом порядке. */
  events: ToolUsageEvent[];
  /**
   * Ожидаемая классификация паттерна — ориентир для демонстрации:
   * stable — интервалы близки к нормативу, overconsumption — заметно короче,
   * anomaly — перерасход плюс резкий рост частоты в последнем периоде.
   */
  pattern: "stable" | "overconsumption" | "anomaly";
}

/** KPI-плитка дашборда руководителя. */
export interface KpiTile {
  id: string;
  label: string;
  value: string;
  /** Динамика к предыдущему периоду, % (опционально). */
  trendPercent?: number;
  hint?: string;
}
