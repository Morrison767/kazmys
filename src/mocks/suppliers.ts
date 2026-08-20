import type { Supplier } from "@/types";

/**
 * Поставщики — по одному на категорию закупа (модель «один поставщик
 * на категорию»). Поставщик выбирается тендером через СЭТ, с ним
 * заключается рамочный договор на год, из его номенклатуры формируется
 * каталог маркетплейса.
 *
 * Статусы договоров подобраны для демонстрации на админ-панели:
 * — Канцелярия, Хозтовары — действуют;
 * — Инструменты — истекает 15.09.2026 (менее 30 дней);
 * — Прочие — истёк 30.06.2026, категория требует нового тендера;
 * — Электротехника — тендер проведён, договор в подписании (проект).
 *
 * normativeDeliveryDays — нормативный срок поставки по договору: канцелярия
 * и хозтовары со склада поставщика (7 дней), инструмент под заказ (10 дней),
 * СИЗ и абразивы (8 дней), электротехника (14 дней).
 */
export const SUPPLIERS: Supplier[] = [
  {
    id: "sup-office",
    name: "ТОО «Канц-Маркет Казахстан»",
    bin: "150340012477",
    categoryId: "cat-office",
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
    productCount: 14,
  },
  {
    id: "sup-household",
    name: "ТОО «Тазалык Сервис»",
    bin: "170640033812",
    categoryId: "cat-household",
    contractNumber: "ТД-2026-Х-027",
    contractDateFrom: "2026-02-15",
    contractDateTo: "2027-02-14",
    contractStatus: "active",
    tenderNumber: "СЭТ-2026-01-0182",
    nomenclatureCoverage: 88,
    normativeDeliveryDays: 7,
    contactPerson: "Ким Виктор Анатольевич",
    contactPhone: "+7 (7172) 60-24-15",
    contactEmail: "sales@tazalyk.kz",
    productCount: 12,
  },
  {
    id: "sup-tools",
    name: "ТОО «Промснаб Инструмент»",
    bin: "090240008165",
    categoryId: "cat-tools",
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
    productCount: 15,
  },
  {
    id: "sup-other",
    name: "ТОО «Казахстан Индастриал Групп»",
    bin: "120540021903",
    categoryId: "cat-other",
    contractNumber: "ТД-2025-П-058",
    contractDateFrom: "2025-07-01",
    /** Срок вышел: заказ новых позиций категории заблокирован. */
    contractDateTo: "2026-06-30",
    contractStatus: "expired",
    tenderNumber: "СЭТ-2025-05-2094",
    nomenclatureCoverage: 79,
    normativeDeliveryDays: 8,
    contactPerson: "Ахметжанов Тимур Русланович",
    contactPhone: "+7 (7102) 33-56-41",
    contactEmail: "b2b@kig.kz",
    productCount: 13,
  },
  {
    id: "sup-electro",
    name: "ТОО «ЭнергоКомплект Астана»",
    bin: "200140044526",
    categoryId: "cat-electro",
    contractNumber: "ТД-2026-Э-003 (проект)",
    contractDateFrom: "2026-09-01",
    contractDateTo: "2027-08-31",
    /** Тендер проведён, договор на согласовании — каталог ещё не загружен. */
    contractStatus: "draft",
    tenderNumber: "СЭТ-2026-06-1908",
    nomenclatureCoverage: 86,
    normativeDeliveryDays: 14,
    contactPerson: "Оралбаев Санжар Маратович",
    contactPhone: "+7 (7172) 78-90-33",
    contactEmail: "kazakhmys@energokomplekt.kz",
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
