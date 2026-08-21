import { productById } from "@/mocks/products";
import { enterpriseById } from "@/mocks/regions";
import { workshopById } from "@/mocks/workshops";
import { rootCategoryId } from "@/mocks/categories";
import type {
  ConsumptionAnomaly,
  ToolLifecycleMetric,
  ToolUsageEvent,
  ToolUsageHistory,
} from "@/types";

/**
 * Архив повторных заказов инструмента за последние 12 месяцев — основа
 * аналитики ходимости. ORDERS содержит детальные заказы только за последние
 * три месяца, поэтому здесь ведётся отдельная история фактов перезаказа
 * (позиция × цех × дата).
 *
 * Данные подобраны так, чтобы демонстрировать три картины:
 * — stable: интервалы между перезаказами близки к нормативному сроку службы;
 * — overconsumption: интервалы заметно короче норматива (перерасход);
 * — anomaly: перерасход плюс резкий рост частоты заказов в последнем периоде.
 */

/** Дата отчёта — от неё считаются «последний период» и аномалии. */
export const TOOL_ANALYTICS_REPORT_DATE = "2026-08-20";

/** Окно «последнего периода» для поиска аномалий, дней. */
const RECENT_WINDOW_DAYS = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

function parseDay(day: string): number {
  const [year, month, date] = day.split("-").map(Number);
  return Date.UTC(year, month - 1, date);
}

function toIso(timestamp: number): string {
  // Заказы оформляются в рабочее время; для аналитики важна дата.
  return new Date(timestamp + 5 * 60 * 60 * 1000).toISOString();
}

interface HistoryConfig {
  id: string;
  productId: string;
  workshopId: string;
  pattern: ToolUsageHistory["pattern"];
  /** Дата первого заказа в архиве (YYYY-MM-DD). */
  startAt: string;
  /** Количество в первом заказе. */
  firstQuantity: number;
  /** Последующие заказы: [интервал от предыдущего в днях, количество]. */
  steps: Array<[intervalDays: number, quantity: number]>;
  /** Номер первого заказа серии — дальше нумерация последовательная. */
  firstOrderSeq: number;
}

function buildUsageHistory(config: HistoryConfig): ToolUsageHistory {
  const product = productById(config.productId);
  if (!product) {
    throw new Error(`Позиция ${config.productId} не найдена`);
  }
  if (product.serviceLifeDays === undefined) {
    throw new Error(
      `У позиции ${config.productId} не задан нормативный срок службы`
    );
  }
  const workshop = workshopById(config.workshopId);
  if (!workshop) {
    throw new Error(`Цех ${config.workshopId} не найден`);
  }
  const enterprise = enterpriseById(workshop.enterpriseId);
  if (!enterprise) {
    throw new Error(`Предприятие ${workshop.enterpriseId} не найдено`);
  }

  const events: ToolUsageEvent[] = [];
  let timestamp = parseDay(config.startAt);
  let quantity = config.firstQuantity;

  for (let i = 0; i <= config.steps.length; i += 1) {
    if (i > 0) {
      const [intervalDays, stepQuantity] = config.steps[i - 1];
      timestamp += intervalDays * DAY_MS;
      quantity = stepQuantity;
    }
    const seq = config.firstOrderSeq + i;
    const year = new Date(timestamp).getUTCFullYear();
    events.push({
      orderId: `${config.id}-o${String(i + 1).padStart(2, "0")}`,
      orderNumber: `ЗК-${year}-${String(seq).padStart(6, "0")}`,
      at: toIso(timestamp),
      quantity,
    });
  }

  return {
    id: config.id,
    productId: product.id,
    productName: product.name,
    unit: product.unit,
    categoryId: rootCategoryId(product.categoryId),
    workshopId: workshop.id,
    workshopName: workshop.name,
    enterpriseId: enterprise.id,
    regionId: workshop.regionId,
    serviceLifeDays: product.serviceLifeDays,
    events,
    pattern: config.pattern,
  };
}

const HISTORY_CONFIGS: HistoryConfig[] = [
  // ——— Стабильное потребление: интервал ≈ нормативный срок службы ———
  {
    id: "tuh-sverlo-krg-drill",
    productId: "prd-instrumenty-i-007",
    workshopId: "wsh-krg-drill",
    pattern: "stable",
    startAt: "2025-09-08",
    firstQuantity: 24,
    steps: [
      [40, 20],
      [42, 24],
      [38, 22],
      [41, 24],
      [40, 20],
      [39, 24],
      [42, 24],
    ],
    firstOrderSeq: 12,
  },
  {
    id: "tuh-metchik-blh-rem",
    productId: "prd-instrumenty-i-013",
    workshopId: "wsh-blh-rem",
    pattern: "stable",
    startAt: "2025-09-20",
    firstQuantity: 18,
    steps: [
      [42, 16],
      [40, 18],
      [44, 20],
      [41, 18],
      [43, 16],
      [40, 18],
    ],
    firstOrderSeq: 24,
  },
  {
    id: "tuh-krug-blh-smelt",
    productId: "prd-rashodnye-materialy-012",
    workshopId: "wsh-blh-smelt",
    pattern: "stable",
    startAt: "2025-09-02",
    firstQuantity: 30,
    steps: [
      [46, 28],
      [44, 30],
      [45, 32],
      [47, 28],
      [44, 30],
    ],
    firstOrderSeq: 31,
  },
  {
    id: "tuh-freza-blh-rem",
    productId: "prd-instrumenty-i-011",
    workshopId: "wsh-blh-rem",
    pattern: "stable",
    startAt: "2025-09-15",
    firstQuantity: 6,
    steps: [
      [118, 5],
      [122, 6],
    ],
    firstOrderSeq: 38,
  },

  // ——— Перерасход: интервалы заметно короче норматива ———
  {
    id: "tuh-koronka-krg-drill",
    productId: "prd-rashodnye-materialy-004",
    workshopId: "wsh-krg-drill",
    pattern: "overconsumption",
    startAt: "2025-09-10",
    firstQuantity: 10,
    steps: [
      [35, 8],
      [34, 12],
      [36, 10],
      [35, 8],
      [34, 12],
      [36, 10],
      [35, 11],
      [34, 8],
      [35, 11],
    ],
    firstOrderSeq: 44,
  },
  {
    id: "tuh-elektrod-chu-fab",
    productId: "prd-rashodnye-materialy-019",
    workshopId: "wsh-chu-fab",
    pattern: "overconsumption",
    startAt: "2026-01-10",
    firstQuantity: 40,
    steps: [
      [12, 36],
      [13, 40],
      [11, 44],
      [12, 40],
      [13, 36],
      [12, 40],
      [12, 44],
      [11, 40],
      [13, 36],
      [12, 40],
      [12, 44],
      [11, 40],
      [13, 36],
      [12, 40],
      [12, 40],
      [13, 44],
      [12, 40],
    ],
    firstOrderSeq: 57,
  },

  // ——— Перерасход + аномалия: резкий рост частоты в последнем периоде ———
  {
    id: "tuh-plastina-krg-drill",
    productId: "prd-rashodnye-materialy-001",
    workshopId: "wsh-krg-drill",
    pattern: "anomaly",
    startAt: "2025-11-01",
    firstQuantity: 3,
    steps: [
      [24, 3],
      [25, 2],
      [24, 3],
      [23, 3],
      [24, 2],
      [25, 3],
      [24, 3],
      [23, 2],
      [24, 3],
      [8, 4],
      [8, 4],
      [7, 4],
      [8, 5],
      [8, 4],
      [8, 4],
      [7, 5],
      [8, 4],
      [8, 5],
    ],
    firstOrderSeq: 71,
  },
  {
    id: "tuh-napilnik-blh-rem",
    productId: "prd-instrumenty-i-024",
    workshopId: "wsh-blh-rem",
    pattern: "anomaly",
    startAt: "2025-10-01",
    firstQuantity: 5,
    steps: [
      [30, 4],
      [31, 5],
      [29, 6],
      [30, 5],
      [31, 4],
      [30, 6],
      [31, 5],
      [30, 5],
      [9, 7],
      [9, 8],
      [10, 7],
      [9, 8],
      [9, 7],
      [10, 8],
      [9, 7],
      [9, 8],
    ],
    firstOrderSeq: 84,
  },
];

export const TOOL_USAGE_HISTORY: ToolUsageHistory[] =
  HISTORY_CONFIGS.map(buildUsageHistory);

/** Интервалы между последовательными заказами позиции цехом, дней. */
export function reorderIntervals(history: ToolUsageHistory): number[] {
  return history.events.slice(1).map((event, i) => {
    const previous = new Date(history.events[i].at).getTime();
    return Math.round((new Date(event.at).getTime() - previous) / DAY_MS);
  });
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Срок жизни инструмента и перерасход — метрики по каждой паре
 * «позиция × цех». Перерасходом считается фактический интервал короче
 * 85% нормативного срока службы.
 */
export const TOOL_LIFECYCLE_METRICS: ToolLifecycleMetric[] =
  TOOL_USAGE_HISTORY.map((history) => {
    const intervals = reorderIntervals(history);
    const avg = average(intervals);
    const deviationPercent = Math.round(
      ((avg - history.serviceLifeDays) / history.serviceLifeDays) * 100
    );
    return {
      productId: history.productId,
      productName: history.productName,
      workshopId: history.workshopId,
      workshopName: history.workshopName,
      avgReorderIntervalDays: Math.round(avg),
      serviceLifeDays: history.serviceLifeDays,
      isOverconsumption: avg < history.serviceLifeDays * 0.85,
      deviationPercent,
      reorderCount: history.events.length,
    };
  });

/**
 * Аномалии потребления: частота заказов в последних 90 днях выросла
 * более чем на 50% относительно предыдущего периода.
 */
export const CONSUMPTION_ANOMALIES: ConsumptionAnomaly[] =
  TOOL_USAGE_HISTORY.flatMap((history) => {
    const reportAt = parseDay(TOOL_ANALYTICS_REPORT_DATE);
    const windowStart = reportAt - RECENT_WINDOW_DAYS * DAY_MS;
    const intervals = reorderIntervals(history);

    const recent: number[] = [];
    const earlier: number[] = [];
    intervals.forEach((interval, i) => {
      const at = new Date(history.events[i + 1].at).getTime();
      (at >= windowStart ? recent : earlier).push(interval);
    });

    if (recent.length === 0 || earlier.length === 0) return [];

    const recentAvg = average(recent);
    const earlierAvg = average(earlier);
    if (recentAvg <= 0) return [];

    // Частота растёт, когда интервал между заказами сокращается.
    const growthPercent = Math.round((earlierAvg / recentAvg - 1) * 100);
    if (growthPercent < 50) return [];

    return [
      {
        id: `anm-${history.id}`,
        productId: history.productId,
        productName: history.productName,
        workshopId: history.workshopId,
        workshopName: history.workshopName,
        growthPercent,
        periodLabel: "последние 90 дней к предыдущему периоду",
        severity:
          growthPercent >= 150 ? "high" : growthPercent >= 100 ? "medium" : "low",
        detectedAt: `${TOOL_ANALYTICS_REPORT_DATE}T03:00:00.000Z`,
      },
    ];
  });

/** История по конкретной позиции и цеху. */
export function usageHistoryOf(
  productId: string,
  workshopId: string
): ToolUsageHistory | undefined {
  return TOOL_USAGE_HISTORY.find(
    (h) => h.productId === productId && h.workshopId === workshopId
  );
}
