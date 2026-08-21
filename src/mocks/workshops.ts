import type { Workshop } from "@/types";

/**
 * Цеха и участки — единицы потребления и точки контроля лимитов.
 * allowedCategoryIds реализует ограничение «по типу товара»: буровой
 * участок видит инструмент, оснастку, метизы и СИЗ, но не канцелярию;
 * бухгалтерия — только хозяйственные и офисные товары.
 *
 * Указываются категории закупа верхнего уровня (разделы номенклатуры);
 * группы и виды разворачиваются от них — см. categories.ts.
 */
export const WORKSHOPS: Workshop[] = [
  {
    id: "wsh-krg-drill",
    name: "Буровой участок №1",
    enterpriseId: "ent-krg-kpk",
    regionId: "reg-krg",
    costCenter: "KRG-BU-01",
    allowedCategoryIds: [
      "cat-instrumenty-i",
      "cat-rashodnye-materialy",
      "cat-metizy-i",
      "cat-specodezhda-i",
    ],
    defaultWarehouseId: "wh-krg",
  },
  {
    id: "wsh-krg-acc",
    name: "Бухгалтерия и АУП",
    enterpriseId: "ent-krg-kpk",
    regionId: "reg-krg",
    costCenter: "KRG-AUP-04",
    allowedCategoryIds: ["cat-hozyaystvennye-ofisnye"],
    defaultWarehouseId: "wh-krg",
  },
  {
    id: "wsh-krg-svc",
    name: "Сервисный участок (Казахсервис)",
    /** Предприятие вне D365 F&O — заказы идут по упрощённому пути. */
    enterpriseId: "ent-krg-svc",
    regionId: "reg-krg",
    allowedCategoryIds: [
      "cat-hozyaystvennye-ofisnye",
      "cat-instrumenty-i",
      "cat-elektrotehnika-i",
    ],
    defaultWarehouseId: "wh-krg",
  },
  {
    id: "wsh-blh-smelt",
    name: "Плавильный цех №2",
    enterpriseId: "ent-blh-smelting",
    regionId: "reg-blh",
    costCenter: "BLH-PC-02",
    allowedCategoryIds: [
      "cat-specodezhda-i",
      "cat-rashodnye-materialy",
      "cat-elektrotehnika-i",
    ],
    defaultWarehouseId: "wh-blh",
  },
  {
    id: "wsh-blh-rem",
    name: "Ремонтно-механический цех",
    enterpriseId: "ent-blh-gok",
    regionId: "reg-blh",
    costCenter: "BLH-RMC-01",
    allowedCategoryIds: [
      "cat-instrumenty-i",
      "cat-rashodnye-materialy",
      "cat-metizy-i",
      "cat-elektrotehnika-i",
    ],
    defaultWarehouseId: "wh-blh",
  },
  {
    id: "wsh-zhz-conc",
    name: "Обогатительный цех",
    enterpriseId: "ent-zhz-gmk",
    regionId: "reg-zhz",
    costCenter: "ZHZ-OC-03",
    allowedCategoryIds: ["cat-instrumenty-i", "cat-rashodnye-materialy"],
    defaultWarehouseId: "wh-zhz",
  },
  {
    id: "wsh-chu-fab",
    name: "Участок обогащения «Шатыркуль»",
    enterpriseId: "ent-chu-shatyrkul",
    regionId: "reg-chu",
    costCenter: "CHU-UO-01",
    allowedCategoryIds: [
      "cat-specodezhda-i",
      "cat-hozyaystvennye-ofisnye",
      "cat-rashodnye-materialy",
    ],
    defaultWarehouseId: "wh-chu",
  },
];

export function workshopById(id: string): Workshop | undefined {
  return WORKSHOPS.find((w) => w.id === id);
}

/** Может ли цех заказывать категорию закупа (ограничение по типу товара). */
export function isCategoryAllowedForWorkshop(
  workshopId: string,
  rootCategoryId: string
): boolean {
  return Boolean(
    workshopById(workshopId)?.allowedCategoryIds.includes(rootCategoryId)
  );
}
