import type { ProductOffer } from "@/types";

import { rootCategoryId } from "@/mocks/categories";
import { warehouseById } from "@/mocks/regions";
import { supplierOfCategory } from "@/mocks/suppliers";
import { PRODUCTS } from "@/mocks/products";

/**
 * Предложения продавцов по позициям каталога: у кого есть, почём и когда
 * привезёт. Первое предложение каждой позиции — договорное (поставщик
 * категории по рамочному договору), остальные — внешние маркетплейсы ТД
 * (Garwin / Lamed / TSSP).
 *
 * Название договорного продавца не хранится в строке, а подставляется из
 * mocks/suppliers.ts: модель «один поставщик на категорию» не может
 * разойтись с данными, даже если поставщика категории поменяют.
 *
 * ФАЙЛ СГЕНЕРИРОВАН: scripts/generate-catalog.mjs.
 */

/**
 * Строка данных: всё, что выводится (идентификатор, продавец по договору,
 * подпись способа поставки), в ней не хранится.
 */
interface OfferRow {
  productId: string;
  /** Внешний продавец; пусто — предложение по рамочному договору. */
  sellerName?: string;
  price: number;
  availableQuantity: number;
  deliveryDays: number;
  /** Индекс в DELIVERY_MODES; у договорного предложения отсутствует. */
  deliveryMode?: number;
  deliveryCost: number;
  rating: number;
  reviews: number;
}

/** Способы поставки внешних продавцов. */
const DELIVERY_MODES = [
  "Доставка до предприятия",
  "Самовывоз со склада продавца",
  "Доставка транспортом продавца",
];

const OFFER_ROWS: OfferRow[] = [
  {
    productId: "prd-hozyaystvennye-ofisnye-001",
    price: 2950,
    availableQuantity: 660,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 82
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-001",
    sellerName: "Lamed",
    price: 2920,
    availableQuantity: 238,
    deliveryDays: 8,
    deliveryMode: 1,
    deliveryCost: 1900,
    rating: 4.9,
    reviews: 155
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-002",
    price: 3300,
    availableQuantity: 410,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 57
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-002",
    sellerName: "Garwin",
    price: 3170,
    availableQuantity: 240,
    deliveryDays: 5,
    deliveryMode: 2,
    deliveryCost: 1800,
    rating: 5,
    reviews: 358
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-002",
    sellerName: "Lamed",
    price: 3630,
    availableQuantity: 138,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 183
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-002",
    sellerName: "TSSP",
    price: 3400,
    availableQuantity: 45,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 3100,
    rating: 4.8,
    reviews: 330
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-003",
    price: 3700,
    availableQuantity: 700,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 32
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-003",
    sellerName: "Lamed",
    price: 3850,
    availableQuantity: 83,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 4000,
    rating: 4.9,
    reviews: 252
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-003",
    sellerName: "TSSP",
    price: 3890,
    availableQuantity: 135,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 1300,
    rating: 4.9,
    reviews: 236
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-004",
    price: 440,
    availableQuantity: 6050,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 5,
    reviews: 176
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-004",
    sellerName: "TSSP",
    price: 450,
    availableQuantity: 54,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 3300,
    rating: 4.8,
    reviews: 366
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-004",
    sellerName: "Garwin",
    price: 440,
    availableQuantity: 92,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 1100,
    rating: 4.8,
    reviews: 138
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-004",
    sellerName: "Lamed",
    price: 450,
    availableQuantity: 230,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 4500,
    rating: 4.8,
    reviews: 65
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-005",
    price: 1210,
    availableQuantity: 380,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 151
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-005",
    sellerName: "TSSP",
    price: 1160,
    availableQuantity: 137,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 4000,
    rating: 4.7,
    reviews: 216
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-005",
    sellerName: "Garwin",
    price: 1210,
    availableQuantity: 80,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 3300,
    rating: 4.9,
    reviews: 383
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-006",
    price: 1190,
    availableQuantity: 1280,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 126
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-006",
    sellerName: "Lamed",
    price: 1140,
    availableQuantity: 172,
    deliveryDays: 9,
    deliveryMode: 1,
    deliveryCost: 3600,
    rating: 4.6,
    reviews: 166
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-007",
    price: 310,
    availableQuantity: 900,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 101
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-007",
    sellerName: "Garwin",
    price: 340,
    availableQuantity: 229,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 1300,
    rating: 4.7,
    reviews: 166
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-007",
    sellerName: "Lamed",
    price: 290,
    availableQuantity: 131,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 239
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-007",
    sellerName: "TSSP",
    price: 330,
    availableQuantity: 145,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 4500,
    rating: 4.9,
    reviews: 366
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-008",
    price: 155,
    availableQuantity: 600,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 5,
    reviews: 55
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-008",
    sellerName: "Garwin",
    price: 170,
    availableQuantity: 160,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 3700,
    rating: 4.8,
    reviews: 254
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-008",
    sellerName: "Lamed",
    price: 150,
    availableQuantity: 226,
    deliveryDays: 5,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 233
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-008",
    sellerName: "TSSP",
    price: 170,
    availableQuantity: 169,
    deliveryDays: 1,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 223
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-009",
    price: 135,
    availableQuantity: 5850,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 80
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-009",
    sellerName: "TSSP",
    price: 130,
    availableQuantity: 182,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 900,
    rating: 4.7,
    reviews: 110
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-009",
    sellerName: "Garwin",
    price: 150,
    availableQuantity: 147,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 1500,
    rating: 4.9,
    reviews: 69
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-010",
    price: 1100,
    availableQuantity: 410,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 104
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-010",
    sellerName: "Garwin",
    price: 1090,
    availableQuantity: 60,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 1600,
    rating: 4.7,
    reviews: 315
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-010",
    sellerName: "Lamed",
    price: 1130,
    availableQuantity: 146,
    deliveryDays: 8,
    deliveryMode: 1,
    deliveryCost: 4200,
    rating: 4.9,
    reviews: 117
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-011",
    price: 3300,
    availableQuantity: 1050,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 5,
    reviews: 79
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-011",
    sellerName: "TSSP",
    price: 3600,
    availableQuantity: 7,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 4000,
    rating: 5,
    reviews: 303
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-011",
    sellerName: "Garwin",
    price: 3660,
    availableQuantity: 157,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 900,
    rating: 5,
    reviews: 66
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-011",
    sellerName: "Lamed",
    price: 3170,
    availableQuantity: 115,
    deliveryDays: 7,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 236
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-012",
    price: 1900,
    availableQuantity: 280,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 54
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-012",
    sellerName: "Garwin",
    price: 1900,
    availableQuantity: 132,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 193
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-012",
    sellerName: "Lamed",
    price: 1900,
    availableQuantity: 179,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 3000,
    rating: 4.7,
    reviews: 257
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-013",
    price: 1750,
    availableQuantity: 940,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 29
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-013",
    sellerName: "Lamed",
    price: 1650,
    availableQuantity: 28,
    deliveryDays: 9,
    deliveryMode: 2,
    deliveryCost: 3300,
    rating: 4.8,
    reviews: 61
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-014",
    price: 2450,
    availableQuantity: 350,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 35
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-014",
    sellerName: "TSSP",
    price: 2350,
    availableQuantity: 95,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 1700,
    rating: 4.9,
    reviews: 334
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-014",
    sellerName: "Garwin",
    price: 2350,
    availableQuantity: 136,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 131
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-014",
    sellerName: "Lamed",
    price: 2600,
    availableQuantity: 149,
    deliveryDays: 8,
    deliveryMode: 0,
    deliveryCost: 3400,
    rating: 4.9,
    reviews: 187
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-015",
    price: 3950,
    availableQuantity: 870,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 179
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-015",
    sellerName: "TSSP",
    price: 3950,
    availableQuantity: 139,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 3600,
    rating: 4.8,
    reviews: 348
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-015",
    sellerName: "Garwin",
    price: 4310,
    availableQuantity: 214,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 3100,
    rating: 4.8,
    reviews: 228
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-015",
    sellerName: "Lamed",
    price: 4270,
    availableQuantity: 73,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 3200,
    rating: 4.6,
    reviews: 182
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-016",
    price: 8300,
    availableQuantity: 1290,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 154
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-016",
    sellerName: "Garwin",
    price: 7970,
    availableQuantity: 186,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 334
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-016",
    sellerName: "Lamed",
    price: 7800,
    availableQuantity: 70,
    deliveryDays: 8,
    deliveryMode: 1,
    deliveryCost: 3200,
    rating: 4.7,
    reviews: 195
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-017",
    price: 6000,
    availableQuantity: 330,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 5,
    reviews: 129
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-017",
    sellerName: "TSSP",
    price: 6300,
    availableQuantity: 96,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 2200,
    rating: 4.8,
    reviews: 177
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-017",
    sellerName: "Garwin",
    price: 6780,
    availableQuantity: 3,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 2600,
    rating: 4.8,
    reviews: 341
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-017",
    sellerName: "Lamed",
    price: 6480,
    availableQuantity: 19,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 177
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-018",
    price: 9200,
    availableQuantity: 1270,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 73
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-018",
    sellerName: "TSSP",
    price: 10490,
    availableQuantity: 215,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 2600,
    rating: 4.9,
    reviews: 265
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-018",
    sellerName: "Garwin",
    price: 9110,
    availableQuantity: 14,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 405
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-019",
    price: 32500,
    availableQuantity: 86,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 48
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-019",
    sellerName: "Garwin",
    price: 31530,
    availableQuantity: 65,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 1200,
    rating: 4.8,
    reviews: 419
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-019",
    sellerName: "Lamed",
    price: 30880,
    availableQuantity: 167,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 252
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-019",
    sellerName: "TSSP",
    price: 33150,
    availableQuantity: 45,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 1800,
    rating: 5,
    reviews: 387
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-020",
    price: 915000,
    availableQuantity: 2,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 5,
    reviews: 20
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-020",
    sellerName: "Garwin",
    price: 869250,
    availableQuantity: 224,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 1500,
    rating: 4.8,
    reviews: 180
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-021",
    price: 261000,
    availableQuantity: 12,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 45
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-021",
    sellerName: "TSSP",
    price: 268830,
    availableQuantity: 163,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 3500,
    rating: 4.9,
    reviews: 112
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-021",
    sellerName: "Garwin",
    price: 289710,
    availableQuantity: 185,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 1600,
    rating: 4.7,
    reviews: 85
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-022",
    price: 292000,
    availableQuantity: 22,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 139
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-022",
    sellerName: "Lamed",
    price: 321200,
    availableQuantity: 231,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 2600,
    rating: 4.8,
    reviews: 211
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-022",
    sellerName: "TSSP",
    price: 318280,
    availableQuantity: 33,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 1700,
    rating: 5,
    reviews: 411
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-023",
    price: 462000,
    availableQuantity: 21,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 164
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-023",
    sellerName: "TSSP",
    price: 494340,
    availableQuantity: 232,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 1400,
    rating: 4.7,
    reviews: 389
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-023",
    sellerName: "Garwin",
    price: 480480,
    availableQuantity: 94,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 1200,
    rating: 4.9,
    reviews: 63
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-023",
    sellerName: "Lamed",
    price: 489720,
    availableQuantity: 89,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 2600,
    rating: 4.7,
    reviews: 219
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-024",
    price: 251000,
    availableQuantity: 24,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 5,
    reviews: 89
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-024",
    sellerName: "Lamed",
    price: 273590,
    availableQuantity: 57,
    deliveryDays: 7,
    deliveryMode: 2,
    deliveryCost: 4500,
    rating: 4.6,
    reviews: 144
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-024",
    sellerName: "TSSP",
    price: 253510,
    availableQuantity: 174,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 2800,
    rating: 5,
    reviews: 214
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-024",
    sellerName: "Garwin",
    price: 256020,
    availableQuantity: 214,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 1200,
    rating: 5,
    reviews: 77
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-025",
    price: 466000,
    availableQuantity: 5,
    deliveryDays: 7,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 114
  },
  {
    productId: "prd-hozyaystvennye-ofisnye-025",
    sellerName: "TSSP",
    price: 466000,
    availableQuantity: 220,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 443
  },
  {
    productId: "prd-specodezhda-i-001",
    price: 52500,
    availableQuantity: 118,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 162
  },
  {
    productId: "prd-specodezhda-i-001",
    sellerName: "Garwin",
    price: 50400,
    availableQuantity: 209,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 2800,
    rating: 4.9,
    reviews: 203
  },
  {
    productId: "prd-specodezhda-i-001",
    sellerName: "Lamed",
    price: 56700,
    availableQuantity: 15,
    deliveryDays: 8,
    deliveryMode: 1,
    deliveryCost: 2200,
    rating: 4.7,
    reviews: 129
  },
  {
    productId: "prd-specodezhda-i-001",
    sellerName: "TSSP",
    price: 59850,
    availableQuantity: 146,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 2100,
    rating: 4.7,
    reviews: 455
  },
  {
    productId: "prd-specodezhda-i-002",
    price: 46000,
    availableQuantity: 68,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 87
  },
  {
    productId: "prd-specodezhda-i-002",
    sellerName: "Garwin",
    price: 45540,
    availableQuantity: 132,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 363
  },
  {
    productId: "prd-specodezhda-i-003",
    price: 31000,
    availableQuantity: 140,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 112
  },
  {
    productId: "prd-specodezhda-i-003",
    sellerName: "TSSP",
    price: 33480,
    availableQuantity: 100,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 3200,
    rating: 4.9,
    reviews: 261
  },
  {
    productId: "prd-specodezhda-i-003",
    sellerName: "Garwin",
    price: 34410,
    availableQuantity: 182,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 273
  },
  {
    productId: "prd-specodezhda-i-004",
    price: 309000,
    availableQuantity: 22,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 5,
    reviews: 68
  },
  {
    productId: "prd-specodezhda-i-004",
    sellerName: "TSSP",
    price: 349170,
    availableQuantity: 94,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 3600,
    rating: 4.8,
    reviews: 365
  },
  {
    productId: "prd-specodezhda-i-004",
    sellerName: "Garwin",
    price: 324450,
    availableQuantity: 121,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 60
  },
  {
    productId: "prd-specodezhda-i-004",
    sellerName: "Lamed",
    price: 305910,
    availableQuantity: 22,
    deliveryDays: 7,
    deliveryMode: 0,
    deliveryCost: 3700,
    rating: 4.8,
    reviews: 74
  },
  {
    productId: "prd-specodezhda-i-005",
    price: 177000,
    availableQuantity: 5,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 93
  },
  {
    productId: "prd-specodezhda-i-005",
    sellerName: "Garwin",
    price: 184080,
    availableQuantity: 222,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 91
  },
  {
    productId: "prd-specodezhda-i-005",
    sellerName: "Lamed",
    price: 182310,
    availableQuantity: 21,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 214
  },
  {
    productId: "prd-specodezhda-i-006",
    price: 304000,
    availableQuantity: 24,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 18
  },
  {
    productId: "prd-specodezhda-i-006",
    sellerName: "Lamed",
    price: 328320,
    availableQuantity: 175,
    deliveryDays: 7,
    deliveryMode: 1,
    deliveryCost: 2900,
    rating: 4.6,
    reviews: 195
  },
  {
    productId: "prd-specodezhda-i-006",
    sellerName: "TSSP",
    price: 337440,
    availableQuantity: 2,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 2700,
    rating: 5,
    reviews: 193
  },
  {
    productId: "prd-specodezhda-i-007",
    price: 39500,
    availableQuantity: 12,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 43
  },
  {
    productId: "prd-specodezhda-i-007",
    sellerName: "Garwin",
    price: 39110,
    availableQuantity: 128,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 1000,
    rating: 4.7,
    reviews: 387
  },
  {
    productId: "prd-specodezhda-i-007",
    sellerName: "Lamed",
    price: 42270,
    availableQuantity: 109,
    deliveryDays: 8,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 122
  },
  {
    productId: "prd-specodezhda-i-007",
    sellerName: "TSSP",
    price: 43850,
    availableQuantity: 71,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 4000,
    rating: 4.9,
    reviews: 496
  },
  {
    productId: "prd-specodezhda-i-008",
    price: 21000,
    availableQuantity: 146,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 5,
    reviews: 168
  },
  {
    productId: "prd-specodezhda-i-008",
    sellerName: "TSSP",
    price: 22470,
    availableQuantity: 214,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 3600,
    rating: 5,
    reviews: 402
  },
  {
    productId: "prd-specodezhda-i-009",
    price: 42000,
    availableQuantity: 148,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 24
  },
  {
    productId: "prd-specodezhda-i-009",
    sellerName: "Garwin",
    price: 42000,
    availableQuantity: 195,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 3500,
    rating: 4.9,
    reviews: 84
  },
  {
    productId: "prd-specodezhda-i-009",
    sellerName: "Lamed",
    price: 40320,
    availableQuantity: 78,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 3100,
    rating: 4.9,
    reviews: 215
  },
  {
    productId: "prd-specodezhda-i-010",
    price: 39500,
    availableQuantity: 82,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 53
  },
  {
    productId: "prd-specodezhda-i-010",
    sellerName: "Garwin",
    price: 44640,
    availableQuantity: 212,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 3600,
    rating: 4.7,
    reviews: 262
  },
  {
    productId: "prd-specodezhda-i-010",
    sellerName: "Lamed",
    price: 38710,
    availableQuantity: 190,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 3100,
    rating: 4.9,
    reviews: 90
  },
  {
    productId: "prd-specodezhda-i-010",
    sellerName: "TSSP",
    price: 45030,
    availableQuantity: 163,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 359
  },
  {
    productId: "prd-specodezhda-i-011",
    price: 41500,
    availableQuantity: 40,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 5,
    reviews: 28
  },
  {
    productId: "prd-specodezhda-i-011",
    sellerName: "TSSP",
    price: 40670,
    availableQuantity: 147,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 4500,
    rating: 4.8,
    reviews: 125
  },
  {
    productId: "prd-specodezhda-i-011",
    sellerName: "Garwin",
    price: 40670,
    availableQuantity: 232,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 405
  },
  {
    productId: "prd-specodezhda-i-011",
    sellerName: "Lamed",
    price: 46070,
    availableQuantity: 143,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 185
  },
  {
    productId: "prd-specodezhda-i-012",
    price: 45500,
    availableQuantity: 20,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 103
  },
  {
    productId: "prd-specodezhda-i-012",
    sellerName: "TSSP",
    price: 47780,
    availableQuantity: 187,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 2200,
    rating: 4.7,
    reviews: 366
  },
  {
    productId: "prd-specodezhda-i-013",
    price: 12000,
    availableQuantity: 138,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 78
  },
  {
    productId: "prd-specodezhda-i-013",
    sellerName: "Lamed",
    price: 13320,
    availableQuantity: 227,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 2900,
    rating: 4.8,
    reviews: 140
  },
  {
    productId: "prd-specodezhda-i-013",
    sellerName: "TSSP",
    price: 11280,
    availableQuantity: 135,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 3600,
    rating: 5,
    reviews: 107
  },
  {
    productId: "prd-specodezhda-i-013",
    sellerName: "Garwin",
    price: 13080,
    availableQuantity: 146,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 230
  },
  {
    productId: "prd-specodezhda-i-014",
    price: 9000,
    availableQuantity: 380,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 122
  },
  {
    productId: "prd-specodezhda-i-014",
    sellerName: "Garwin",
    price: 8460,
    availableQuantity: 190,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 3400,
    rating: 4.7,
    reviews: 153
  },
  {
    productId: "prd-specodezhda-i-014",
    sellerName: "Lamed",
    price: 10170,
    availableQuantity: 201,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 3100,
    rating: 4.7,
    reviews: 179
  },
  {
    productId: "prd-specodezhda-i-015",
    price: 13000,
    availableQuantity: 194,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 5,
    reviews: 97
  },
  {
    productId: "prd-specodezhda-i-015",
    sellerName: "Garwin",
    price: 13000,
    availableQuantity: 50,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 2100,
    rating: 4.8,
    reviews: 340
  },
  {
    productId: "prd-specodezhda-i-015",
    sellerName: "Lamed",
    price: 12480,
    availableQuantity: 204,
    deliveryDays: 9,
    deliveryMode: 0,
    deliveryCost: 1200,
    rating: 4.6,
    reviews: 76
  },
  {
    productId: "prd-specodezhda-i-015",
    sellerName: "TSSP",
    price: 14820,
    availableQuantity: 84,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 5,
    reviews: 529
  },
  {
    productId: "prd-specodezhda-i-016",
    price: 5200,
    availableQuantity: 1370,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 172
  },
  {
    productId: "prd-specodezhda-i-016",
    sellerName: "Garwin",
    price: 5100,
    availableQuantity: 129,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 3500,
    rating: 4.9,
    reviews: 161
  },
  {
    productId: "prd-specodezhda-i-016",
    sellerName: "Lamed",
    price: 4890,
    availableQuantity: 126,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 78
  },
  {
    productId: "prd-specodezhda-i-017",
    price: 6900,
    availableQuantity: 750,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 147
  },
  {
    productId: "prd-specodezhda-i-017",
    sellerName: "Garwin",
    price: 7590,
    availableQuantity: 203,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 1100,
    rating: 4.8,
    reviews: 247
  },
  {
    productId: "prd-specodezhda-i-017",
    sellerName: "Lamed",
    price: 6690,
    availableQuantity: 231,
    deliveryDays: 9,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 159
  },
  {
    productId: "prd-specodezhda-i-017",
    sellerName: "TSSP",
    price: 6490,
    availableQuantity: 95,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 474
  },
  {
    productId: "prd-specodezhda-i-018",
    price: 5000,
    availableQuantity: 870,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 84
  },
  {
    productId: "prd-specodezhda-i-018",
    sellerName: "Garwin",
    price: 5550,
    availableQuantity: 215,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 3600,
    rating: 4.7,
    reviews: 259
  },
  {
    productId: "prd-specodezhda-i-018",
    sellerName: "Lamed",
    price: 4950,
    availableQuantity: 16,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 4200,
    rating: 4.9,
    reviews: 223
  },
  {
    productId: "prd-specodezhda-i-019",
    price: 15500,
    availableQuantity: 172,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 5,
    reviews: 59
  },
  {
    productId: "prd-specodezhda-i-019",
    sellerName: "Garwin",
    price: 15040,
    availableQuantity: 98,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 3200,
    rating: 4.8,
    reviews: 378
  },
  {
    productId: "prd-specodezhda-i-020",
    price: 16500,
    availableQuantity: 98,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 5,
    reviews: 35
  },
  {
    productId: "prd-specodezhda-i-020",
    sellerName: "Garwin",
    price: 16830,
    availableQuantity: 17,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 1900,
    rating: 4.8,
    reviews: 170
  },
  {
    productId: "prd-specodezhda-i-020",
    sellerName: "Lamed",
    price: 18650,
    availableQuantity: 37,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 2000,
    rating: 4.6,
    reviews: 87
  },
  {
    productId: "prd-specodezhda-i-020",
    sellerName: "TSSP",
    price: 17000,
    availableQuantity: 19,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 2300,
    rating: 4.8,
    reviews: 524
  },
  {
    productId: "prd-specodezhda-i-021",
    price: 12000,
    availableQuantity: 108,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 179
  },
  {
    productId: "prd-specodezhda-i-021",
    sellerName: "Garwin",
    price: 11400,
    availableQuantity: 15,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 364
  },
  {
    productId: "prd-specodezhda-i-021",
    sellerName: "Lamed",
    price: 11400,
    availableQuantity: 159,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 226
  },
  {
    productId: "prd-specodezhda-i-022",
    price: 18500,
    availableQuantity: 26,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 154
  },
  {
    productId: "prd-specodezhda-i-022",
    sellerName: "Garwin",
    price: 19610,
    availableQuantity: 96,
    deliveryDays: 5,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 5,
    reviews: 415
  },
  {
    productId: "prd-specodezhda-i-022",
    sellerName: "Lamed",
    price: 21090,
    availableQuantity: 165,
    deliveryDays: 7,
    deliveryMode: 0,
    deliveryCost: 1100,
    rating: 4.8,
    reviews: 235
  },
  {
    productId: "prd-specodezhda-i-022",
    sellerName: "TSSP",
    price: 19980,
    availableQuantity: 41,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 295
  },
  {
    productId: "prd-specodezhda-i-023",
    price: 8750,
    availableQuantity: 1350,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 129
  },
  {
    productId: "prd-specodezhda-i-023",
    sellerName: "Garwin",
    price: 9450,
    availableQuantity: 42,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 413
  },
  {
    productId: "prd-specodezhda-i-024",
    price: 12000,
    availableQuantity: 12,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 5,
    reviews: 135
  },
  {
    productId: "prd-specodezhda-i-024",
    sellerName: "Garwin",
    price: 13200,
    availableQuantity: 26,
    deliveryDays: 5,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 5,
    reviews: 247
  },
  {
    productId: "prd-specodezhda-i-024",
    sellerName: "Lamed",
    price: 11640,
    availableQuantity: 125,
    deliveryDays: 9,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 258
  },
  {
    productId: "prd-specodezhda-i-024",
    sellerName: "TSSP",
    price: 13320,
    availableQuantity: 182,
    deliveryDays: 1,
    deliveryMode: 0,
    deliveryCost: 1300,
    rating: 5,
    reviews: 88
  },
  {
    productId: "prd-specodezhda-i-025",
    price: 20750,
    availableQuantity: 166,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 110
  },
  {
    productId: "prd-specodezhda-i-025",
    sellerName: "Lamed",
    price: 22000,
    availableQuantity: 36,
    deliveryDays: 8,
    deliveryMode: 1,
    deliveryCost: 3100,
    rating: 4.7,
    reviews: 130
  },
  {
    productId: "prd-specodezhda-i-026",
    price: 14750,
    availableQuantity: 108,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 85
  },
  {
    productId: "prd-specodezhda-i-026",
    sellerName: "Garwin",
    price: 14460,
    availableQuantity: 82,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 2300,
    rating: 4.8,
    reviews: 82
  },
  {
    productId: "prd-specodezhda-i-027",
    price: 12250,
    availableQuantity: 12,
    deliveryDays: 12,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 60
  },
  {
    productId: "prd-specodezhda-i-027",
    sellerName: "TSSP",
    price: 13840,
    availableQuantity: 29,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 4300,
    rating: 4.7,
    reviews: 347
  },
  {
    productId: "prd-specodezhda-i-027",
    sellerName: "Garwin",
    price: 11760,
    availableQuantity: 24,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 408
  },
  {
    productId: "prd-specodezhda-i-027",
    sellerName: "Lamed",
    price: 11520,
    availableQuantity: 107,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 87
  },
  {
    productId: "prd-instrumenty-i-001",
    price: 55500,
    availableQuantity: 22,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 163
  },
  {
    productId: "prd-instrumenty-i-001",
    sellerName: "TSSP",
    price: 55500,
    availableQuantity: 223,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 178
  },
  {
    productId: "prd-instrumenty-i-002",
    price: 89000,
    availableQuantity: 76,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 138
  },
  {
    productId: "prd-instrumenty-i-002",
    sellerName: "Garwin",
    price: 94340,
    availableQuantity: 116,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 76
  },
  {
    productId: "prd-instrumenty-i-003",
    price: 22000,
    availableQuantity: 212,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 113
  },
  {
    productId: "prd-instrumenty-i-003",
    sellerName: "Lamed",
    price: 22440,
    availableQuantity: 116,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 1900,
    rating: 4.7,
    reviews: 161
  },
  {
    productId: "prd-instrumenty-i-003",
    sellerName: "TSSP",
    price: 21560,
    availableQuantity: 117,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 1600,
    rating: 4.7,
    reviews: 145
  },
  {
    productId: "prd-instrumenty-i-004",
    price: 265000,
    availableQuantity: 4,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 5,
    reviews: 88
  },
  {
    productId: "prd-instrumenty-i-004",
    sellerName: "Garwin",
    price: 249100,
    availableQuantity: 82,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 136
  },
  {
    productId: "prd-instrumenty-i-005",
    price: 1358000,
    availableQuantity: 16,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 63
  },
  {
    productId: "prd-instrumenty-i-005",
    sellerName: "Lamed",
    price: 1507380,
    availableQuantity: 29,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 4000,
    rating: 4.9,
    reviews: 173
  },
  {
    productId: "prd-instrumenty-i-005",
    sellerName: "TSSP",
    price: 1398740,
    availableQuantity: 202,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 900,
    rating: 4.9,
    reviews: 92
  },
  {
    productId: "prd-instrumenty-i-005",
    sellerName: "Garwin",
    price: 1398740,
    availableQuantity: 216,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 2800,
    rating: 4.7,
    reviews: 380
  },
  {
    productId: "prd-instrumenty-i-006",
    price: 406000,
    availableQuantity: 26,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 38
  },
  {
    productId: "prd-instrumenty-i-006",
    sellerName: "TSSP",
    price: 442540,
    availableQuantity: 96,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 3900,
    rating: 5,
    reviews: 326
  },
  {
    productId: "prd-instrumenty-i-006",
    sellerName: "Garwin",
    price: 442540,
    availableQuantity: 156,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 5,
    reviews: 308
  },
  {
    productId: "prd-instrumenty-i-007",
    price: 15500,
    availableQuantity: 72,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 13
  },
  {
    productId: "prd-instrumenty-i-007",
    sellerName: "TSSP",
    price: 16590,
    availableQuantity: 52,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 3600,
    rating: 4.7,
    reviews: 250
  },
  {
    productId: "prd-instrumenty-i-007",
    sellerName: "Garwin",
    price: 15970,
    availableQuantity: 236,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 3100,
    rating: 4.9,
    reviews: 318
  },
  {
    productId: "prd-instrumenty-i-008",
    price: 21500,
    availableQuantity: 80,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 5,
    reviews: 157
  },
  {
    productId: "prd-instrumenty-i-008",
    sellerName: "Garwin",
    price: 21720,
    availableQuantity: 225,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 1600,
    rating: 4.8,
    reviews: 240
  },
  {
    productId: "prd-instrumenty-i-009",
    price: 33000,
    availableQuantity: 144,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 132
  },
  {
    productId: "prd-instrumenty-i-009",
    sellerName: "Lamed",
    price: 34320,
    availableQuantity: 139,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 213
  },
  {
    productId: "prd-instrumenty-i-009",
    sellerName: "TSSP",
    price: 33330,
    availableQuantity: 63,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 1000,
    rating: 4.9,
    reviews: 238
  },
  {
    productId: "prd-instrumenty-i-010",
    price: 135500,
    availableQuantity: 1,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 103
  },
  {
    productId: "prd-instrumenty-i-010",
    sellerName: "TSSP",
    price: 153120,
    availableQuantity: 46,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 3200,
    rating: 4.7,
    reviews: 152
  },
  {
    productId: "prd-instrumenty-i-011",
    price: 92000,
    availableQuantity: 158,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 128
  },
  {
    productId: "prd-instrumenty-i-011",
    sellerName: "TSSP",
    price: 97520,
    availableQuantity: 134,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 1300,
    rating: 4.8,
    reviews: 505
  },
  {
    productId: "prd-instrumenty-i-011",
    sellerName: "Garwin",
    price: 97520,
    availableQuantity: 34,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 3100,
    rating: 5,
    reviews: 416
  },
  {
    productId: "prd-instrumenty-i-011",
    sellerName: "Lamed",
    price: 103960,
    availableQuantity: 80,
    deliveryDays: 7,
    deliveryMode: 2,
    deliveryCost: 4500,
    rating: 4.8,
    reviews: 165
  },
  {
    productId: "prd-instrumenty-i-012",
    price: 113500,
    availableQuantity: 12,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 153
  },
  {
    productId: "prd-instrumenty-i-012",
    sellerName: "TSSP",
    price: 114640,
    availableQuantity: 185,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 2900,
    rating: 4.9,
    reviews: 244
  },
  {
    productId: "prd-instrumenty-i-012",
    sellerName: "Garwin",
    price: 120310,
    availableQuantity: 186,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 1100,
    rating: 4.7,
    reviews: 346
  },
  {
    productId: "prd-instrumenty-i-013",
    price: 2600,
    availableQuantity: 360,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 5,
    reviews: 178
  },
  {
    productId: "prd-instrumenty-i-013",
    sellerName: "TSSP",
    price: 2940,
    availableQuantity: 130,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 454
  },
  {
    productId: "prd-instrumenty-i-013",
    sellerName: "Garwin",
    price: 2500,
    availableQuantity: 56,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 1200,
    rating: 4.8,
    reviews: 216
  },
  {
    productId: "prd-instrumenty-i-013",
    sellerName: "Lamed",
    price: 2940,
    availableQuantity: 174,
    deliveryDays: 7,
    deliveryMode: 0,
    deliveryCost: 2100,
    rating: 4.6,
    reviews: 86
  },
  {
    productId: "prd-instrumenty-i-014",
    price: 9400,
    availableQuantity: 870,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 172
  },
  {
    productId: "prd-instrumenty-i-014",
    sellerName: "TSSP",
    price: 9590,
    availableQuantity: 28,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 2600,
    rating: 4.7,
    reviews: 441
  },
  {
    productId: "prd-instrumenty-i-014",
    sellerName: "Garwin",
    price: 10530,
    availableQuantity: 128,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 1800,
    rating: 4.9,
    reviews: 365
  },
  {
    productId: "prd-instrumenty-i-015",
    price: 7600,
    availableQuantity: 490,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 28
  },
  {
    productId: "prd-instrumenty-i-015",
    sellerName: "Garwin",
    price: 7370,
    availableQuantity: 196,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 4000,
    rating: 4.8,
    reviews: 165
  },
  {
    productId: "prd-instrumenty-i-015",
    sellerName: "Lamed",
    price: 7520,
    availableQuantity: 137,
    deliveryDays: 7,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 154
  },
  {
    productId: "prd-instrumenty-i-016",
    price: 28750,
    availableQuantity: 154,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 53
  },
  {
    productId: "prd-instrumenty-i-016",
    sellerName: "TSSP",
    price: 31630,
    availableQuantity: 3,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 316
  },
  {
    productId: "prd-instrumenty-i-016",
    sellerName: "Garwin",
    price: 29900,
    availableQuantity: 67,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 1600,
    rating: 4.7,
    reviews: 73
  },
  {
    productId: "prd-instrumenty-i-016",
    sellerName: "Lamed",
    price: 27600,
    availableQuantity: 155,
    deliveryDays: 8,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 83
  },
  {
    productId: "prd-instrumenty-i-017",
    price: 29750,
    availableQuantity: 62,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 5,
    reviews: 78
  },
  {
    productId: "prd-instrumenty-i-017",
    sellerName: "Lamed",
    price: 32730,
    availableQuantity: 32,
    deliveryDays: 9,
    deliveryMode: 2,
    deliveryCost: 4200,
    rating: 4.6,
    reviews: 202
  },
  {
    productId: "prd-instrumenty-i-018",
    price: 9250,
    availableQuantity: 550,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 72
  },
  {
    productId: "prd-instrumenty-i-018",
    sellerName: "Lamed",
    price: 9440,
    availableQuantity: 232,
    deliveryDays: 8,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 137
  },
  {
    productId: "prd-instrumenty-i-018",
    sellerName: "TSSP",
    price: 10080,
    availableQuantity: 53,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 3600,
    rating: 4.7,
    reviews: 351
  },
  {
    productId: "prd-instrumenty-i-019",
    price: 23700,
    availableQuantity: 18,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 97
  },
  {
    productId: "prd-instrumenty-i-019",
    sellerName: "Garwin",
    price: 26310,
    availableQuantity: 144,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 5,
    reviews: 352
  },
  {
    productId: "prd-instrumenty-i-020",
    price: 7700,
    availableQuantity: 910,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 5,
    reviews: 18
  },
  {
    productId: "prd-instrumenty-i-020",
    sellerName: "Lamed",
    price: 8160,
    availableQuantity: 25,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 3600,
    rating: 4.8,
    reviews: 114
  },
  {
    productId: "prd-instrumenty-i-020",
    sellerName: "TSSP",
    price: 7930,
    availableQuantity: 20,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 5,
    reviews: 164
  },
  {
    productId: "prd-instrumenty-i-020",
    sellerName: "Garwin",
    price: 8240,
    availableQuantity: 28,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 3200,
    rating: 5,
    reviews: 402
  },
  {
    productId: "prd-instrumenty-i-021",
    price: 9600,
    availableQuantity: 1620,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 162
  },
  {
    productId: "prd-instrumenty-i-021",
    sellerName: "Garwin",
    price: 10370,
    availableQuantity: 86,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 317
  },
  {
    productId: "prd-instrumenty-i-021",
    sellerName: "Lamed",
    price: 10370,
    availableQuantity: 33,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 217
  },
  {
    productId: "prd-instrumenty-i-022",
    price: 5900,
    availableQuantity: 1090,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 68
  },
  {
    productId: "prd-instrumenty-i-022",
    sellerName: "Garwin",
    price: 5900,
    availableQuantity: 159,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 4400,
    rating: 5,
    reviews: 145
  },
  {
    productId: "prd-instrumenty-i-022",
    sellerName: "Lamed",
    price: 5610,
    availableQuantity: 15,
    deliveryDays: 9,
    deliveryMode: 1,
    deliveryCost: 2400,
    rating: 4.6,
    reviews: 250
  },
  {
    productId: "prd-instrumenty-i-022",
    sellerName: "TSSP",
    price: 6200,
    availableQuantity: 70,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 3700,
    rating: 4.8,
    reviews: 130
  },
  {
    productId: "prd-instrumenty-i-023",
    price: 9400,
    availableQuantity: 190,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 43
  },
  {
    productId: "prd-instrumenty-i-023",
    sellerName: "TSSP",
    price: 9960,
    availableQuantity: 82,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 265
  },
  {
    productId: "prd-instrumenty-i-023",
    sellerName: "Garwin",
    price: 9210,
    availableQuantity: 67,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 242
  },
  {
    productId: "prd-instrumenty-i-023",
    sellerName: "Lamed",
    price: 8930,
    availableQuantity: 181,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 2200,
    rating: 4.7,
    reviews: 112
  },
  {
    productId: "prd-instrumenty-i-024",
    price: 8600,
    availableQuantity: 380,
    deliveryDays: 10,
    deliveryCost: 0,
    rating: 5,
    reviews: 118
  },
  {
    productId: "prd-instrumenty-i-024",
    sellerName: "TSSP",
    price: 9800,
    availableQuantity: 64,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 2100,
    rating: 4.8,
    reviews: 422
  },
  {
    productId: "prd-instrumenty-i-024",
    sellerName: "Garwin",
    price: 8860,
    availableQuantity: 202,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 2700,
    rating: 5,
    reviews: 279
  },
  {
    productId: "prd-instrumenty-i-024",
    sellerName: "Lamed",
    price: 8430,
    availableQuantity: 214,
    deliveryDays: 7,
    deliveryMode: 2,
    deliveryCost: 3200,
    rating: 4.8,
    reviews: 107
  },
  {
    productId: "prd-rashodnye-materialy-001",
    price: 75500,
    availableQuantity: 194,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 61
  },
  {
    productId: "prd-rashodnye-materialy-001",
    sellerName: "TSSP",
    price: 79280,
    availableQuantity: 106,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 2600,
    rating: 4.9,
    reviews: 143
  },
  {
    productId: "prd-rashodnye-materialy-001",
    sellerName: "Garwin",
    price: 71730,
    availableQuantity: 124,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 407
  },
  {
    productId: "prd-rashodnye-materialy-002",
    price: 23000,
    availableQuantity: 54,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 86
  },
  {
    productId: "prd-rashodnye-materialy-002",
    sellerName: "TSSP",
    price: 21620,
    availableQuantity: 161,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 2200,
    rating: 4.8,
    reviews: 234
  },
  {
    productId: "prd-rashodnye-materialy-002",
    sellerName: "Garwin",
    price: 24840,
    availableQuantity: 234,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 4200,
    rating: 4.8,
    reviews: 76
  },
  {
    productId: "prd-rashodnye-materialy-002",
    sellerName: "Lamed",
    price: 22540,
    availableQuantity: 103,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 3000,
    rating: 4.8,
    reviews: 222
  },
  {
    productId: "prd-rashodnye-materialy-003",
    price: 57500,
    availableQuantity: 98,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 111
  },
  {
    productId: "prd-rashodnye-materialy-003",
    sellerName: "Lamed",
    price: 62100,
    availableQuantity: 17,
    deliveryDays: 8,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 142
  },
  {
    productId: "prd-rashodnye-materialy-004",
    price: 169500,
    availableQuantity: 8,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 5,
    reviews: 32
  },
  {
    productId: "prd-rashodnye-materialy-004",
    sellerName: "Garwin",
    price: 188150,
    availableQuantity: 201,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 2500,
    rating: 5,
    reviews: 386
  },
  {
    productId: "prd-rashodnye-materialy-004",
    sellerName: "Lamed",
    price: 172890,
    availableQuantity: 126,
    deliveryDays: 9,
    deliveryMode: 2,
    deliveryCost: 900,
    rating: 4.6,
    reviews: 154
  },
  {
    productId: "prd-rashodnye-materialy-004",
    sellerName: "TSSP",
    price: 179670,
    availableQuantity: 110,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 1400,
    rating: 4.8,
    reviews: 273
  },
  {
    productId: "prd-rashodnye-materialy-005",
    price: 161500,
    availableQuantity: 8,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 176
  },
  {
    productId: "prd-rashodnye-materialy-005",
    sellerName: "Garwin",
    price: 169580,
    availableQuantity: 39,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 256
  },
  {
    productId: "prd-rashodnye-materialy-005",
    sellerName: "Lamed",
    price: 171190,
    availableQuantity: 49,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 202
  },
  {
    productId: "prd-rashodnye-materialy-005",
    sellerName: "TSSP",
    price: 151810,
    availableQuantity: 23,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 3000,
    rating: 4.9,
    reviews: 483
  },
  {
    productId: "prd-rashodnye-materialy-006",
    price: 33000,
    availableQuantity: 76,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 151
  },
  {
    productId: "prd-rashodnye-materialy-006",
    sellerName: "Lamed",
    price: 33000,
    availableQuantity: 144,
    deliveryDays: 9,
    deliveryMode: 1,
    deliveryCost: 3200,
    rating: 4.8,
    reviews: 97
  },
  {
    productId: "prd-rashodnye-materialy-006",
    sellerName: "TSSP",
    price: 34980,
    availableQuantity: 174,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 4500,
    rating: 5,
    reviews: 415
  },
  {
    productId: "prd-rashodnye-materialy-006",
    sellerName: "Garwin",
    price: 34980,
    availableQuantity: 115,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 2000,
    rating: 5,
    reviews: 64
  },
  {
    productId: "prd-rashodnye-materialy-007",
    price: 20000,
    availableQuantity: 6,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 180
  },
  {
    productId: "prd-rashodnye-materialy-007",
    sellerName: "TSSP",
    price: 20000,
    availableQuantity: 30,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 114
  },
  {
    productId: "prd-rashodnye-materialy-007",
    sellerName: "Garwin",
    price: 22400,
    availableQuantity: 41,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 1000,
    rating: 4.9,
    reviews: 99
  },
  {
    productId: "prd-rashodnye-materialy-008",
    price: 15000,
    availableQuantity: 180,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 5,
    reviews: 67
  },
  {
    productId: "prd-rashodnye-materialy-008",
    sellerName: "Garwin",
    price: 14250,
    availableQuantity: 186,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 3600,
    rating: 5,
    reviews: 78
  },
  {
    productId: "prd-rashodnye-materialy-008",
    sellerName: "Lamed",
    price: 14700,
    availableQuantity: 198,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 2700,
    rating: 4.6,
    reviews: 205
  },
  {
    productId: "prd-rashodnye-materialy-009",
    price: 13750,
    availableQuantity: 34,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 92
  },
  {
    productId: "prd-rashodnye-materialy-009",
    sellerName: "Lamed",
    price: 14300,
    availableQuantity: 11,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 4100,
    rating: 4.9,
    reviews: 119
  },
  {
    productId: "prd-rashodnye-materialy-010",
    price: 7050,
    availableQuantity: 1110,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 121
  },
  {
    productId: "prd-rashodnye-materialy-010",
    sellerName: "TSSP",
    price: 7760,
    availableQuantity: 3,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 182
  },
  {
    productId: "prd-rashodnye-materialy-010",
    sellerName: "Garwin",
    price: 6910,
    availableQuantity: 43,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 1300,
    rating: 4.9,
    reviews: 163
  },
  {
    productId: "prd-rashodnye-materialy-011",
    price: 6650,
    availableQuantity: 570,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 96
  },
  {
    productId: "prd-rashodnye-materialy-011",
    sellerName: "Lamed",
    price: 6980,
    availableQuantity: 230,
    deliveryDays: 5,
    deliveryMode: 2,
    deliveryCost: 3800,
    rating: 4.8,
    reviews: 154
  },
  {
    productId: "prd-rashodnye-materialy-011",
    sellerName: "TSSP",
    price: 6980,
    availableQuantity: 195,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 2300,
    rating: 5,
    reviews: 295
  },
  {
    productId: "prd-rashodnye-materialy-011",
    sellerName: "Garwin",
    price: 6520,
    availableQuantity: 88,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 900,
    rating: 5,
    reviews: 200
  },
  {
    productId: "prd-rashodnye-materialy-012",
    price: 3150,
    availableQuantity: 60,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 71
  },
  {
    productId: "prd-rashodnye-materialy-012",
    sellerName: "Garwin",
    price: 3280,
    availableQuantity: 175,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 2500,
    rating: 4.7,
    reviews: 360
  },
  {
    productId: "prd-rashodnye-materialy-012",
    sellerName: "Lamed",
    price: 3500,
    availableQuantity: 100,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 257
  },
  {
    productId: "prd-rashodnye-materialy-012",
    sellerName: "TSSP",
    price: 3500,
    availableQuantity: 60,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 194
  },
  {
    productId: "prd-rashodnye-materialy-013",
    price: 3400,
    availableQuantity: 960,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 5,
    reviews: 46
  },
  {
    productId: "prd-rashodnye-materialy-013",
    sellerName: "TSSP",
    price: 3330,
    availableQuantity: 137,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 2300,
    rating: 4.8,
    reviews: 136
  },
  {
    productId: "prd-rashodnye-materialy-013",
    sellerName: "Garwin",
    price: 3500,
    availableQuantity: 151,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 1100,
    rating: 4.8,
    reviews: 96
  },
  {
    productId: "prd-rashodnye-materialy-014",
    price: 3600,
    availableQuantity: 400,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 21
  },
  {
    productId: "prd-rashodnye-materialy-014",
    sellerName: "Garwin",
    price: 3380,
    availableQuantity: 137,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 1400,
    rating: 4.9,
    reviews: 359
  },
  {
    productId: "prd-rashodnye-materialy-014",
    sellerName: "Lamed",
    price: 3560,
    availableQuantity: 190,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 4000,
    rating: 4.7,
    reviews: 70
  },
  {
    productId: "prd-rashodnye-materialy-015",
    price: 10800,
    availableQuantity: 28,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 165
  },
  {
    productId: "prd-rashodnye-materialy-015",
    sellerName: "TSSP",
    price: 10260,
    availableQuantity: 235,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 2700,
    rating: 4.8,
    reviews: 305
  },
  {
    productId: "prd-rashodnye-materialy-016",
    price: 1650,
    availableQuantity: 1230,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 140
  },
  {
    productId: "prd-rashodnye-materialy-016",
    sellerName: "Lamed",
    price: 1580,
    availableQuantity: 7,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 4000,
    rating: 4.9,
    reviews: 170
  },
  {
    productId: "prd-rashodnye-materialy-017",
    price: 5450,
    availableQuantity: 490,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 5,
    reviews: 115
  },
  {
    productId: "prd-rashodnye-materialy-017",
    sellerName: "Lamed",
    price: 6100,
    availableQuantity: 200,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 3400,
    rating: 4.6,
    reviews: 68
  },
  {
    productId: "prd-rashodnye-materialy-017",
    sellerName: "TSSP",
    price: 5450,
    availableQuantity: 66,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 3800,
    rating: 4.8,
    reviews: 448
  },
  {
    productId: "prd-rashodnye-materialy-017",
    sellerName: "Garwin",
    price: 5290,
    availableQuantity: 7,
    deliveryDays: 5,
    deliveryMode: 2,
    deliveryCost: 3700,
    rating: 4.8,
    reviews: 370
  },
  {
    productId: "prd-rashodnye-materialy-018",
    price: 800,
    availableQuantity: 3600,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 152
  },
  {
    productId: "prd-rashodnye-materialy-018",
    sellerName: "Lamed",
    price: 820,
    availableQuantity: 159,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 1600,
    rating: 4.9,
    reviews: 231
  },
  {
    productId: "prd-rashodnye-materialy-018",
    sellerName: "TSSP",
    price: 890,
    availableQuantity: 59,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 3500,
    rating: 4.7,
    reviews: 225
  },
  {
    productId: "prd-rashodnye-materialy-018",
    sellerName: "Garwin",
    price: 870,
    availableQuantity: 112,
    deliveryDays: 5,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 89
  },
  {
    productId: "prd-rashodnye-materialy-019",
    price: 3850,
    availableQuantity: 440,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 127
  },
  {
    productId: "prd-rashodnye-materialy-019",
    sellerName: "Garwin",
    price: 4160,
    availableQuantity: 170,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 3900,
    rating: 4.8,
    reviews: 141
  },
  {
    productId: "prd-rashodnye-materialy-019",
    sellerName: "Lamed",
    price: 3930,
    availableQuantity: 151,
    deliveryDays: 7,
    deliveryMode: 2,
    deliveryCost: 2200,
    rating: 4.8,
    reviews: 60
  },
  {
    productId: "prd-rashodnye-materialy-020",
    price: 4900,
    availableQuantity: 130,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 5,
    reviews: 37
  },
  {
    productId: "prd-rashodnye-materialy-020",
    sellerName: "Lamed",
    price: 4950,
    availableQuantity: 75,
    deliveryDays: 7,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 130
  },
  {
    productId: "prd-rashodnye-materialy-020",
    sellerName: "TSSP",
    price: 5290,
    availableQuantity: 181,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 1500,
    rating: 5,
    reviews: 450
  },
  {
    productId: "prd-rashodnye-materialy-020",
    sellerName: "Garwin",
    price: 5100,
    availableQuantity: 184,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 5,
    reviews: 177
  },
  {
    productId: "prd-rashodnye-materialy-021",
    price: 9100,
    availableQuantity: 900,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 62
  },
  {
    productId: "prd-rashodnye-materialy-021",
    sellerName: "Lamed",
    price: 9190,
    availableQuantity: 199,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 1100,
    rating: 4.9,
    reviews: 54
  },
  {
    productId: "prd-rashodnye-materialy-021",
    sellerName: "TSSP",
    price: 9190,
    availableQuantity: 161,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 1800,
    rating: 4.7,
    reviews: 170
  },
  {
    productId: "prd-rashodnye-materialy-021",
    sellerName: "Garwin",
    price: 10100,
    availableQuantity: 36,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 1400,
    rating: 4.9,
    reviews: 407
  },
  {
    productId: "prd-rashodnye-materialy-022",
    price: 7250,
    availableQuantity: 510,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 156
  },
  {
    productId: "prd-rashodnye-materialy-022",
    sellerName: "Lamed",
    price: 6890,
    availableQuantity: 219,
    deliveryDays: 9,
    deliveryMode: 1,
    deliveryCost: 3900,
    rating: 4.6,
    reviews: 232
  },
  {
    productId: "prd-rashodnye-materialy-023",
    price: 23750,
    availableQuantity: 98,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 12
  },
  {
    productId: "prd-rashodnye-materialy-023",
    sellerName: "Lamed",
    price: 25650,
    availableQuantity: 181,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 158
  },
  {
    productId: "prd-rashodnye-materialy-023",
    sellerName: "TSSP",
    price: 22560,
    availableQuantity: 105,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 1700,
    rating: 4.9,
    reviews: 229
  },
  {
    productId: "prd-rashodnye-materialy-024",
    price: 14750,
    availableQuantity: 164,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 5,
    reviews: 137
  },
  {
    productId: "prd-rashodnye-materialy-024",
    sellerName: "TSSP",
    price: 14600,
    availableQuantity: 16,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 2900,
    rating: 5,
    reviews: 406
  },
  {
    productId: "prd-rashodnye-materialy-025",
    price: 2200,
    availableQuantity: 650,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 162
  },
  {
    productId: "prd-rashodnye-materialy-025",
    sellerName: "Lamed",
    price: 2440,
    availableQuantity: 39,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 2200,
    rating: 4.7,
    reviews: 74
  },
  {
    productId: "prd-rashodnye-materialy-025",
    sellerName: "TSSP",
    price: 2440,
    availableQuantity: 188,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 1000,
    rating: 4.7,
    reviews: 525
  },
  {
    productId: "prd-rashodnye-materialy-026",
    price: 3700,
    availableQuantity: 600,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 87
  },
  {
    productId: "prd-rashodnye-materialy-026",
    sellerName: "Garwin",
    price: 3590,
    availableQuantity: 106,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 3000,
    rating: 5,
    reviews: 397
  },
  {
    productId: "prd-rashodnye-materialy-026",
    sellerName: "Lamed",
    price: 3480,
    availableQuantity: 161,
    deliveryDays: 9,
    deliveryMode: 0,
    deliveryCost: 3100,
    rating: 4.6,
    reviews: 42
  },
  {
    productId: "prd-rashodnye-materialy-026",
    sellerName: "TSSP",
    price: 3890,
    availableQuantity: 147,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 3300,
    rating: 4.8,
    reviews: 501
  },
  {
    productId: "prd-rashodnye-materialy-027",
    price: 6400,
    availableQuantity: 500,
    deliveryDays: 8,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 112
  },
  {
    productId: "prd-rashodnye-materialy-027",
    sellerName: "Lamed",
    price: 6980,
    availableQuantity: 42,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 61
  },
  {
    productId: "prd-metizy-i-001",
    price: 485,
    availableQuantity: 3000,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 31
  },
  {
    productId: "prd-metizy-i-001",
    sellerName: "Garwin",
    price: 470,
    availableQuantity: 64,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 1900,
    rating: 4.7,
    reviews: 381
  },
  {
    productId: "prd-metizy-i-002",
    price: 1250,
    availableQuantity: 550,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 5,
    reviews: 106
  },
  {
    productId: "prd-metizy-i-002",
    sellerName: "TSSP",
    price: 1240,
    availableQuantity: 123,
    deliveryDays: 1,
    deliveryMode: 0,
    deliveryCost: 2400,
    rating: 5,
    reviews: 104
  },
  {
    productId: "prd-metizy-i-002",
    sellerName: "Garwin",
    price: 1290,
    availableQuantity: 239,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 5,
    reviews: 408
  },
  {
    productId: "prd-metizy-i-002",
    sellerName: "Lamed",
    price: 1430,
    availableQuantity: 173,
    deliveryDays: 9,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 138
  },
  {
    productId: "prd-metizy-i-003",
    price: 690,
    availableQuantity: 4050,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 81
  },
  {
    productId: "prd-metizy-i-003",
    sellerName: "Lamed",
    price: 730,
    availableQuantity: 31,
    deliveryDays: 8,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 106
  },
  {
    productId: "prd-metizy-i-003",
    sellerName: "TSSP",
    price: 740,
    availableQuantity: 142,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 4500,
    rating: 4.7,
    reviews: 431
  },
  {
    productId: "prd-metizy-i-003",
    sellerName: "Garwin",
    price: 700,
    availableQuantity: 100,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 4200,
    rating: 4.9,
    reviews: 169
  },
  {
    productId: "prd-metizy-i-004",
    price: 795,
    availableQuantity: 4900,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 156
  },
  {
    productId: "prd-metizy-i-004",
    sellerName: "Garwin",
    price: 770,
    availableQuantity: 208,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 1600,
    rating: 4.8,
    reviews: 262
  },
  {
    productId: "prd-metizy-i-004",
    sellerName: "Lamed",
    price: 890,
    availableQuantity: 115,
    deliveryDays: 9,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 50
  },
  {
    productId: "prd-metizy-i-004",
    sellerName: "TSSP",
    price: 760,
    availableQuantity: 25,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 4200,
    rating: 4.8,
    reviews: 183
  },
  {
    productId: "prd-metizy-i-005",
    price: 435,
    availableQuantity: 2250,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 131
  },
  {
    productId: "prd-metizy-i-005",
    sellerName: "Lamed",
    price: 480,
    availableQuantity: 63,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 156
  },
  {
    productId: "prd-metizy-i-005",
    sellerName: "TSSP",
    price: 410,
    availableQuantity: 71,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 138
  },
  {
    productId: "prd-metizy-i-006",
    price: 340,
    availableQuantity: 1450,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 5,
    reviews: 37
  },
  {
    productId: "prd-metizy-i-006",
    sellerName: "Lamed",
    price: 330,
    availableQuantity: 150,
    deliveryDays: 9,
    deliveryMode: 2,
    deliveryCost: 3300,
    rating: 4.8,
    reviews: 75
  },
  {
    productId: "prd-metizy-i-006",
    sellerName: "TSSP",
    price: 370,
    availableQuantity: 175,
    deliveryDays: 1,
    deliveryMode: 0,
    deliveryCost: 3700,
    rating: 5,
    reviews: 147
  },
  {
    productId: "prd-metizy-i-007",
    price: 160,
    availableQuantity: 1800,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 12
  },
  {
    productId: "prd-metizy-i-007",
    sellerName: "TSSP",
    price: 170,
    availableQuantity: 115,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 4100,
    rating: 4.7,
    reviews: 170
  },
  {
    productId: "prd-metizy-i-008",
    price: 165,
    availableQuantity: 7650,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 5,
    reviews: 87
  },
  {
    productId: "prd-metizy-i-008",
    sellerName: "Garwin",
    price: 180,
    availableQuantity: 15,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 2500,
    rating: 5,
    reviews: 131
  },
  {
    productId: "prd-metizy-i-008",
    sellerName: "Lamed",
    price: 160,
    availableQuantity: 213,
    deliveryDays: 9,
    deliveryMode: 2,
    deliveryCost: 2700,
    rating: 4.6,
    reviews: 56
  },
  {
    productId: "prd-metizy-i-008",
    sellerName: "TSSP",
    price: 170,
    availableQuantity: 157,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 4000,
    rating: 5,
    reviews: 101
  },
  {
    productId: "prd-metizy-i-009",
    price: 335,
    availableQuantity: 1300,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 62
  },
  {
    productId: "prd-metizy-i-009",
    sellerName: "Garwin",
    price: 350,
    availableQuantity: 71,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 232
  },
  {
    productId: "prd-metizy-i-009",
    sellerName: "Lamed",
    price: 370,
    availableQuantity: 187,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 127
  },
  {
    productId: "prd-metizy-i-010",
    price: 550,
    availableQuantity: 2100,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 31
  },
  {
    productId: "prd-metizy-i-010",
    sellerName: "Garwin",
    price: 580,
    availableQuantity: 46,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 1900,
    rating: 4.9,
    reviews: 296
  },
  {
    productId: "prd-metizy-i-011",
    price: 2900,
    availableQuantity: 370,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 5,
    reviews: 175
  },
  {
    productId: "prd-metizy-i-011",
    sellerName: "TSSP",
    price: 2990,
    availableQuantity: 27,
    deliveryDays: 1,
    deliveryMode: 0,
    deliveryCost: 1300,
    rating: 5,
    reviews: 330
  },
  {
    productId: "prd-metizy-i-011",
    sellerName: "Garwin",
    price: 3190,
    availableQuantity: 3,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 261
  },
  {
    productId: "prd-metizy-i-012",
    price: 9200,
    availableQuantity: 580,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 81
  },
  {
    productId: "prd-metizy-i-012",
    sellerName: "TSSP",
    price: 8740,
    availableQuantity: 235,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 3200,
    rating: 4.9,
    reviews: 259
  },
  {
    productId: "prd-metizy-i-012",
    sellerName: "Garwin",
    price: 10030,
    availableQuantity: 197,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 3300,
    rating: 4.7,
    reviews: 255
  },
  {
    productId: "prd-metizy-i-013",
    price: 9600,
    availableQuantity: 850,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 56
  },
  {
    productId: "prd-metizy-i-013",
    sellerName: "Lamed",
    price: 10460,
    availableQuantity: 178,
    deliveryDays: 7,
    deliveryMode: 0,
    deliveryCost: 2500,
    rating: 4.6,
    reviews: 134
  },
  {
    productId: "prd-metizy-i-013",
    sellerName: "TSSP",
    price: 10180,
    availableQuantity: 30,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 3900,
    rating: 5,
    reviews: 484
  },
  {
    productId: "prd-metizy-i-013",
    sellerName: "Garwin",
    price: 9020,
    availableQuantity: 146,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 1600,
    rating: 5,
    reviews: 364
  },
  {
    productId: "prd-metizy-i-014",
    price: 1250,
    availableQuantity: 1030,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 131
  },
  {
    productId: "prd-metizy-i-014",
    sellerName: "Lamed",
    price: 1180,
    availableQuantity: 238,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 176
  },
  {
    productId: "prd-metizy-i-014",
    sellerName: "TSSP",
    price: 1360,
    availableQuantity: 196,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 265
  },
  {
    productId: "prd-metizy-i-015",
    price: 5250,
    availableQuantity: 720,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 5,
    reviews: 106
  },
  {
    productId: "prd-metizy-i-015",
    sellerName: "Lamed",
    price: 5460,
    availableQuantity: 68,
    deliveryDays: 9,
    deliveryMode: 2,
    deliveryCost: 2200,
    rating: 4.8,
    reviews: 249
  },
  {
    productId: "prd-metizy-i-016",
    price: 4400,
    availableQuantity: 970,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 12
  },
  {
    productId: "prd-metizy-i-016",
    sellerName: "Lamed",
    price: 4220,
    availableQuantity: 235,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 1900,
    rating: 4.7,
    reviews: 160
  },
  {
    productId: "prd-metizy-i-017",
    price: 4750,
    availableQuantity: 260,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 156
  },
  {
    productId: "prd-metizy-i-017",
    sellerName: "TSSP",
    price: 4990,
    availableQuantity: 127,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 5,
    reviews: 100
  },
  {
    productId: "prd-metizy-i-017",
    sellerName: "Garwin",
    price: 5320,
    availableQuantity: 188,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 1900,
    rating: 4.8,
    reviews: 203
  },
  {
    productId: "prd-metizy-i-017",
    sellerName: "Lamed",
    price: 4610,
    availableQuantity: 233,
    deliveryDays: 9,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 241
  },
  {
    productId: "prd-metizy-i-018",
    price: 2900,
    availableQuantity: 850,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 62
  },
  {
    productId: "prd-metizy-i-018",
    sellerName: "TSSP",
    price: 3100,
    availableQuantity: 186,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 168
  },
  {
    productId: "prd-metizy-i-018",
    sellerName: "Garwin",
    price: 3160,
    availableQuantity: 131,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 106
  },
  {
    productId: "prd-metizy-i-019",
    price: 3800,
    availableQuantity: 790,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 37
  },
  {
    productId: "prd-metizy-i-019",
    sellerName: "Garwin",
    price: 3690,
    availableQuantity: 172,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 5,
    reviews: 360
  },
  {
    productId: "prd-metizy-i-020",
    price: 1700,
    availableQuantity: 840,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 5,
    reviews: 57
  },
  {
    productId: "prd-metizy-i-020",
    sellerName: "Lamed",
    price: 1700,
    availableQuantity: 162,
    deliveryDays: 7,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 200
  },
  {
    productId: "prd-metizy-i-020",
    sellerName: "TSSP",
    price: 1750,
    availableQuantity: 59,
    deliveryDays: 1,
    deliveryMode: 2,
    deliveryCost: 1700,
    rating: 4.8,
    reviews: 279
  },
  {
    productId: "prd-metizy-i-020",
    sellerName: "Garwin",
    price: 1600,
    availableQuantity: 115,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 293
  },
  {
    productId: "prd-metizy-i-021",
    price: 4550,
    availableQuantity: 750,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 32
  },
  {
    productId: "prd-metizy-i-021",
    sellerName: "TSSP",
    price: 4640,
    availableQuantity: 170,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 301
  },
  {
    productId: "prd-metizy-i-021",
    sellerName: "Garwin",
    price: 4690,
    availableQuantity: 141,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 2800,
    rating: 4.9,
    reviews: 392
  },
  {
    productId: "prd-metizy-i-022",
    price: 3050,
    availableQuantity: 320,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 176
  },
  {
    productId: "prd-metizy-i-022",
    sellerName: "Lamed",
    price: 3450,
    availableQuantity: 80,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 4400,
    rating: 4.6,
    reviews: 162
  },
  {
    productId: "prd-metizy-i-023",
    price: 850,
    availableQuantity: 5850,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 151
  },
  {
    productId: "prd-metizy-i-023",
    sellerName: "Garwin",
    price: 940,
    availableQuantity: 89,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 3100,
    rating: 4.7,
    reviews: 296
  },
  {
    productId: "prd-metizy-i-023",
    sellerName: "Lamed",
    price: 900,
    availableQuantity: 25,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 4100,
    rating: 4.9,
    reviews: 105
  },
  {
    productId: "prd-metizy-i-023",
    sellerName: "TSSP",
    price: 930,
    availableQuantity: 45,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 219
  },
  {
    productId: "prd-metizy-i-024",
    price: 1850,
    availableQuantity: 300,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 5,
    reviews: 126
  },
  {
    productId: "prd-metizy-i-024",
    sellerName: "Lamed",
    price: 1850,
    availableQuantity: 71,
    deliveryDays: 7,
    deliveryMode: 0,
    deliveryCost: 1700,
    rating: 4.8,
    reviews: 228
  },
  {
    productId: "prd-metizy-i-025",
    price: 4050,
    availableQuantity: 150,
    deliveryDays: 6,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 101
  },
  {
    productId: "prd-metizy-i-025",
    sellerName: "Lamed",
    price: 3930,
    availableQuantity: 90,
    deliveryDays: 8,
    deliveryMode: 2,
    deliveryCost: 1100,
    rating: 4.9,
    reviews: 168
  },
  {
    productId: "prd-metizy-i-025",
    sellerName: "TSSP",
    price: 4620,
    availableQuantity: 47,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 2300,
    rating: 4.7,
    reviews: 100
  },
  {
    productId: "prd-elektrotehnika-i-001",
    price: 75000,
    availableQuantity: 30,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 36
  },
  {
    productId: "prd-elektrotehnika-i-001",
    sellerName: "Garwin",
    price: 78000,
    availableQuantity: 25,
    deliveryDays: 6,
    deliveryMode: 2,
    deliveryCost: 2600,
    rating: 4.7,
    reviews: 254
  },
  {
    productId: "prd-elektrotehnika-i-001",
    sellerName: "Lamed",
    price: 72000,
    availableQuantity: 3,
    deliveryDays: 8,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 216
  },
  {
    productId: "prd-elektrotehnika-i-002",
    price: 58500,
    availableQuantity: 88,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 5,
    reviews: 130
  },
  {
    productId: "prd-elektrotehnika-i-002",
    sellerName: "TSSP",
    price: 63180,
    availableQuantity: 6,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 5,
    reviews: 233
  },
  {
    productId: "prd-elektrotehnika-i-003",
    price: 89500,
    availableQuantity: 180,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 155
  },
  {
    productId: "prd-elektrotehnika-i-003",
    sellerName: "Lamed",
    price: 93080,
    availableQuantity: 83,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 2500,
    rating: 4.7,
    reviews: 166
  },
  {
    productId: "prd-elektrotehnika-i-003",
    sellerName: "TSSP",
    price: 85920,
    availableQuantity: 21,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 2100,
    rating: 4.7,
    reviews: 389
  },
  {
    productId: "prd-elektrotehnika-i-003",
    sellerName: "Garwin",
    price: 99350,
    availableQuantity: 161,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 254
  },
  {
    productId: "prd-elektrotehnika-i-004",
    price: 82500,
    availableQuantity: 106,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 111
  },
  {
    productId: "prd-elektrotehnika-i-004",
    sellerName: "Lamed",
    price: 87450,
    availableQuantity: 216,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 60
  },
  {
    productId: "prd-elektrotehnika-i-005",
    price: 51000,
    availableQuantity: 98,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 136
  },
  {
    productId: "prd-elektrotehnika-i-005",
    sellerName: "Garwin",
    price: 49470,
    availableQuantity: 165,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 70
  },
  {
    productId: "prd-elektrotehnika-i-005",
    sellerName: "Lamed",
    price: 52020,
    availableQuantity: 53,
    deliveryDays: 8,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 88
  },
  {
    productId: "prd-elektrotehnika-i-005",
    sellerName: "TSSP",
    price: 57630,
    availableQuantity: 147,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 3100,
    rating: 4.9,
    reviews: 367
  },
  {
    productId: "prd-elektrotehnika-i-006",
    price: 11000,
    availableQuantity: 100,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 5,
    reviews: 61
  },
  {
    productId: "prd-elektrotehnika-i-006",
    sellerName: "TSSP",
    price: 10780,
    availableQuantity: 19,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 144
  },
  {
    productId: "prd-elektrotehnika-i-006",
    sellerName: "Garwin",
    price: 12210,
    availableQuantity: 213,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 4100,
    rating: 4.8,
    reviews: 199
  },
  {
    productId: "prd-elektrotehnika-i-006",
    sellerName: "Lamed",
    price: 11220,
    availableQuantity: 115,
    deliveryDays: 7,
    deliveryMode: 1,
    deliveryCost: 900,
    rating: 4.8,
    reviews: 78
  },
  {
    productId: "prd-elektrotehnika-i-007",
    price: 26000,
    availableQuantity: 36,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 86
  },
  {
    productId: "prd-elektrotehnika-i-007",
    sellerName: "TSSP",
    price: 27040,
    availableQuantity: 226,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 2400,
    rating: 4.7,
    reviews: 208
  },
  {
    productId: "prd-elektrotehnika-i-007",
    sellerName: "Garwin",
    price: 24440,
    availableQuantity: 138,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 395
  },
  {
    productId: "prd-elektrotehnika-i-008",
    price: 39500,
    availableQuantity: 162,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 149
  },
  {
    productId: "prd-elektrotehnika-i-008",
    sellerName: "TSSP",
    price: 40690,
    availableQuantity: 197,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 5,
    reviews: 420
  },
  {
    productId: "prd-elektrotehnika-i-008",
    sellerName: "Garwin",
    price: 41870,
    availableQuantity: 20,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 900,
    rating: 5,
    reviews: 358
  },
  {
    productId: "prd-elektrotehnika-i-008",
    sellerName: "Lamed",
    price: 38710,
    availableQuantity: 71,
    deliveryDays: 9,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 171
  },
  {
    productId: "prd-elektrotehnika-i-009",
    price: 1050,
    availableQuantity: 490,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 174
  },
  {
    productId: "prd-elektrotehnika-i-009",
    sellerName: "Lamed",
    price: 1020,
    availableQuantity: 213,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 1900,
    rating: 4.9,
    reviews: 81
  },
  {
    productId: "prd-elektrotehnika-i-009",
    sellerName: "TSSP",
    price: 1040,
    availableQuantity: 216,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 4100,
    rating: 4.9,
    reviews: 298
  },
  {
    productId: "prd-elektrotehnika-i-010",
    price: 4400,
    availableQuantity: 1030,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 96
  },
  {
    productId: "prd-elektrotehnika-i-010",
    sellerName: "TSSP",
    price: 4580,
    availableQuantity: 167,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 1400,
    rating: 4.7,
    reviews: 422
  },
  {
    productId: "prd-elektrotehnika-i-011",
    price: 1300,
    availableQuantity: 390,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 71
  },
  {
    productId: "prd-elektrotehnika-i-011",
    sellerName: "Lamed",
    price: 1390,
    availableQuantity: 92,
    deliveryDays: 9,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 89
  },
  {
    productId: "prd-elektrotehnika-i-011",
    sellerName: "TSSP",
    price: 1440,
    availableQuantity: 10,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 4100,
    rating: 5,
    reviews: 378
  },
  {
    productId: "prd-elektrotehnika-i-012",
    price: 206000,
    availableQuantity: 1,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 146
  },
  {
    productId: "prd-elektrotehnika-i-012",
    sellerName: "TSSP",
    price: 232780,
    availableQuantity: 59,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 145
  },
  {
    productId: "prd-elektrotehnika-i-012",
    sellerName: "Garwin",
    price: 216300,
    availableQuantity: 33,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 146
  },
  {
    productId: "prd-elektrotehnika-i-013",
    price: 259000,
    availableQuantity: 22,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 5,
    reviews: 121
  },
  {
    productId: "prd-elektrotehnika-i-013",
    sellerName: "Garwin",
    price: 243460,
    availableQuantity: 41,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 360
  },
  {
    productId: "prd-elektrotehnika-i-013",
    sellerName: "Lamed",
    price: 261590,
    availableQuantity: 203,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.6,
    reviews: 135
  },
  {
    productId: "prd-elektrotehnika-i-013",
    sellerName: "TSSP",
    price: 279720,
    availableQuantity: 65,
    deliveryDays: 3,
    deliveryMode: 0,
    deliveryCost: 2700,
    rating: 4.8,
    reviews: 87
  },
  {
    productId: "prd-elektrotehnika-i-014",
    price: 84000,
    availableQuantity: 28,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 165
  },
  {
    productId: "prd-elektrotehnika-i-014",
    sellerName: "Garwin",
    price: 84840,
    availableQuantity: 124,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 105
  },
  {
    productId: "prd-elektrotehnika-i-014",
    sellerName: "Lamed",
    price: 88200,
    availableQuantity: 218,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 900,
    rating: 4.9,
    reviews: 189
  },
  {
    productId: "prd-elektrotehnika-i-015",
    price: 4700,
    availableQuantity: 410,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 140
  },
  {
    productId: "prd-elektrotehnika-i-015",
    sellerName: "Lamed",
    price: 4840,
    availableQuantity: 110,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 1800,
    rating: 4.8,
    reviews: 61
  },
  {
    productId: "prd-elektrotehnika-i-015",
    sellerName: "TSSP",
    price: 4510,
    availableQuantity: 113,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 4500,
    rating: 5,
    reviews: 367
  },
  {
    productId: "prd-elektrotehnika-i-015",
    sellerName: "Garwin",
    price: 5260,
    availableQuantity: 215,
    deliveryDays: 2,
    deliveryMode: 0,
    deliveryCost: 4500,
    rating: 4.8,
    reviews: 390
  },
  {
    productId: "prd-elektrotehnika-i-016",
    price: 23300,
    availableQuantity: 218,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 46
  },
  {
    productId: "prd-elektrotehnika-i-016",
    sellerName: "Lamed",
    price: 24000,
    availableQuantity: 88,
    deliveryDays: 6,
    deliveryMode: 1,
    deliveryCost: 2400,
    rating: 4.7,
    reviews: 66
  },
  {
    productId: "prd-elektrotehnika-i-016",
    sellerName: "TSSP",
    price: 23070,
    availableQuantity: 43,
    deliveryDays: 2,
    deliveryMode: 2,
    deliveryCost: 2300,
    rating: 4.9,
    reviews: 89
  },
  {
    productId: "prd-elektrotehnika-i-016",
    sellerName: "Garwin",
    price: 23770,
    availableQuantity: 188,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 3600,
    rating: 4.7,
    reviews: 321
  },
  {
    productId: "prd-elektrotehnika-i-017",
    price: 23000,
    availableQuantity: 66,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 5,
    reviews: 21
  },
  {
    productId: "prd-elektrotehnika-i-017",
    sellerName: "TSSP",
    price: 23460,
    availableQuantity: 51,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 1800,
    rating: 5,
    reviews: 247
  },
  {
    productId: "prd-elektrotehnika-i-018",
    price: 187500,
    availableQuantity: 5,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 65
  },
  {
    productId: "prd-elektrotehnika-i-018",
    sellerName: "TSSP",
    price: 176250,
    availableQuantity: 143,
    deliveryDays: 2,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 394
  },
  {
    productId: "prd-elektrotehnika-i-019",
    price: 31500,
    availableQuantity: 190,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 40
  },
  {
    productId: "prd-elektrotehnika-i-019",
    sellerName: "Garwin",
    price: 29610,
    availableQuantity: 89,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 142
  },
  {
    productId: "prd-elektrotehnika-i-019",
    sellerName: "Lamed",
    price: 31500,
    availableQuantity: 92,
    deliveryDays: 7,
    deliveryMode: 0,
    deliveryCost: 2500,
    rating: 4.8,
    reviews: 242
  },
  {
    productId: "prd-elektrotehnika-i-019",
    sellerName: "TSSP",
    price: 35280,
    availableQuantity: 152,
    deliveryDays: 1,
    deliveryMode: 1,
    deliveryCost: 2800,
    rating: 4.8,
    reviews: 257
  },
  {
    productId: "prd-elektrotehnika-i-020",
    price: 88500,
    availableQuantity: 26,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 5,
    reviews: 116
  },
  {
    productId: "prd-elektrotehnika-i-020",
    sellerName: "TSSP",
    price: 92040,
    availableQuantity: 64,
    deliveryDays: 1,
    deliveryMode: 0,
    deliveryCost: 1200,
    rating: 5,
    reviews: 303
  },
  {
    productId: "prd-elektrotehnika-i-020",
    sellerName: "Garwin",
    price: 93810,
    availableQuantity: 115,
    deliveryDays: 5,
    deliveryMode: 0,
    deliveryCost: 4200,
    rating: 5,
    reviews: 390
  },
  {
    productId: "prd-elektrotehnika-i-020",
    sellerName: "Lamed",
    price: 87620,
    availableQuantity: 136,
    deliveryDays: 7,
    deliveryMode: 0,
    deliveryCost: 3700,
    rating: 4.8,
    reviews: 207
  },
  {
    productId: "prd-elektrotehnika-i-021",
    price: 36250,
    availableQuantity: 106,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 91
  },
  {
    productId: "prd-elektrotehnika-i-021",
    sellerName: "Garwin",
    price: 38060,
    availableQuantity: 240,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 355
  },
  {
    productId: "prd-elektrotehnika-i-021",
    sellerName: "Lamed",
    price: 41330,
    availableQuantity: 211,
    deliveryDays: 4,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 155
  },
  {
    productId: "prd-elektrotehnika-i-022",
    price: 35500,
    availableQuantity: 90,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 66
  },
  {
    productId: "prd-elektrotehnika-i-022",
    sellerName: "Lamed",
    price: 34080,
    availableQuantity: 235,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 1900,
    rating: 4.6,
    reviews: 71
  },
  {
    productId: "prd-elektrotehnika-i-023",
    price: 40250,
    availableQuantity: 38,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.9,
    reviews: 41
  },
  {
    productId: "prd-elektrotehnika-i-023",
    sellerName: "TSSP",
    price: 37840,
    availableQuantity: 115,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 3000,
    rating: 4.9,
    reviews: 104
  },
  {
    productId: "prd-elektrotehnika-i-023",
    sellerName: "Garwin",
    price: 45890,
    availableQuantity: 215,
    deliveryDays: 3,
    deliveryMode: 1,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 168
  },
  {
    productId: "prd-elektrotehnika-i-023",
    sellerName: "Lamed",
    price: 39850,
    availableQuantity: 24,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 174
  },
  {
    productId: "prd-elektrotehnika-i-024",
    price: 20000,
    availableQuantity: 74,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 5,
    reviews: 47
  },
  {
    productId: "prd-elektrotehnika-i-024",
    sellerName: "Garwin",
    price: 18800,
    availableQuantity: 38,
    deliveryDays: 4,
    deliveryMode: 0,
    deliveryCost: 2200,
    rating: 5,
    reviews: 375
  },
  {
    productId: "prd-elektrotehnika-i-024",
    sellerName: "Lamed",
    price: 19200,
    availableQuantity: 81,
    deliveryDays: 5,
    deliveryMode: 1,
    deliveryCost: 2800,
    rating: 4.8,
    reviews: 213
  },
  {
    productId: "prd-elektrotehnika-i-025",
    price: 71000,
    availableQuantity: 52,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.7,
    reviews: 22
  },
  {
    productId: "prd-elektrotehnika-i-025",
    sellerName: "Lamed",
    price: 69580,
    availableQuantity: 18,
    deliveryDays: 6,
    deliveryMode: 0,
    deliveryCost: 3800,
    rating: 4.7,
    reviews: 242
  },
  {
    productId: "prd-elektrotehnika-i-026",
    price: 88000,
    availableQuantity: 196,
    deliveryDays: 14,
    deliveryCost: 0,
    rating: 4.8,
    reviews: 166
  },
  {
    productId: "prd-elektrotehnika-i-026",
    sellerName: "TSSP",
    price: 94160,
    availableQuantity: 59,
    deliveryDays: 3,
    deliveryMode: 2,
    deliveryCost: 2300,
    rating: 4.8,
    reviews: 134
  },
  {
    productId: "prd-elektrotehnika-i-026",
    sellerName: "Garwin",
    price: 87120,
    availableQuantity: 194,
    deliveryDays: 4,
    deliveryMode: 2,
    deliveryCost: 1200,
    rating: 5,
    reviews: 206
  },
  {
    productId: "prd-elektrotehnika-i-026",
    sellerName: "Lamed",
    price: 83600,
    availableQuantity: 88,
    deliveryDays: 7,
    deliveryMode: 2,
    deliveryCost: 1800,
    rating: 4.6,
    reviews: 64
  }
];

const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export const PRODUCT_OFFERS: ProductOffer[] = OFFER_ROWS.map((row) => {
  const { deliveryMode, ...rest } = row;
  const product = PRODUCT_BY_ID.get(row.productId);

  if (row.sellerName) {
    return {
      ...rest,
      sellerName: row.sellerName,
      isContract: false,
      externalSource: row.sellerName,
      id: `${row.productId}-o-${row.sellerName.toLowerCase()}`,
      deliveryLabel: DELIVERY_MODES[deliveryMode ?? 0],
    };
  }

  // Договорное предложение: продавец — поставщик категории, склад — РЕСХ
  // позиции. Оба выводятся из каталога, чтобы данные не разошлись.
  const supplier = product
    ? supplierOfCategory(rootCategoryId(product.categoryId))
    : undefined;
  const warehouse = product ? warehouseById(product.primaryWarehouseId) : undefined;
  return {
    ...rest,
    sellerName: supplier?.name ?? "Поставщик категории",
    isContract: true,
    id: `${row.productId}-o-contract`,
    deliveryLabel: `Поставка на ${warehouse?.name ?? "РЕСХ региона"}`,
  };
});

const BY_PRODUCT = new Map<string, ProductOffer[]>();
for (const offer of PRODUCT_OFFERS) {
  const list = BY_PRODUCT.get(offer.productId);
  if (list) list.push(offer);
  else BY_PRODUCT.set(offer.productId, [offer]);
}

/** Предложения по позиции в исходном порядке: договорное первым. */
export function offersOfProduct(productId: string): ProductOffer[] {
  return BY_PRODUCT.get(productId) ?? [];
}

export function offerById(offerId: string): ProductOffer | undefined {
  return PRODUCT_OFFERS.find((o) => o.id === offerId);
}

/** Договорное предложение позиции — вариант по умолчанию. */
export function contractOfferOf(productId: string): ProductOffer | undefined {
  return offersOfProduct(productId).find((o) => o.isContract);
}
