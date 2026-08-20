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
    // Сверло по бетону SDS-plus 12×160 мм, норматив 45 дней
    id: "tuh-sdsplus-krg-drill",
    productId: "prd-tls-014",
    workshopId: "wsh-krg-drill",
    pattern: "stable",
    startAt: "2025-09-08",
    firstQuantity: 24,
    steps: [
      [45, 20],
      [46, 24],
      [45, 22],
      [46, 24],
      [46, 20],
      [45, 24],
      [46, 24],
    ],
    firstOrderSeq: 12,
  },
  {
    // Полотно для сабельной пилы по металлу, норматив 60 дней
    id: "tuh-saw-blh-rem",
    productId: "prd-tls-015",
    workshopId: "wsh-blh-rem",
    pattern: "stable",
    startAt: "2025-09-15",
    firstQuantity: 8,
    steps: [
      [62, 8],
      [62, 6],
      [62, 8],
      [62, 8],
      [62, 8],
    ],
    firstOrderSeq: 24,
  },
  {
    // Зубило пневматическое (пика) 175 мм, норматив 120 дней
    id: "tuh-chisel-blh-smelt",
    productId: "prd-tls-007",
    workshopId: "wsh-blh-smelt",
    pattern: "stable",
    startAt: "2025-09-02",
    firstQuantity: 20,
    steps: [
      [118, 18],
      [119, 20],
      [113, 20],
    ],
    firstOrderSeq: 31,
  },
  {
    // Ключ разводной 250 мм, норматив 180 дней
    id: "tuh-wrench-blh-rem",
    productId: "prd-tls-009",
    workshopId: "wsh-blh-rem",
    pattern: "stable",
    startAt: "2025-08-22",
    firstQuantity: 25,
    steps: [
      [178, 20],
      [178, 25],
    ],
    firstOrderSeq: 38,
  },

  // ——— Перерасход: интервалы заметно короче норматива ———
  {
    // Бур SDS-max 18×600 мм, норматив 90 дней, факт ≈ 38 дней
    id: "tuh-sdsmax-krg-drill",
    productId: "prd-tls-013",
    workshopId: "wsh-krg-drill",
    pattern: "overconsumption",
    startAt: "2025-09-10",
    firstQuantity: 10,
    steps: [
      [38, 8],
      [38, 12],
      [37, 10],
      [38, 8],
      [38, 12],
      [38, 10],
      [38, 11],
      [38, 8],
      [37, 11],
    ],
    firstOrderSeq: 44,
  },
  {
    // Пильный диск по металлу 355 мм, норматив 75 дней, факт ≈ 31 день
    id: "tuh-blade355-chu-fab",
    productId: "prd-tls-017",
    workshopId: "wsh-chu-fab",
    pattern: "overconsumption",
    startAt: "2025-09-20",
    firstQuantity: 8,
    steps: [
      [31, 9],
      [31, 8],
      [31, 9],
      [31, 8],
      [31, 9],
      [31, 9],
      [31, 8],
      [31, 9],
      [31, 9],
      [31, 9],
    ],
    firstOrderSeq: 57,
  },

  // ——— Перерасход + аномалия: резкий рост частоты в последнем периоде ———
  {
    // Коронка алмазная 68 мм, норматив 150 дней: было ≈ 62 дня,
    // с июня 2026 — ≈ 18 дней.
    id: "tuh-crown-krg-drill",
    productId: "prd-tls-016",
    workshopId: "wsh-krg-drill",
    pattern: "anomaly",
    startAt: "2025-09-05",
    firstQuantity: 2,
    steps: [
      [62, 2],
      [62, 3],
      [62, 2],
      [62, 3],
      [34, 4],
      [18, 4],
      [18, 4],
      [18, 4],
    ],
    firstOrderSeq: 71,
  },
  {
    // Сверло по металлу HSS-Co 10 мм, норматив 30 дней: было ≈ 21 день,
    // с июля 2026 — ≈ 7 дней.
    id: "tuh-hss10-blh-rem",
    productId: "prd-tls-018",
    workshopId: "wsh-blh-rem",
    pattern: "anomaly",
    startAt: "2025-10-17",
    firstQuantity: 5,
    steps: [
      [21, 4],
      [21, 5],
      [21, 6],
      [21, 5],
      [21, 4],
      [21, 6],
      [21, 5],
      [21, 5],
      [21, 6],
      [21, 5],
      [21, 6],
      [14, 6],
      [14, 7],
      [7, 7],
      [7, 8],
      [7, 7],
      [7, 8],
      [7, 7],
      [7, 8],
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
