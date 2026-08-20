import { rootCategoryId } from "@/mocks/categories";
import { supplierOfCategory } from "@/mocks/suppliers";
import { WAREHOUSES } from "@/mocks/regions";
import type { Product, StockBalance, UnitOfMeasure } from "@/types";

/**
 * Номенклатура каталога. Формируется из ассортимента поставщика категории
 * («один поставщик на категорию»), поэтому supplierId не задаётся вручную,
 * а выводится от категории закупа — так данные не могут разойтись с моделью.
 *
 * Цены — по рамочному договору, в тенге без НДС (ставка 12%).
 * Остатки — свободный остаток на РЕСХ; в проде обновляются из D365 F&O
 * по OData каждые 15 минут.
 *
 * serviceLifeDays (нормативный срок службы) заполнен для инструмента —
 * на нём строится аналитика ходимости (см. tool-usage-history.ts).
 */

/** Момент последней синхронизации остатков с D365 F&O. */
const STOCK_SYNCED_AT = "2026-08-20T04:15:00.000Z";

const WAREHOUSE_REGION: Record<string, string> = WAREHOUSES.reduce(
  (acc, w) => ({ ...acc, [w.id]: w.regionId }),
  {} as Record<string, string>
);

/** [склад, свободный остаток, резерв под согласованные заказы]. */
type StockRow = [warehouseId: string, quantity: number, reserved?: number];

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  erpItemId: string;
  /** Подгруппа каталога; категория закупа выводится через rootCategoryId. */
  categoryId: string;
  unit: UnitOfMeasure;
  price: number;
  stock: StockRow[];
  serviceLifeDays?: number;
  description?: string;
  isArchived?: boolean;
}

function toStock(rows: StockRow[]): StockBalance[] {
  return rows.map(([warehouseId, quantity, reserved]) => ({
    warehouseId,
    regionId: WAREHOUSE_REGION[warehouseId],
    quantity,
    ...(reserved === undefined ? {} : { reserved }),
    updatedAt: STOCK_SYNCED_AT,
  }));
}

function buildProduct(row: ProductRow): Product {
  const purchaseCategoryId = rootCategoryId(row.categoryId);
  const supplier = supplierOfCategory(purchaseCategoryId);
  if (!supplier) {
    throw new Error(
      `Нет поставщика для категории закупа ${purchaseCategoryId} (позиция ${row.id})`
    );
  }
  const [primaryWarehouseId] = row.stock[0];
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    erpItemId: row.erpItemId,
    categoryId: row.categoryId,
    supplierId: supplier.id,
    unit: row.unit,
    price: row.price,
    vatRate: 12,
    stock: toStock(row.stock),
    primaryWarehouseId,
    primaryRegionId: WAREHOUSE_REGION[primaryWarehouseId],
    ...(row.serviceLifeDays === undefined
      ? {}
      : { serviceLifeDays: row.serviceLifeDays }),
    ...(row.description === undefined ? {} : { description: row.description }),
    ...(row.isArchived === undefined ? {} : { isArchived: row.isArchived }),
  };
}

const PRODUCT_ROWS: ProductRow[] = [
  // ——————————————————— Канцелярия (ТОО «Канц-Маркет Казахстан») ———————————————————
  {
    id: "prd-off-001",
    name: "Бумага офисная A4 80 г/м², пачка 500 л",
    sku: "KM-PAP-A4-80",
    erpItemId: "NOM-100241",
    categoryId: "cat-office-paper",
    unit: "пач",
    price: 2350,
    stock: [
      ["wh-krg", 1840, 120],
      ["wh-blh", 620],
      ["wh-zhz", 410],
    ],
    description: "Класс C, белизна 146% CIE. Для офисной печати и копирования.",
  },
  {
    id: "prd-off-002",
    name: "Бумага офисная A3 80 г/м², пачка 500 л",
    sku: "KM-PAP-A3-80",
    erpItemId: "NOM-100242",
    categoryId: "cat-office-paper",
    unit: "пач",
    price: 4890,
    stock: [
      ["wh-krg", 260],
      ["wh-blh", 85],
    ],
  },
  {
    id: "prd-off-003",
    name: "Бумага для плоттера, рулон 610 мм × 50 м, 80 г/м²",
    sku: "KM-PAP-ROLL-610",
    erpItemId: "NOM-100248",
    categoryId: "cat-office-paper",
    unit: "рул",
    price: 7450,
    stock: [["wh-krg", 42]],
    description: "Для печати маркшейдерских планов и схем.",
  },
  {
    id: "prd-off-004",
    name: "Ручка шариковая синяя 0,7 мм",
    sku: "KM-PEN-BL-07",
    erpItemId: "NOM-100310",
    categoryId: "cat-office-write",
    unit: "шт",
    price: 95,
    stock: [
      ["wh-krg", 6200, 350],
      ["wh-blh", 2100],
      ["wh-zhz", 1450],
      ["wh-chu", 700],
    ],
  },
  {
    id: "prd-off-005",
    name: "Карандаш чернографитный HB с ластиком",
    sku: "KM-PNC-HB",
    erpItemId: "NOM-100312",
    categoryId: "cat-office-write",
    unit: "шт",
    price: 70,
    stock: [
      ["wh-krg", 4300],
      ["wh-blh", 1200],
    ],
  },
  {
    id: "prd-off-006",
    name: "Маркер перманентный чёрный, круглый наконечник 2 мм",
    sku: "KM-MRK-PRM-BK",
    erpItemId: "NOM-100318",
    categoryId: "cat-office-write",
    unit: "шт",
    price: 320,
    stock: [
      ["wh-krg", 980],
      ["wh-blh", 340],
    ],
  },
  {
    id: "prd-off-007",
    name: "Текстовыделитель жёлтый, скошенный наконечник",
    sku: "KM-MRK-HL-YL",
    erpItemId: "NOM-100319",
    categoryId: "cat-office-write",
    unit: "шт",
    price: 280,
    stock: [["wh-krg", 760]],
  },
  {
    id: "prd-off-008",
    name: "Картридж лазерный HP CF259A (59A), 3000 стр.",
    sku: "KM-TNR-CF259A",
    erpItemId: "NOM-100405",
    categoryId: "cat-office-print",
    unit: "шт",
    price: 46800,
    stock: [
      ["wh-krg", 74, 12],
      ["wh-blh", 22],
    ],
    description: "Оригинальный картридж для HP LaserJet Pro M404/M428.",
  },
  {
    id: "prd-off-009",
    name: "Картридж лазерный Canon 052, 3100 стр.",
    sku: "KM-TNR-CNN052",
    erpItemId: "NOM-100407",
    categoryId: "cat-office-print",
    unit: "шт",
    price: 32400,
    stock: [
      ["wh-krg", 51],
      ["wh-zhz", 18],
    ],
  },
  {
    id: "prd-off-010",
    name: "Папка-регистратор A4, 75 мм, ламинированный картон",
    sku: "KM-FLD-REG-75",
    erpItemId: "NOM-100501",
    categoryId: "cat-office-archive",
    unit: "шт",
    price: 1250,
    stock: [
      ["wh-krg", 1320, 60],
      ["wh-blh", 480],
      ["wh-zhz", 310],
    ],
  },
  {
    id: "prd-off-011",
    name: "Файл-вкладыш A4 40 мкм, упаковка 100 шт",
    sku: "KM-FLD-SLV-100",
    erpItemId: "NOM-100504",
    categoryId: "cat-office-archive",
    unit: "упак",
    price: 2100,
    stock: [
      ["wh-krg", 640],
      ["wh-blh", 190],
    ],
  },
  {
    id: "prd-off-012",
    name: "Скобы для степлера №24/6, упаковка 1000 шт",
    sku: "KM-STP-24-6",
    erpItemId: "NOM-100520",
    categoryId: "cat-office-write",
    unit: "упак",
    price: 320,
    stock: [
      ["wh-krg", 1450],
      ["wh-blh", 520],
    ],
  },
  {
    id: "prd-off-013",
    name: "Степлер металлический №24/6, до 25 листов",
    sku: "KM-STP-MET-25",
    erpItemId: "NOM-100521",
    categoryId: "cat-office-write",
    unit: "шт",
    price: 1450,
    stock: [["wh-krg", 210]],
  },
  {
    id: "prd-off-014",
    name: "Клейкая лента упаковочная 48 мм × 66 м",
    sku: "KM-TPE-48-66",
    erpItemId: "NOM-100530",
    categoryId: "cat-office-archive",
    unit: "рул",
    price: 690,
    stock: [
      ["wh-krg", 880],
      ["wh-blh", 260],
      ["wh-chu", 120],
    ],
  },

  // ——————————————————— Хозтовары (ТОО «Тазалык Сервис») ———————————————————
  {
    id: "prd-hhd-001",
    name: "Средство для мытья посуды концентрат, канистра 5 л",
    sku: "TZ-DSH-5L",
    erpItemId: "NOM-200104",
    categoryId: "cat-household-wash",
    unit: "шт",
    price: 3200,
    stock: [
      ["wh-krg", 320],
      ["wh-blh", 180],
      ["wh-zhz", 140],
    ],
  },
  {
    id: "prd-hhd-002",
    name: "Средство для чистки сантехники, 1 л",
    sku: "TZ-SAN-1L",
    erpItemId: "NOM-200108",
    categoryId: "cat-household-wash",
    unit: "шт",
    price: 980,
    stock: [
      ["wh-krg", 540],
      ["wh-blh", 220],
    ],
  },
  {
    id: "prd-hhd-003",
    name: "Дезинфицирующее средство хлорсодержащее, канистра 5 л",
    sku: "TZ-DIS-5L",
    erpItemId: "NOM-200112",
    categoryId: "cat-household-wash",
    unit: "шт",
    price: 4350,
    stock: [
      ["wh-krg", 210, 24],
      ["wh-blh", 95],
      ["wh-chu", 60],
    ],
  },
  {
    id: "prd-hhd-004",
    name: "Мыло жидкое антибактериальное, канистра 5 л",
    sku: "TZ-SOAP-5L",
    erpItemId: "NOM-200120",
    categoryId: "cat-household-wash",
    unit: "шт",
    price: 3750,
    stock: [
      ["wh-krg", 260],
      ["wh-zhz", 110],
    ],
  },
  {
    id: "prd-hhd-005",
    name: "Мешки для мусора 120 л, 30 мкм, упаковка 10 шт",
    sku: "TZ-BAG-120",
    erpItemId: "NOM-200205",
    categoryId: "cat-household-clean",
    unit: "упак",
    price: 850,
    stock: [
      ["wh-krg", 1240],
      ["wh-blh", 610],
      ["wh-zhz", 380],
      ["wh-chu", 220],
    ],
  },
  {
    id: "prd-hhd-006",
    name: "Швабра с телескопической ручкой и насадкой МОП",
    sku: "TZ-MOP-TEL",
    erpItemId: "NOM-200210",
    categoryId: "cat-household-clean",
    unit: "шт",
    price: 3900,
    stock: [
      ["wh-krg", 145],
      ["wh-blh", 62],
    ],
  },
  {
    id: "prd-hhd-007",
    name: "Ведро пластиковое 12 л с отжимом",
    sku: "TZ-BKT-12",
    erpItemId: "NOM-200212",
    categoryId: "cat-household-clean",
    unit: "шт",
    price: 1700,
    stock: [
      ["wh-krg", 180],
      ["wh-chu", 40],
    ],
  },
  {
    id: "prd-hhd-008",
    name: "Салфетки из микрофибры 30×30 см, упаковка 5 шт",
    sku: "TZ-CLT-MF5",
    erpItemId: "NOM-200215",
    categoryId: "cat-household-clean",
    unit: "упак",
    price: 1240,
    stock: [
      ["wh-krg", 420],
      ["wh-blh", 160],
    ],
  },
  {
    id: "prd-hhd-009",
    name: "Ветошь обтирочная х/б",
    sku: "TZ-RAG-KG",
    erpItemId: "NOM-200220",
    categoryId: "cat-household-clean",
    unit: "кг",
    price: 640,
    stock: [
      ["wh-blh", 1450],
      ["wh-krg", 890],
      ["wh-zhz", 520],
    ],
    description: "Для обтирки узлов и оборудования в ремонтных цехах.",
  },
  {
    id: "prd-hhd-010",
    name: "Бумага туалетная двухслойная, упаковка 8 рулонов",
    sku: "TZ-TPR-8",
    erpItemId: "NOM-200230",
    categoryId: "cat-household-clean",
    unit: "упак",
    price: 1890,
    stock: [
      ["wh-krg", 760],
      ["wh-blh", 340],
      ["wh-zhz", 210],
    ],
  },
  {
    id: "prd-hhd-011",
    name: "Лампа светодиодная E27 15 Вт, 4000K",
    sku: "TZ-LMP-E27-15",
    erpItemId: "NOM-200305",
    categoryId: "cat-household-lamps",
    unit: "шт",
    price: 1250,
    stock: [
      ["wh-krg", 1580, 90],
      ["wh-blh", 720],
      ["wh-zhz", 410],
      ["wh-chu", 260],
    ],
  },
  {
    id: "prd-hhd-012",
    name: "Лампа люминесцентная T8 36 Вт, цоколь G13",
    sku: "TZ-LMP-T8-36",
    erpItemId: "NOM-200308",
    categoryId: "cat-household-lamps",
    unit: "шт",
    price: 1480,
    stock: [
      ["wh-blh", 640],
      ["wh-krg", 390],
    ],
  },

  // ——————————————————— Инструменты (ТОО «Промснаб Инструмент») ———————————————————
  {
    id: "prd-tls-001",
    name: "Дрель ударная Bosch GSB 13 RE, 600 Вт",
    sku: "PS-BSH-GSB13RE",
    erpItemId: "NOM-300101",
    categoryId: "cat-tools-power",
    unit: "шт",
    price: 62900,
    serviceLifeDays: 540,
    stock: [
      ["wh-krg", 34, 4],
      ["wh-blh", 18],
      ["wh-chu", 6],
    ],
  },
  {
    id: "prd-tls-002",
    name: "Перфоратор Makita HR2470, SDS-plus, 780 Вт",
    sku: "PS-MKT-HR2470",
    erpItemId: "NOM-300104",
    categoryId: "cat-tools-power",
    unit: "шт",
    price: 118500,
    serviceLifeDays: 720,
    stock: [
      ["wh-krg", 21],
      ["wh-blh", 12],
    ],
  },
  {
    id: "prd-tls-003",
    name: "УШМ Makita 9558HN, 125 мм, 840 Вт",
    sku: "PS-MKT-9558HN",
    erpItemId: "NOM-300107",
    categoryId: "cat-tools-power",
    unit: "шт",
    price: 44700,
    serviceLifeDays: 365,
    stock: [
      ["wh-blh", 46, 6],
      ["wh-krg", 38],
      ["wh-zhz", 15],
    ],
  },
  {
    id: "prd-tls-004",
    name: "Сабельная пила Bosch GSA 120, 1200 Вт",
    sku: "PS-BSH-GSA120",
    erpItemId: "NOM-300110",
    categoryId: "cat-tools-power",
    unit: "шт",
    price: 71300,
    serviceLifeDays: 540,
    stock: [
      ["wh-blh", 14],
      ["wh-chu", 5],
    ],
  },
  {
    id: "prd-tls-005",
    name: "Гайковёрт пневматический ударный 1/2\", 680 Нм",
    sku: "PS-PNM-IW12",
    erpItemId: "NOM-300201",
    categoryId: "cat-tools-pneumo",
    unit: "шт",
    price: 78000,
    serviceLifeDays: 900,
    stock: [
      ["wh-blh", 17],
      ["wh-zhz", 9],
    ],
  },
  {
    id: "prd-tls-006",
    name: "Молоток отбойный пневматический МО-2Б",
    sku: "PS-PNM-MO2B",
    erpItemId: "NOM-300204",
    categoryId: "cat-tools-pneumo",
    unit: "шт",
    price: 96500,
    serviceLifeDays: 365,
    stock: [
      ["wh-krg", 12],
      ["wh-blh", 8],
    ],
  },
  {
    id: "prd-tls-007",
    name: "Зубило пневматическое (пика) 175 мм",
    sku: "PS-PNM-CHS175",
    erpItemId: "NOM-300210",
    categoryId: "cat-tools-pneumo",
    unit: "шт",
    price: 5600,
    serviceLifeDays: 120,
    stock: [
      ["wh-blh", 240, 30],
      ["wh-krg", 160],
      ["wh-zhz", 85],
    ],
  },
  {
    id: "prd-tls-008",
    name: "Набор ключей рожковых 8–24 мм, 12 предметов",
    sku: "PS-HND-WRS12",
    erpItemId: "NOM-300301",
    categoryId: "cat-tools-hand",
    unit: "набор",
    price: 21400,
    serviceLifeDays: 730,
    stock: [
      ["wh-blh", 62],
      ["wh-krg", 48],
      ["wh-chu", 14],
    ],
  },
  {
    id: "prd-tls-009",
    name: "Ключ разводной 250 мм, губки до 30 мм",
    sku: "PS-HND-ADJ250",
    erpItemId: "NOM-300304",
    categoryId: "cat-tools-hand",
    unit: "шт",
    price: 4850,
    serviceLifeDays: 180,
    stock: [
      ["wh-blh", 185],
      ["wh-krg", 140],
      ["wh-zhz", 70],
    ],
  },
  {
    id: "prd-tls-010",
    name: "Набор отвёрток диэлектрических 1000 В, 7 предметов",
    sku: "PS-HND-SCR7VDE",
    erpItemId: "NOM-300308",
    categoryId: "cat-tools-hand",
    unit: "набор",
    price: 9700,
    serviceLifeDays: 365,
    stock: [
      ["wh-krg", 96],
      ["wh-blh", 54],
    ],
  },
  {
    id: "prd-tls-011",
    name: "Пассатижи диэлектрические VDE 180 мм",
    sku: "PS-HND-PLR180",
    erpItemId: "NOM-300311",
    categoryId: "cat-tools-hand",
    unit: "шт",
    price: 6400,
    serviceLifeDays: 270,
    stock: [
      ["wh-krg", 130],
      ["wh-blh", 88],
    ],
  },
  {
    id: "prd-tls-012",
    name: "Молоток слесарный 800 г, фиберглассовая рукоять",
    sku: "PS-HND-HMR800",
    erpItemId: "NOM-300314",
    categoryId: "cat-tools-hand",
    unit: "шт",
    price: 3100,
    serviceLifeDays: 365,
    stock: [
      ["wh-blh", 210],
      ["wh-krg", 175],
      ["wh-chu", 45],
    ],
  },
  {
    id: "prd-tls-013",
    name: "Бур SDS-max 18×600 мм",
    sku: "PS-CNS-SDSMX18",
    erpItemId: "NOM-300401",
    categoryId: "cat-tools-consumables",
    unit: "шт",
    price: 6900,
    serviceLifeDays: 90,
    stock: [
      ["wh-krg", 320, 40],
      ["wh-blh", 145],
    ],
  },
  {
    id: "prd-tls-014",
    name: "Сверло по бетону SDS-plus 12×160 мм",
    sku: "PS-CNS-SDSPL12",
    erpItemId: "NOM-300404",
    categoryId: "cat-tools-consumables",
    unit: "шт",
    price: 1450,
    serviceLifeDays: 45,
    stock: [
      ["wh-krg", 640, 80],
      ["wh-blh", 280],
      ["wh-chu", 95],
    ],
  },
  {
    id: "prd-tls-015",
    name: "Полотно для сабельной пилы по металлу, 5 шт",
    sku: "PS-CNS-SAW5",
    erpItemId: "NOM-300407",
    categoryId: "cat-tools-consumables",
    unit: "упак",
    price: 4200,
    serviceLifeDays: 60,
    stock: [
      ["wh-blh", 230],
      ["wh-chu", 78],
    ],
  },
  {
    id: "prd-tls-016",
    name: "Коронка алмазная 68 мм по бетону",
    sku: "PS-CNS-DMC68",
    erpItemId: "NOM-300410",
    categoryId: "cat-tools-consumables",
    unit: "шт",
    price: 27500,
    serviceLifeDays: 150,
    stock: [
      ["wh-krg", 44, 8],
      ["wh-blh", 26],
    ],
  },
  {
    id: "prd-tls-017",
    name: "Пильный диск по металлу 355×3,0 мм",
    sku: "PS-CNS-CD355",
    erpItemId: "NOM-300413",
    categoryId: "cat-tools-consumables",
    unit: "шт",
    price: 8900,
    serviceLifeDays: 75,
    stock: [
      ["wh-chu", 120],
      ["wh-blh", 86],
      ["wh-krg", 64],
    ],
  },
  {
    id: "prd-tls-018",
    name: "Сверло по металлу HSS-Co 10 мм, упаковка 10 шт",
    sku: "PS-CNS-HSS10",
    erpItemId: "NOM-300416",
    categoryId: "cat-tools-consumables",
    unit: "упак",
    price: 6300,
    serviceLifeDays: 30,
    stock: [
      ["wh-blh", 310, 45],
      ["wh-krg", 190],
      ["wh-zhz", 120],
    ],
  },

  // ——————————————— Прочие (ТОО «Казахстан Индастриал Групп») ———————————————
  {
    id: "prd-oth-001",
    name: "Перчатки х/б с ПВХ-точками, пара",
    sku: "KIG-PPE-GLV-PVC",
    erpItemId: "NOM-400101",
    categoryId: "cat-other-ppe",
    unit: "пара",
    price: 320,
    stock: [
      ["wh-krg", 8600, 600],
      ["wh-blh", 4200],
      ["wh-zhz", 2400],
      ["wh-chu", 1350],
    ],
  },
  {
    id: "prd-oth-002",
    name: "Каска защитная с храповиком, белая",
    sku: "KIG-PPE-HLM-W",
    erpItemId: "NOM-400104",
    categoryId: "cat-other-ppe",
    unit: "шт",
    price: 3950,
    stock: [
      ["wh-krg", 420],
      ["wh-blh", 260],
      ["wh-chu", 90],
    ],
  },
  {
    id: "prd-oth-003",
    name: "Очки защитные открытые, поликарбонат",
    sku: "KIG-PPE-GLS-OP",
    erpItemId: "NOM-400107",
    categoryId: "cat-other-ppe",
    unit: "шт",
    price: 1850,
    stock: [
      ["wh-krg", 680],
      ["wh-blh", 390],
    ],
  },
  {
    id: "prd-oth-004",
    name: "Респиратор 3M 8102 FFP2, упаковка 20 шт",
    sku: "KIG-PPE-RSP-3M20",
    erpItemId: "NOM-400110",
    categoryId: "cat-other-ppe",
    unit: "упак",
    price: 12400,
    stock: [
      ["wh-krg", 165, 20],
      ["wh-blh", 92],
      ["wh-zhz", 48],
    ],
  },
  {
    id: "prd-oth-005",
    name: "Костюм сварщика брезентовый с крагами",
    sku: "KIG-PPE-WLD-SET",
    erpItemId: "NOM-400115",
    categoryId: "cat-other-ppe",
    unit: "компл",
    price: 28900,
    stock: [
      ["wh-blh", 74],
      ["wh-krg", 52],
    ],
  },
  {
    id: "prd-oth-006",
    name: "Сапоги резиновые с металлическим подноском",
    sku: "KIG-PPE-BOOT-MT",
    erpItemId: "NOM-400118",
    categoryId: "cat-other-ppe",
    unit: "пара",
    price: 9400,
    stock: [
      ["wh-chu", 120],
      ["wh-blh", 96],
      ["wh-krg", 84],
    ],
  },
  {
    id: "prd-oth-007",
    name: "Наушники противошумные, SNR 31 дБ",
    sku: "KIG-PPE-EAR-31",
    erpItemId: "NOM-400121",
    categoryId: "cat-other-ppe",
    unit: "шт",
    price: 4300,
    stock: [
      ["wh-blh", 210],
      ["wh-krg", 140],
    ],
  },
  {
    id: "prd-oth-008",
    name: "Пояс предохранительный лямочный, 2 стропа",
    sku: "KIG-PPE-HRN-2",
    erpItemId: "NOM-400124",
    categoryId: "cat-other-ppe",
    unit: "шт",
    price: 18700,
    stock: [
      ["wh-krg", 68],
      ["wh-zhz", 34],
    ],
  },
  {
    id: "prd-oth-009",
    name: "Штангенциркуль 150 мм, цена деления 0,05 мм",
    sku: "KIG-MSR-CLP150",
    erpItemId: "NOM-400201",
    categoryId: "cat-other-measure",
    unit: "шт",
    price: 12500,
    stock: [
      ["wh-blh", 58],
      ["wh-krg", 41],
    ],
  },
  {
    id: "prd-oth-010",
    name: "Рулетка измерительная 5 м, обрезиненный корпус",
    sku: "KIG-MSR-TAP5",
    erpItemId: "NOM-400204",
    categoryId: "cat-other-measure",
    unit: "шт",
    price: 1950,
    stock: [
      ["wh-krg", 320],
      ["wh-blh", 210],
      ["wh-chu", 65],
    ],
  },
  {
    id: "prd-oth-011",
    name: "Уровень строительный 800 мм, 3 глазка",
    sku: "KIG-MSR-LVL800",
    erpItemId: "NOM-400207",
    categoryId: "cat-other-measure",
    unit: "шт",
    price: 6700,
    stock: [
      ["wh-krg", 96],
      ["wh-blh", 54],
    ],
  },
  {
    id: "prd-oth-012",
    name: "Мультиметр цифровой True RMS, CAT III 600 В",
    sku: "KIG-MSR-DMM-TR",
    erpItemId: "NOM-400210",
    categoryId: "cat-other-measure",
    unit: "шт",
    price: 24900,
    stock: [
      ["wh-krg", 37],
      ["wh-blh", 22],
      ["wh-zhz", 11],
    ],
  },
  {
    id: "prd-oth-013",
    name: "Диск отрезной по металлу 125×1,6×22,2 мм",
    sku: "KIG-ABR-CD125",
    erpItemId: "NOM-400301",
    categoryId: "cat-other-abrasive",
    unit: "шт",
    price: 420,
    stock: [
      ["wh-blh", 4800, 400],
      ["wh-krg", 3200],
      ["wh-zhz", 1600],
      ["wh-chu", 950],
    ],
  },
  {
    id: "prd-oth-014",
    name: "Круг зачистной 180×6×22,2 мм",
    sku: "KIG-ABR-GD180",
    erpItemId: "NOM-400304",
    categoryId: "cat-other-abrasive",
    unit: "шт",
    price: 890,
    stock: [
      ["wh-blh", 1450],
      ["wh-krg", 980],
      ["wh-chu", 340],
    ],
  },
];

export const PRODUCTS: Product[] = PRODUCT_ROWS.map(buildProduct);

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Позиции категории закупа со всеми подгруппами. */
export function productsOfPurchaseCategory(purchaseCategoryId: string): Product[] {
  return PRODUCTS.filter(
    (p) => rootCategoryId(p.categoryId) === purchaseCategoryId
  );
}

/** Свободный остаток позиции на конкретном РЕСХ. */
export function stockAt(productId: string, warehouseId: string): number {
  return (
    productById(productId)?.stock.find((s) => s.warehouseId === warehouseId)
      ?.quantity ?? 0
  );
}
