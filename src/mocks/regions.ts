import type { Enterprise, Region, Warehouse } from "@/types";

/**
 * География: 4 региона присутствия Группы, предприятия и РЕСХ
 * (региональные единые склады хранения).
 *
 * Предприятия Караганды, Балхаша, Жезказгана и Шатыркуля работают
 * в контуре D365 F&O. ТОО «Казахсервис» — вне D365 F&O: для его заказов
 * маркетплейс работает автономно, ERP-шаги пути заказа (передача в ERP,
 * приём на РЕСХ, перемещение на предприятие) не выполняются.
 */

export const REGIONS: Region[] = [
  {
    id: "reg-krg",
    name: "Карагандинская обл.",
    code: "KRG",
    enterpriseIds: ["ent-krg-kpk", "ent-krg-svc"],
    erp: "d365fo",
    warehouseName: "РЕСХ Караганда",
  },
  {
    id: "reg-blh",
    name: "Балхаш",
    code: "BLH",
    enterpriseIds: ["ent-blh-smelting", "ent-blh-gok"],
    erp: "d365fo",
    warehouseName: "РЕСХ Балхаш",
  },
  {
    id: "reg-zhz",
    name: "Жезказган",
    code: "ZHZ",
    enterpriseIds: ["ent-zhz-gmk"],
    erp: "d365fo",
    warehouseName: "РЕСХ Жезказган",
  },
  {
    id: "reg-chu",
    name: "Чуйская обл. (Шатыркуль)",
    code: "CHU",
    enterpriseIds: ["ent-chu-shatyrkul"],
    erp: "d365fo",
    warehouseName: "РЕСХ Шатыркуль",
  },
];

export const ENTERPRISES: Enterprise[] = [
  {
    id: "ent-krg-kpk",
    name: "Карагандинский производственный комплекс, ТОО «Корпорация Казахмыс»",
    shortName: "КПК Караганда",
    regionId: "reg-krg",
    erp: "d365fo",
    bin: "020140001234",
    workshopIds: ["wsh-krg-drill", "wsh-krg-acc"],
  },
  {
    id: "ent-krg-svc",
    name: "ТОО «Казахсервис»",
    shortName: "Казахсервис",
    regionId: "reg-krg",
    /** Вне D365 F&O: собственная учётная система, ERP-шаги не применяются. */
    erp: "external",
    bin: "051240007788",
    workshopIds: ["wsh-krg-svc"],
  },
  {
    id: "ent-blh-smelting",
    name: "ТОО «Kazakhmys Smelting», Балхашский медеплавильный завод",
    shortName: "Kazakhmys Smelting",
    regionId: "reg-blh",
    erp: "d365fo",
    bin: "030740002561",
    workshopIds: ["wsh-blh-smelt"],
  },
  {
    id: "ent-blh-gok",
    name: "Балхашский горно-обогатительный комплекс",
    shortName: "Балхашский ГОК",
    regionId: "reg-blh",
    erp: "d365fo",
    bin: "030740009914",
    workshopIds: ["wsh-blh-rem"],
  },
  {
    id: "ent-zhz-gmk",
    name: "Жезказганский горно-металлургический комплекс",
    shortName: "ЖГМК",
    regionId: "reg-zhz",
    erp: "d365fo",
    bin: "010340003377",
    workshopIds: ["wsh-zhz-conc"],
  },
  {
    id: "ent-chu-shatyrkul",
    name: "Обогатительная фабрика «Шатыркуль»",
    shortName: "ОФ Шатыркуль",
    regionId: "reg-chu",
    erp: "d365fo",
    bin: "070940005142",
    workshopIds: ["wsh-chu-fab"],
  },
];

export const WAREHOUSES: Warehouse[] = [
  {
    id: "wh-krg",
    name: "РЕСХ Караганда",
    regionId: "reg-krg",
    erpCode: "RESH-KRG-01",
    address: "г. Караганда, ул. Складская, 14",
  },
  {
    id: "wh-blh",
    name: "РЕСХ Балхаш",
    regionId: "reg-blh",
    erpCode: "RESH-BLH-01",
    address: "г. Балхаш, промзона МПЗ, склад 3",
  },
  {
    id: "wh-zhz",
    name: "РЕСХ Жезказган",
    regionId: "reg-zhz",
    erpCode: "RESH-ZHZ-01",
    address: "г. Жезказган, ул. Промышленная, 2/1",
  },
  {
    id: "wh-chu",
    name: "РЕСХ Шатыркуль",
    regionId: "reg-chu",
    erpCode: "RESH-CHU-01",
    address: "Чуйская обл., пос. Шатыркуль, склад ОФ",
  },
];

/** Предприятия, для которых ERP-интеграция не выполняется. */
export const ENTERPRISES_OUTSIDE_ERP = ENTERPRISES.filter(
  (e) => e.erp === "external"
).map((e) => e.id);

export function regionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

export function enterpriseById(id: string): Enterprise | undefined {
  return ENTERPRISES.find((e) => e.id === id);
}

export function warehouseById(id: string): Warehouse | undefined {
  return WAREHOUSES.find((w) => w.id === id);
}

/** Работает ли предприятие вне контура D365 F&O. */
export function isOutsideErp(enterpriseId: string): boolean {
  return ENTERPRISES_OUTSIDE_ERP.includes(enterpriseId);
}
