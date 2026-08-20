import type { Limit, LimitPeriod, ProductQuota } from "@/types";

/**
 * Лимиты цехов по категориям закупа — на каждую пару «цех × доступная
 * категория» (см. WORKSHOPS.allowedCategoryIds). Основа лимитов —
 * утверждённые нормы потребления из заявочной кампании.
 *
 * Текущий период — август 2026 (для лимита с периодом «квартал» —
 * III квартал 2026). Загрузка распределена для демонстрации:
 * — большинство цехов далеко от лимита (< 40%);
 * — две пары в середине периода (около 60%);
 * — шесть пар близки к исчерпанию (> 80%);
 * — «Сервисный участок (Казахсервис)» × Инструменты уже превысил лимит (116%).
 *
 * autoApprovalThreshold — сумма, ниже которой заказ уходит в исполнение
 * без согласования; escalationThreshold — сумма, выше которой к согласованию
 * подключаются руководитель подразделения и бюджетный контролёр.
 */

const MONTH_START = "2026-08-01";
const MONTH_END = "2026-08-31";
const QUARTER_START = "2026-07-01";
const QUARTER_END = "2026-09-30";

const ADMIN = "Байжанова А.К.";

interface LimitRow {
  id: string;
  workshopId: string;
  categoryId: string;
  period: LimitPeriod;
  amountLimit: number;
  amountUsed: number;
  quantityLimit: number | null;
  quantityUsed: number;
  autoApprovalThreshold: number;
  escalationThreshold?: number;
  updatedAt: string;
}

const LIMIT_ROWS: LimitRow[] = [
  // ——— Буровой участок №1 (Караганда) ———
  {
    id: "lim-krg-drill-tools",
    workshopId: "wsh-krg-drill",
    categoryId: "cat-tools",
    period: "month",
    amountLimit: 4500000,
    amountUsed: 1620000, // 36%
    quantityLimit: 320,
    quantityUsed: 118,
    autoApprovalThreshold: 250000,
    escalationThreshold: 2000000,
    updatedAt: "2026-07-28T09:12:00.000Z",
  },
  {
    id: "lim-krg-drill-other",
    workshopId: "wsh-krg-drill",
    categoryId: "cat-other",
    period: "month",
    amountLimit: 2800000,
    amountUsed: 2410000, // 86% — близко к исчерпанию
    quantityLimit: 4000,
    quantityUsed: 3320,
    autoApprovalThreshold: 200000,
    escalationThreshold: 1500000,
    updatedAt: "2026-08-05T06:40:00.000Z",
  },

  // ——— Бухгалтерия и АУП (Караганда) ———
  {
    id: "lim-krg-acc-office",
    workshopId: "wsh-krg-acc",
    categoryId: "cat-office",
    period: "month",
    amountLimit: 1200000,
    amountUsed: 385000, // 32%
    quantityLimit: 3000,
    quantityUsed: 940,
    autoApprovalThreshold: 150000,
    escalationThreshold: 700000,
    updatedAt: "2026-07-30T11:05:00.000Z",
  },
  {
    id: "lim-krg-acc-household",
    workshopId: "wsh-krg-acc",
    categoryId: "cat-household",
    period: "month",
    amountLimit: 900000,
    amountUsed: 742000, // 82% — близко к исчерпанию
    quantityLimit: 1500,
    quantityUsed: 1180,
    autoApprovalThreshold: 120000,
    escalationThreshold: 600000,
    updatedAt: "2026-08-11T08:20:00.000Z",
  },

  // ——— Сервисный участок «Казахсервис» (вне D365 F&O) ———
  {
    id: "lim-krg-svc-office",
    workshopId: "wsh-krg-svc",
    categoryId: "cat-office",
    period: "month",
    amountLimit: 600000,
    amountUsed: 168000, // 28%
    quantityLimit: 1200,
    quantityUsed: 305,
    autoApprovalThreshold: 100000,
    escalationThreshold: 400000,
    updatedAt: "2026-08-03T05:55:00.000Z",
  },
  {
    id: "lim-krg-svc-household",
    workshopId: "wsh-krg-svc",
    categoryId: "cat-household",
    period: "month",
    amountLimit: 750000,
    amountUsed: 690000, // 92% — почти исчерпан
    quantityLimit: 900,
    quantityUsed: 810,
    autoApprovalThreshold: 100000,
    escalationThreshold: 500000,
    updatedAt: "2026-08-14T07:35:00.000Z",
  },
  {
    id: "lim-krg-svc-tools",
    workshopId: "wsh-krg-svc",
    categoryId: "cat-tools",
    period: "month",
    amountLimit: 1500000,
    /** Лимит превышен (116%) — крайний случай для аналитики и админки. */
    amountUsed: 1735000,
    quantityLimit: 150,
    quantityUsed: 168,
    autoApprovalThreshold: 200000,
    escalationThreshold: 900000,
    updatedAt: "2026-08-18T10:02:00.000Z",
  },

  // ——— Плавильный цех №2 (Kazakhmys Smelting, Балхаш) ———
  {
    id: "lim-blh-smelt-tools",
    workshopId: "wsh-blh-smelt",
    categoryId: "cat-tools",
    period: "month",
    amountLimit: 6000000,
    amountUsed: 2130000, // 36%
    quantityLimit: 500,
    quantityUsed: 168,
    autoApprovalThreshold: 300000,
    escalationThreshold: 2500000,
    updatedAt: "2026-07-27T12:15:00.000Z",
  },
  {
    id: "lim-blh-smelt-other",
    workshopId: "wsh-blh-smelt",
    categoryId: "cat-other",
    period: "month",
    amountLimit: 5200000,
    amountUsed: 1456000, // 28%
    quantityLimit: 9000,
    quantityUsed: 2480,
    autoApprovalThreshold: 300000,
    escalationThreshold: 2500000,
    updatedAt: "2026-07-27T12:18:00.000Z",
  },
  {
    id: "lim-blh-smelt-household",
    workshopId: "wsh-blh-smelt",
    categoryId: "cat-household",
    period: "month",
    amountLimit: 1100000,
    amountUsed: 638000, // 58%
    quantityLimit: 1800,
    quantityUsed: 1010,
    autoApprovalThreshold: 120000,
    escalationThreshold: 700000,
    updatedAt: "2026-08-04T09:44:00.000Z",
  },

  // ——— Ремонтно-механический цех (Балхашский ГОК) ———
  {
    id: "lim-blh-rem-tools",
    workshopId: "wsh-blh-rem",
    categoryId: "cat-tools",
    period: "month",
    amountLimit: 5500000,
    amountUsed: 4730000, // 86% — близко к исчерпанию
    quantityLimit: 600,
    quantityUsed: 512,
    autoApprovalThreshold: 300000,
    escalationThreshold: 2500000,
    updatedAt: "2026-08-12T06:25:00.000Z",
  },
  {
    id: "lim-blh-rem-other",
    workshopId: "wsh-blh-rem",
    categoryId: "cat-other",
    period: "month",
    amountLimit: 3400000,
    amountUsed: 2074000, // 61%
    quantityLimit: 6000,
    quantityUsed: 3620,
    autoApprovalThreshold: 250000,
    escalationThreshold: 1800000,
    updatedAt: "2026-07-29T13:31:00.000Z",
  },

  // ——— Обогатительный цех (ЖГМК, Жезказган) ———
  {
    id: "lim-zhz-conc-tools",
    workshopId: "wsh-zhz-conc",
    categoryId: "cat-tools",
    period: "month",
    amountLimit: 3800000,
    amountUsed: 1254000, // 33%
    quantityLimit: 400,
    quantityUsed: 132,
    autoApprovalThreshold: 250000,
    escalationThreshold: 1800000,
    updatedAt: "2026-08-06T07:10:00.000Z",
  },
  {
    id: "lim-zhz-conc-household",
    workshopId: "wsh-zhz-conc",
    categoryId: "cat-household",
    period: "month",
    amountLimit: 850000,
    amountUsed: 731000, // 86% — близко к исчерпанию
    quantityLimit: 1400,
    quantityUsed: 1205,
    autoApprovalThreshold: 120000,
    escalationThreshold: 550000,
    updatedAt: "2026-08-15T05:48:00.000Z",
  },

  // ——— Участок обогащения «Шатыркуль» (Чуйская обл.) ———
  {
    id: "lim-chu-fab-tools",
    workshopId: "wsh-chu-fab",
    categoryId: "cat-tools",
    period: "month",
    amountLimit: 2900000,
    amountUsed: 986000, // 34%
    quantityLimit: 300,
    quantityUsed: 104,
    autoApprovalThreshold: 200000,
    escalationThreshold: 1400000,
    updatedAt: "2026-08-02T10:20:00.000Z",
  },
  {
    id: "lim-chu-fab-other",
    workshopId: "wsh-chu-fab",
    categoryId: "cat-other",
    /** СИЗ и абразивы закупаются квартальными нормами. */
    period: "quarter",
    amountLimit: 4200000,
    amountUsed: 3570000, // 85% — близко к исчерпанию
    quantityLimit: 7000,
    quantityUsed: 5960,
    autoApprovalThreshold: 250000,
    escalationThreshold: 2000000,
    updatedAt: "2026-08-08T09:02:00.000Z",
  },
  {
    id: "lim-chu-fab-household",
    workshopId: "wsh-chu-fab",
    categoryId: "cat-household",
    period: "month",
    amountLimit: 700000,
    amountUsed: 245000, // 35%
    quantityLimit: 1000,
    quantityUsed: 350,
    autoApprovalThreshold: 100000,
    escalationThreshold: 450000,
    updatedAt: "2026-08-01T11:40:00.000Z",
  },
];

export const LIMITS: Limit[] = LIMIT_ROWS.map((row) => ({
  ...row,
  periodStart: row.period === "quarter" ? QUARTER_START : MONTH_START,
  periodEnd: row.period === "quarter" ? QUARTER_END : MONTH_END,
  updatedBy: ADMIN,
  isActive: true,
}));

/**
 * Нормы расхода по отдельным позициям — ограничение «по количеству» поверх
 * суммового лимита категории. Заданы для позиций, по которым в аналитике
 * ходимости виден перерасход.
 */
export const PRODUCT_QUOTAS: ProductQuota[] = [
  {
    id: "qta-drill-sdsmax",
    workshopId: "wsh-krg-drill",
    productId: "prd-tls-013", // Бур SDS-max 18×600 мм
    period: "month",
    quantityLimit: 12,
    quantityUsed: 11,
  },
  {
    id: "qta-drill-sdsplus",
    workshopId: "wsh-krg-drill",
    productId: "prd-tls-014", // Сверло по бетону SDS-plus 12×160 мм
    period: "month",
    quantityLimit: 40,
    quantityUsed: 16,
  },
  {
    id: "qta-drill-crown",
    workshopId: "wsh-krg-drill",
    productId: "prd-tls-016", // Коронка алмазная 68 мм
    period: "month",
    quantityLimit: 4,
    /** Норма исчерпана: аномальный рост потребления. */
    quantityUsed: 4,
  },
  {
    id: "qta-rem-hss",
    workshopId: "wsh-blh-rem",
    productId: "prd-tls-018", // Сверло по металлу HSS-Co 10 мм
    period: "month",
    quantityLimit: 15,
    quantityUsed: 19,
  },
  {
    id: "qta-rem-saw",
    workshopId: "wsh-blh-rem",
    productId: "prd-tls-015", // Полотно для сабельной пилы
    period: "month",
    quantityLimit: 20,
    quantityUsed: 8,
  },
  {
    id: "qta-chu-cd355",
    workshopId: "wsh-chu-fab",
    productId: "prd-tls-017", // Пильный диск по металлу 355 мм
    period: "month",
    quantityLimit: 10,
    quantityUsed: 9,
  },
];

export function limitById(id: string): Limit | undefined {
  return LIMITS.find((l) => l.id === id);
}

/** Лимит цеха по категории закупа. */
export function limitOf(
  workshopId: string,
  purchaseCategoryId: string
): Limit | undefined {
  return LIMITS.find(
    (l) => l.workshopId === workshopId && l.categoryId === purchaseCategoryId
  );
}

/** Доля использования лимита, % (может быть больше 100). */
export function limitUsedPercent(limit: Limit): number {
  return limit.amountLimit > 0
    ? Math.round((limit.amountUsed / limit.amountLimit) * 100)
    : 0;
}

/** Лимиты, исчерпанные более чем на 80% — для дашбордов и админки. */
export const LIMITS_AT_RISK = LIMITS.filter(
  (l) => limitUsedPercent(l) >= 80
);

/** Лимиты с превышением — крайний случай. */
export const LIMITS_EXCEEDED = LIMITS.filter((l) => limitUsedPercent(l) > 100);
