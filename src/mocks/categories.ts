import type { Category } from "@/types";

/**
 * Категории каталога — трёхуровневое дерево реальной номенклатуры склада
 * (источник: SMAT, https://smat.amvp.kz, проект «СМАТ V2»).
 *
 * Уровень 1 — категория закупа: на неё заключается рамочный договор
 * («один поставщик на категорию»), настраиваются лимиты цехов и доступ
 * по типу товара. Уровень 2 — группа, уровень 3 — вид; позиции каталога
 * привязаны к видам (см. products.ts).
 *
 * ФАЙЛ СГЕНЕРИРОВАН: scripts/generate-catalog.mjs из data/smat-selection.json.
 * Правки вносите в скрипт или в выборку, а не в этот файл.
 */
export const CATEGORIES: Category[] = [
  {
    id: "cat-hozyaystvennye-ofisnye",
    name: "Хозяйственные, офисные и канцелярские товары",
    parentId: null,
    stage: "pilot",
    isActive: true,
    icon: "PenTool",
    description: "3 групп(ы) номенклатуры"
  },
  {
    id: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary",
    name: "Канцелярские товары",
    parentId: "cat-hozyaystvennye-ofisnye",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-blanki",
    name: "Бланки и формы",
    parentId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-papki",
    name: "Папки",
    parentId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-ruchki",
    name: "Ручки и карандаши",
    parentId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-posuda-i",
    name: "Посуда и столовые приборы",
    parentId: "cat-hozyaystvennye-ofisnye",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-posuda-i-tarelki",
    name: "Тарелки",
    parentId: "cat-hozyaystvennye-ofisnye-posuda-i",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-posuda-i-stolovye",
    name: "Столовые приборы",
    parentId: "cat-hozyaystvennye-ofisnye-posuda-i",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-posuda-i-kuhonnyy",
    name: "Кухонный инвентарь",
    parentId: "cat-hozyaystvennye-ofisnye-posuda-i",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie",
    name: "Офисное оборудование и техника",
    parentId: "cat-hozyaystvennye-ofisnye",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-kartridzhi",
    name: "Картриджи для принтеров",
    parentId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-printery",
    name: "Принтеры",
    parentId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-stiralnye",
    name: "Стиральные машины",
    parentId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie",
    stage: "pilot",
    isActive: true
  },
  {
    id: "cat-specodezhda-i",
    name: "Спецодежда и средства защиты",
    parentId: null,
    stage: "stage2",
    isActive: true,
    icon: "HardHat",
    description: "3 групп(ы) номенклатуры"
  },
  {
    id: "cat-specodezhda-i-kostyumy-i",
    name: "Костюмы и комплекты",
    parentId: "cat-specodezhda-i",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-kostyumy-i-uteplennye",
    name: "Утепленные костюмы",
    parentId: "cat-specodezhda-i-kostyumy-i",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-kostyumy-i-zaschitnye",
    name: "Защитные костюмы от электрической дуги",
    parentId: "cat-specodezhda-i-kostyumy-i",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-kostyumy-i-letnie",
    name: "Летние костюмы",
    parentId: "cat-specodezhda-i-kostyumy-i",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-specobuv",
    name: "Спецобувь",
    parentId: "cat-specodezhda-i",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-specobuv-zaschitnaya",
    name: "Защитная спецобувь",
    parentId: "cat-specodezhda-i-specobuv",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-specobuv-rezinovye",
    name: "Резиновые сапоги",
    parentId: "cat-specodezhda-i-specobuv",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-specobuv-slipony",
    name: "Слипоны и легкая спецобувь",
    parentId: "cat-specodezhda-i-specobuv",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-rabochaya-odezhda",
    name: "Рабочая одежда",
    parentId: "cat-specodezhda-i",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-rabochaya-odezhda-uteplennye",
    name: "Утепленные жилеты",
    parentId: "cat-specodezhda-i-rabochaya-odezhda",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-rabochaya-odezhda-natelnoe",
    name: "Нательное белье",
    parentId: "cat-specodezhda-i-rabochaya-odezhda",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-specodezhda-i-rabochaya-odezhda-rabochie",
    name: "Рабочие халаты",
    parentId: "cat-specodezhda-i-rabochaya-odezhda",
    stage: "stage2",
    isActive: true
  },
  {
    id: "cat-instrumenty-i",
    name: "Инструменты и измерительная техника",
    parentId: null,
    stage: "stage3",
    isActive: true,
    icon: "Wrench",
    description: "3 групп(ы) номенклатуры"
  },
  {
    id: "cat-instrumenty-i-kontrolno-izmeritelnye",
    name: "Контрольно-измерительные приборы",
    parentId: "cat-instrumenty-i",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-kontrolno-izmeritelnye-manometry",
    name: "Манометры",
    parentId: "cat-instrumenty-i-kontrolno-izmeritelnye",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-kontrolno-izmeritelnye-pribory",
    name: "Приборы для контроля электрооборудования",
    parentId: "cat-instrumenty-i-kontrolno-izmeritelnye",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-metallorezhuschiy-inst",
    name: "Металлорежущий инструмент",
    parentId: "cat-instrumenty-i",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-metallorezhuschiy-inst-sverla",
    name: "Сверла",
    parentId: "cat-instrumenty-i-metallorezhuschiy-inst",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-metallorezhuschiy-inst-frezy",
    name: "Фрезы",
    parentId: "cat-instrumenty-i-metallorezhuschiy-inst",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-metallorezhuschiy-inst-metchiki",
    name: "Метчики",
    parentId: "cat-instrumenty-i-metallorezhuschiy-inst",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-ruchnoy-instrument",
    name: "Ручной инструмент",
    parentId: "cat-instrumenty-i",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-ruchnoy-instrument-gaechnye",
    name: "Гаечные ключи",
    parentId: "cat-instrumenty-i-ruchnoy-instrument",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-ruchnoy-instrument-otvertki",
    name: "Отвертки",
    parentId: "cat-instrumenty-i-ruchnoy-instrument",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-instrumenty-i-ruchnoy-instrument-napilniki",
    name: "Напильники",
    parentId: "cat-instrumenty-i-ruchnoy-instrument",
    stage: "stage3",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy",
    name: "Расходные материалы и оснастка",
    parentId: null,
    stage: "stage4",
    isActive: true,
    icon: "Disc3",
    description: "3 групп(ы) номенклатуры"
  },
  {
    id: "cat-rashodnye-materialy-instrumentalnaya-osnas",
    name: "Инструментальная оснастка",
    parentId: "cat-rashodnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-instrumentalnaya-osnas-tverdosplavnye",
    name: "Твердосплавные пластины",
    parentId: "cat-rashodnye-materialy-instrumentalnaya-osnas",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-instrumentalnaya-osnas-burovye",
    name: "Буровые коронки",
    parentId: "cat-rashodnye-materialy-instrumentalnaya-osnas",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-instrumentalnaya-osnas-cangi",
    name: "Цанги",
    parentId: "cat-rashodnye-materialy-instrumentalnaya-osnas",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-abrazivnye-materialy",
    name: "Абразивные материалы",
    parentId: "cat-rashodnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-abrazivnye-materialy-shlifovalnye",
    name: "Шлифовальные круги",
    parentId: "cat-rashodnye-materialy-abrazivnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-abrazivnye-materialy-shlifovalnye-2",
    name: "Шлифовальные шкурки",
    parentId: "cat-rashodnye-materialy-abrazivnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-abrazivnye-materialy-provolochnye",
    name: "Проволочные ерши",
    parentId: "cat-rashodnye-materialy-abrazivnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-rashodnye-materialy",
    name: "Расходные материалы для резки и сварки",
    parentId: "cat-rashodnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-rashodnye-materialy-svarochnye",
    name: "Сварочные электроды",
    parentId: "cat-rashodnye-materialy-rashodnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-rashodnye-materialy-rashodnye",
    name: "Расходные материалы для сварочных горелок",
    parentId: "cat-rashodnye-materialy-rashodnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-rashodnye-materialy-rashodnye-materialy-sopla",
    name: "Сопла для резки",
    parentId: "cat-rashodnye-materialy-rashodnye-materialy",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i",
    name: "Метизы и крепежные изделия",
    parentId: null,
    stage: "stage4",
    isActive: true,
    icon: "Bolt",
    description: "3 групп(ы) номенклатуры"
  },
  {
    id: "cat-metizy-i-izdeliya-rezbovye",
    name: "Изделия резьбовые",
    parentId: "cat-metizy-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-izdeliya-rezbovye-bolty",
    name: "Болты",
    parentId: "cat-metizy-i-izdeliya-rezbovye",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-izdeliya-rezbovye-gayki",
    name: "Гайки",
    parentId: "cat-metizy-i-izdeliya-rezbovye",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-izdeliya-rezbovye-shayby",
    name: "Шайбы",
    parentId: "cat-metizy-i-izdeliya-rezbovye",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-zazhimy-i",
    name: "Зажимы и хомуты",
    parentId: "cat-metizy-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-zazhimy-i-homuty",
    name: "Хомуты",
    parentId: "cat-metizy-i-zazhimy-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-zazhimy-i-podderzhivayuschie",
    name: "Поддерживающие зажимы",
    parentId: "cat-metizy-i-zazhimy-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-zazhimy-i-kanatnye",
    name: "Канатные зажимы",
    parentId: "cat-metizy-i-zazhimy-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-specialnyy-krepezh",
    name: "Специальный крепеж",
    parentId: "cat-metizy-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-specialnyy-krepezh-proushiny",
    name: "Проушины",
    parentId: "cat-metizy-i-specialnyy-krepezh",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-specialnyy-krepezh-montazhnye",
    name: "Монтажные клинья",
    parentId: "cat-metizy-i-specialnyy-krepezh",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-metizy-i-specialnyy-krepezh-shponki",
    name: "Шпонки",
    parentId: "cat-metizy-i-specialnyy-krepezh",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i",
    name: "Электротехника и автоматизация",
    parentId: null,
    stage: "stage4",
    isActive: true,
    icon: "Zap",
    description: "3 групп(ы) номенклатуры"
  },
  {
    id: "cat-elektrotehnika-i-promyshlennaya-avtomat",
    name: "Промышленная автоматика и безопасность",
    parentId: "cat-elektrotehnika-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-promyshlennaya-avtomat-avtomaticheskie",
    name: "Автоматические выключатели",
    parentId: "cat-elektrotehnika-i-promyshlennaya-avtomat",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-promyshlennaya-avtomat-datchiki",
    name: "Датчики температуры",
    parentId: "cat-elektrotehnika-i-promyshlennaya-avtomat",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-promyshlennaya-avtomat-pereklyuchateli",
    name: "Переключатели",
    parentId: "cat-elektrotehnika-i-promyshlennaya-avtomat",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-elektromontazhnye-izde",
    name: "Электромонтажные изделия",
    parentId: "cat-elektrotehnika-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-elektromontazhnye-izde-klemmy",
    name: "Клеммы электрические",
    parentId: "cat-elektrotehnika-i-elektromontazhnye-izde",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-elektromontazhnye-izde-elektrotehnicheskie",
    name: "Электротехнические шкафы и корпуса",
    parentId: "cat-elektrotehnika-i-elektromontazhnye-izde",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-elektromontazhnye-izde-elektricheskie",
    name: "Электрические разъемы",
    parentId: "cat-elektrotehnika-i-elektromontazhnye-izde",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-silovaya-elektronika",
    name: "Силовая электроника и компоненты",
    parentId: "cat-elektrotehnika-i",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-silovaya-elektronika-istochniki",
    name: "Источники питания",
    parentId: "cat-elektrotehnika-i-silovaya-elektronika",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-silovaya-elektronika-promezhutochnye",
    name: "Промежуточные реле",
    parentId: "cat-elektrotehnika-i-silovaya-elektronika",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-elektrotehnika-i-silovaya-elektronika-puskateli",
    name: "Пускатели",
    parentId: "cat-elektrotehnika-i-silovaya-elektronika",
    stage: "stage4",
    isActive: true
  },
  {
    id: "cat-kip",
    name: "КИП и автоматика",
    parentId: null,
    stage: "next",
    isActive: false,
    icon: "Gauge",
    description: "Подключается после тендера и заключения рамочного договора"
  },
  {
    id: "cat-stroymaterialy",
    name: "Стройматериалы",
    parentId: null,
    stage: "next",
    isActive: false,
    icon: "Blocks",
    description: "Подключается после тендера и заключения рамочного договора"
  },
  {
    id: "cat-kabelnaya",
    name: "Кабельная продукция",
    parentId: null,
    stage: "next",
    isActive: false,
    icon: "Cable",
    description: "Подключается после тендера и заключения рамочного договора"
  }
];

/** Категории закупа верхнего уровня (на них — договоры и лимиты). */
export const ROOT_CATEGORY_IDS = CATEGORIES.filter(
  (c) => c.parentId === null
).map((c) => c.id);

/** Категории, доступные для заказа сейчас. */
export const ACTIVE_ROOT_CATEGORY_IDS = CATEGORIES.filter(
  (c) => c.parentId === null && c.isActive
).map((c) => c.id);

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

/**
 * Категория закупа верхнего уровня для любой категории дерева.
 * Нужна, чтобы от вида товара перейти к лимиту цеха и поставщику.
 */
export function rootCategoryId(categoryId: string): string {
  let current = categoryById(categoryId);
  while (current?.parentId) {
    current = categoryById(current.parentId);
  }
  return current?.id ?? categoryId;
}

/** Идентификаторы категории и всех вложенных — для фильтров каталога. */
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

/** Дочерние категории (группы для раздела, виды для группы). */
export function childCategories(parentId: string): Category[] {
  return CATEGORIES.filter((c) => c.parentId === parentId);
}

/** Уровень категории в дереве: 1 — раздел, 2 — группа, 3 — вид. */
export function categoryLevel(categoryId: string): number {
  let level = 1;
  let current = categoryById(categoryId);
  while (current?.parentId) {
    level += 1;
    current = categoryById(current.parentId);
  }
  return level;
}

/** Листовые категории — только в них добавляются позиции каталога. */
export function leafCategories(): Category[] {
  return CATEGORIES.filter(
    (c) => c.isActive && !CATEGORIES.some((child) => child.parentId === c.id)
  );
}

/** Путь категории для витрины: «Раздел / Группа / Вид». */
export function categoryPath(categoryId: string): string {
  const parts: string[] = [];
  let current = categoryById(categoryId);
  while (current) {
    parts.unshift(current.name);
    current = current.parentId ? categoryById(current.parentId) : undefined;
  }
  return parts.join(" / ");
}
