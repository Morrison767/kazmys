import type { Supplier } from "@/types";

/**
 * Поставщики — по одному на категорию закупа верхнего уровня (модель
 * «один поставщик на категорию»). Поставщик выбирается тендером через СЭТ,
 * с ним заключается рамочный договор, из его номенклатуры формируется
 * каталог маркетплейса.
 *
 * Категории — реальные разделы номенклатуры склада (см. categories.ts).
 * Реквизиты поставщиков и договоров — демонстрационные.
 *
 * Статусы договоров подобраны для демонстрации на админ-панели:
 * — Канцелярия/хозтовары, спецодежда, расходники, электротехника — действуют;
 * — Инструменты — истекает 15.09.2026 (менее 30 дней);
 * — Метизы — истёк 30.06.2026, категория требует нового тендера;
 * — КИП — тендер проведён, договор в подписании (проект).
 *
 * normativeDeliveryDays — нормативный срок поставки по договору, дней.
 */
export const SUPPLIERS: Supplier[] = [
  {
    id: "sup-hoz",
    name: "ТОО «Канц-Маркет Казахстан»",
    bin: "150340012477",
    categoryId: "cat-hozyaystvennye-ofisnye",
    contractNumber: "ТД-2026-К-014",
    contractDateFrom: "2026-01-01",
    contractDateTo: "2026-12-31",
    contractStatus: "active",
    tenderNumber: "СЭТ-2025-11-4471",
    nomenclatureCoverage: 94,
    normativeDeliveryDays: 7,
    contactPerson: "Смагулова Айгерим Бекболатовна",
    contactPhone: "+7 (7212) 45-18-90",
    contactEmail: "tender@kanc-market.kz",
    productCount: 25,
  },
  {
    id: "sup-ppe",
    name: "ТОО «Казспецодежда Караганда»",
    bin: "180240055913",
    categoryId: "cat-specodezhda-i",
    contractNumber: "ТД-2026-С-031",
    contractDateFrom: "2026-03-01",
    contractDateTo: "2027-02-28",
    contractStatus: "active",
    tenderNumber: "СЭТ-2026-01-0347",
    nomenclatureCoverage: 92,
    normativeDeliveryDays: 12,
    contactPerson: "Тулегенова Мадина Аскаровна",
    contactPhone: "+7 (7212) 50-33-71",
    contactEmail: "sales@kazspecodezhda.kz",
    productCount: 27,
  },
  {
    id: "sup-tools",
    name: "ТОО «Промснаб Инструмент»",
    bin: "090240008165",
    categoryId: "cat-instrumenty-i",
    contractNumber: "ТД-2025-И-091",
    contractDateFrom: "2025-09-16",
    /** Истекает менее чем через 30 дней — нужен новый тендер. */
    contractDateTo: "2026-09-15",
    contractStatus: "expiring",
    tenderNumber: "СЭТ-2025-08-3320",
    nomenclatureCoverage: 91,
    normativeDeliveryDays: 10,
    contactPerson: "Нурпеисов Дархан Ерикович",
    contactPhone: "+7 (7212) 41-77-02",
    contactEmail: "kazakhmys@promsnab-tool.kz",
    productCount: 24,
  },
  {
    id: "sup-consumables",
    name: "ТОО «Абразив-Снаб KZ»",
    bin: "140540019822",
    categoryId: "cat-rashodnye-materialy",
    contractNumber: "ТД-2026-Р-052",
    contractDateFrom: "2026-02-01",
    contractDateTo: "2027-01-31",
    contractStatus: "active",
    tenderNumber: "СЭТ-2025-12-4890",
    nomenclatureCoverage: 88,
    normativeDeliveryDays: 8,
    contactPerson: "Исаев Руслан Валерьевич",
    contactPhone: "+7 (7102) 28-14-60",
    contactEmail: "b2b@abraziv-snab.kz",
    productCount: 27,
  },
  {
    id: "sup-fasteners",
    name: "ТОО «Метиз Групп»",
    bin: "110640027341",
    categoryId: "cat-metizy-i",
    contractNumber: "ТД-2025-М-066",
    contractDateFrom: "2025-07-01",
    /** Срок вышел: заказ позиций категории требует нового договора. */
    contractDateTo: "2026-06-30",
    contractStatus: "expired",
    tenderNumber: "СЭТ-2025-05-2094",
    nomenclatureCoverage: 84,
    normativeDeliveryDays: 6,
    contactPerson: "Ахметжанов Тимур Русланович",
    contactPhone: "+7 (7212) 33-56-41",
    contactEmail: "info@metiz-group.kz",
    productCount: 25,
  },
  {
    id: "sup-electro",
    name: "ТОО «ЭнергоКомплект Астана»",
    bin: "200140044526",
    categoryId: "cat-elektrotehnika-i",
    contractNumber: "ТД-2026-Э-008",
    contractDateFrom: "2026-04-01",
    contractDateTo: "2027-03-31",
    contractStatus: "active",
    tenderNumber: "СЭТ-2026-02-1908",
    nomenclatureCoverage: 86,
    normativeDeliveryDays: 14,
    contactPerson: "Оралбаев Санжар Маратович",
    contactPhone: "+7 (7172) 78-90-33",
    contactEmail: "kazakhmys@energokomplekt.kz",
    productCount: 26,
  },
  {
    id: "sup-kip",
    name: "ТОО «КИП-Автоматика Сервис»",
    bin: "210340066178",
    categoryId: "cat-kip",
    contractNumber: "ТД-2026-КИП-002 (проект)",
    contractDateFrom: "2026-09-01",
    contractDateTo: "2027-08-31",
    /** Тендер проведён, договор на согласовании — каталог ещё не загружен. */
    contractStatus: "draft",
    tenderNumber: "СЭТ-2026-06-2255",
    nomenclatureCoverage: 81,
    normativeDeliveryDays: 21,
    contactPerson: "Сериков Бауыржан Ерланович",
    contactPhone: "+7 (7172) 55-12-08",
    contactEmail: "tender@kip-avtomatika.kz",
    productCount: 0,
  },
];

export function supplierById(id: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.id === id);
}

/** Поставщик категории закупа — один на категорию. */
export function supplierOfCategory(categoryId: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.categoryId === categoryId);
}
