import type { Category } from "@/types";

/**
 * Категории каталога по этапности разворачивания из концепции.
 * Верхний уровень — категория закупа: на него заключается рамочный договор
 * («один поставщик на категорию») и на него настраиваются лимиты цехов.
 * Второй уровень — подгруппы для навигации по каталогу; товары привязаны
 * к подгруппам (см. products.ts).
 *
 * Категории этапа «Далее» заведены, но неактивны: тендер не проведён,
 * поставщика и каталога у них ещё нет.
 */
export const CATEGORIES: Category[] = [
  // ——— Пилот: Канцелярия ———
  {
    id: "cat-office",
    name: "Канцелярия",
    parentId: null,
    stage: "pilot",
    isActive: true,
    icon: "PenTool",
    description: "Бумага, письменные принадлежности, картриджи, папки",
  },
  {
    id: "cat-office-paper",
    name: "Бумага и бланки",
    parentId: "cat-office",
    stage: "pilot",
    isActive: true,
  },
  {
    id: "cat-office-write",
    name: "Письменные принадлежности",
    parentId: "cat-office",
    stage: "pilot",
    isActive: true,
  },
  {
    id: "cat-office-print",
    name: "Картриджи и расходники печати",
    parentId: "cat-office",
    stage: "pilot",
    isActive: true,
  },
  {
    id: "cat-office-archive",
    name: "Папки и архивное хранение",
    parentId: "cat-office",
    stage: "pilot",
    isActive: true,
  },

  // ——— Этап 2: Хозтовары ———
  {
    id: "cat-household",
    name: "Хозтовары",
    parentId: null,
    stage: "stage2",
    isActive: true,
    icon: "SprayCan",
    description: "Средства уборки, моющие средства, лампы, расходные материалы",
  },
  {
    id: "cat-household-clean",
    name: "Средства и инвентарь уборки",
    parentId: "cat-household",
    stage: "stage2",
    isActive: true,
  },
  {
    id: "cat-household-wash",
    name: "Моющие и дезинфицирующие средства",
    parentId: "cat-household",
    stage: "stage2",
    isActive: true,
  },
  {
    id: "cat-household-lamps",
    name: "Лампы и расходники",
    parentId: "cat-household",
    stage: "stage2",
    isActive: true,
  },

  // ——— Этап 3: Инструменты ———
  {
    id: "cat-tools",
    name: "Инструменты",
    parentId: null,
    stage: "stage3",
    isActive: true,
    icon: "Wrench",
    description: "Электроинструмент, пневмоинструмент, ручной инструмент",
  },
  {
    id: "cat-tools-power",
    name: "Электроинструмент",
    parentId: "cat-tools",
    stage: "stage3",
    isActive: true,
  },
  {
    id: "cat-tools-pneumo",
    name: "Пневмоинструмент",
    parentId: "cat-tools",
    stage: "stage3",
    isActive: true,
  },
  {
    id: "cat-tools-hand",
    name: "Ручной инструмент",
    parentId: "cat-tools",
    stage: "stage3",
    isActive: true,
  },
  {
    id: "cat-tools-consumables",
    name: "Оснастка и расходники инструмента",
    parentId: "cat-tools",
    stage: "stage3",
    isActive: true,
  },

  // ——— Этап 4: Прочие ———
  {
    id: "cat-other",
    name: "Прочие",
    parentId: null,
    stage: "stage4",
    isActive: true,
    icon: "HardHat",
    description: "Измерительные приборы, СИЗ, абразивы",
  },
  {
    id: "cat-other-ppe",
    name: "СИЗ",
    parentId: "cat-other",
    stage: "stage4",
    isActive: true,
  },
  {
    id: "cat-other-measure",
    name: "Измерительные приборы",
    parentId: "cat-other",
    stage: "stage4",
    isActive: true,
  },
  {
    id: "cat-other-abrasive",
    name: "Абразивы",
    parentId: "cat-other",
    stage: "stage4",
    isActive: true,
  },

  // ——— Далее: расширение (тендер не проведён, каталога нет) ———
  {
    id: "cat-electro",
    name: "Электротехника",
    parentId: null,
    stage: "next",
    isActive: false,
    icon: "Zap",
    description: "Подключение после проведения тендера и заключения договора",
  },
  {
    id: "cat-kip",
    name: "КИП",
    parentId: null,
    stage: "next",
    isActive: false,
    icon: "Gauge",
    description: "Контрольно-измерительные приборы и автоматика",
  },
  {
    id: "cat-build",
    name: "Стройматериалы",
    parentId: null,
    stage: "next",
    isActive: false,
    icon: "Blocks",
  },
  {
    id: "cat-cable",
    name: "Кабельная продукция",
    parentId: null,
    stage: "next",
    isActive: false,
    icon: "Cable",
  },
];

/** Категории закупа верхнего уровня (на них — договоры и лимиты). */
export const ROOT_CATEGORY_IDS = CATEGORIES.filter(
  (c) => c.parentId === null
).map((c) => c.id);

/** Категории, доступные для заказа сейчас (пилот + этапы 2–4). */
export const ACTIVE_ROOT_CATEGORY_IDS = CATEGORIES.filter(
  (c) => c.parentId === null && c.isActive
).map((c) => c.id);

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/**
 * Категория закупа верхнего уровня для любой категории.
 * Нужна, чтобы от подгруппы товара перейти к лимиту цеха и поставщику.
 */
export function rootCategoryId(categoryId: string): string {
  let current = categoryById(categoryId);
  while (current?.parentId) {
    current = categoryById(current.parentId);
  }
  return current?.id ?? categoryId;
}

/** Идентификаторы категории и всех её подгрупп — для фильтров каталога. */
export function categoryWithDescendantIds(categoryId: string): string[] {
  const result = [categoryId];
  const queue = [categoryId];
  while (queue.length > 0) {
    const parentId = queue.shift()!;
    for (const child of CATEGORIES.filter((c) => c.parentId === parentId)) {
      result.push(child.id);
      queue.push(child.id);
    }
  }
  return result;
}

/** Подгруппы категории (второй уровень). */
export function childCategories(parentId: string): Category[] {
  return CATEGORIES.filter((c) => c.parentId === parentId);
}
