/**
 * Генерация каталога прототипа из выборки SMAT.
 *
 * Вход:  data/smat-selection.json (см. scripts/import-smat.mjs)
 * Выход: src/mocks/categories.ts, src/mocks/products.ts
 *
 * Что берётся из источника: трёхуровневое дерево категорий и названия позиций
 * (реальная номенклатура склада Казахмыса).
 * Что генерируется здесь: артикулы, коды номенклатуры, цены, единицы
 * измерения, остатки на РЕСХ и нормативные сроки службы — в источнике их нет.
 * Генерация детерминированная (хеш от названия), поэтому повторный запуск
 * даёт тот же каталог.
 *
 * Запуск: node scripts/generate-catalog.mjs
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const selection = JSON.parse(readFileSync("data/smat-selection.json", "utf8"));

/**
 * Фотографии части позиций — свободные изображения с Wikimedia Commons
 * (см. scripts/fetch-images.mjs и public/products/ATTRIBUTION.md).
 * В источнике номенклатуры изображений нет.
 */
const IMAGES = existsSync("data/product-images.json")
  ? JSON.parse(readFileSync("data/product-images.json", "utf8"))
  : {};

/* ————————————————————— Транслитерация для id ————————————————————— */

const TRANSLIT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slug(text, maxWords = 2) {
  return text
    .toLowerCase()
    .split(/[^а-яёa-z0-9]+/i)
    .filter(Boolean)
    .slice(0, maxWords)
    .map((word) =>
      [...word].map((ch) => TRANSLIT[ch] ?? (/[a-z0-9]/.test(ch) ? ch : "")).join("")
    )
    .filter(Boolean)
    .join("-")
    .slice(0, 22);
}

/** Детерминированный хеш строки — вместо случайных чисел. */
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Значение из диапазона, детерминированно по строке. */
function pick(text, min, max, step = 1) {
  const span = Math.floor((max - min) / step) + 1;
  return min + (hash(text) % span) * step;
}

/* ————————————————— Читаемые названия из КАПСА ————————————————— */

/** Аббревиатуры, которые остаются в верхнем регистре. */
const KEEP_UPPER = new Set([
  "ГОСТ", "ТУ", "ОСТ", "СТ", "ИТР", "СИЗ", "КИП", "ПВХ", "ХБ", "ЭПУ", "РРК",
  "ОШ", "ЦСМ", "КЗ", "ЦВ", "ЧБ", "УФ", "РШ", "СМ", "ММ", "КГ", "МПА", "КАЛ",
  "ЭС", "АС", "РЕСХ", "ЦНС", "УУ", "МП",
]);

/** Служебные слова: внутри названия идут строчными. */
const LOWER_WORDS = new Set([
  "НА", "ДЛЯ", "ОТ", "С", "И", "В", "ПО", "БЕЗ", "ИЗ", "ДО", "ПРИ", "ЗА",
  "НАД", "ПОД", "ИЛИ", "К", "СО", "ВО",
]);

/**
 * Номенклатура хранится в верхнем регистре («МАНОМЕТР МП2-УФ 0-1МПА»).
 * Приводим к обычному виду: маркировки, латиница, цифры и аббревиатуры
 * остаются как есть, остальные слова — строчными, первая буква заглавная.
 */
function humanizeName(raw) {
  const tokens = raw.replace(/\s+/g, " ").trim().split(" ");
  const humanized = tokens.map((token) => {
    // Маркировки и обозначения не трогаем: цифры, латиница, дроби, знаки.
    if (/[\d\/A-Za-z+()×х*]/.test(token)) return token;
    const word = token.replace(/[.,;:»«"']+$/g, "");
    const upper = word.toUpperCase();
    if (KEEP_UPPER.has(upper)) return token.toUpperCase();
    if (LOWER_WORDS.has(upper)) return token.toLowerCase();
    return token.toLowerCase();
  });
  const text = humanized.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ——————————————— Единицы измерения и цены по видам ——————————————— */

/** Единица выводится из названия, иначе — из правил по виду категории. */
const UNIT_BY_NAME = [
  [/(\d+\s*)?ПАР(А|Ы)?\b|САПОГИ|БОТИНКИ|ГАЛОШИ|СЛАНЦЫ|ПЕРЧАТКИ|РУКАВИЦЫ/i, "пара"],
  [/НАБОР|КОМПЛЕКТ|\bПРЕДМЕТ|\bПРЕДМ\b/i, "набор"],
  [/КОСТЮМ|\bБЕЛЬЕ\b/i, "компл"],
  [/\b\d+\s*КГ\b/i, "кг"],
  [/\b\d+\s*Л\b|\bЛИТР/i, "л"],
  [/\bРУЛОН|\bРУЛ\b/i, "рул"],
  [/\bУПАК|\bПАЧК/i, "упак"],
  [/\b\d+\s*М\b|\bМЕТР/i, "м"],
];

const UNIT_BY_KIND = {
  "Бланки и формы": "упак",
  "Сварочные электроды": "кг",
  "Шлифовальные шкурки": "рул",
  "Проволочные ерши": "шт",
  "Твердосплавные пластины": "упак",
};

function unitOf(kindName, sourceName) {
  for (const [pattern, unit] of UNIT_BY_NAME) {
    if (pattern.test(sourceName)) return unit;
  }
  return UNIT_BY_KIND[kindName] ?? "шт";
}

/**
 * Ценовые коридоры, ₸ без НДС. Заданы по виду или группе: у канцелярии
 * и метизов — сотни-тысячи, у приборов и станочной оснастки — десятки тысяч.
 */
const PRICE_BY_KIND = {
  "Бланки и формы": [900, 4500, 50],
  Папки: [250, 1800, 10],
  "Ручки и карандаши": [70, 900, 5],
  Тарелки: [500, 3500, 50],
  "Столовые приборы": [400, 4000, 50],
  "Кухонный инвентарь": [1500, 12000, 100],
  "Картриджи для принтеров": [28000, 68000, 500],
  Принтеры: [180000, 950000, 1000],
  "Стиральные машины": [220000, 520000, 1000],
  "Утепленные костюмы": [28000, 62000, 500],
  "Защитные костюмы от электрической дуги": [95000, 320000, 1000],
  "Летние костюмы": [18000, 42000, 500],
  "Защитная спецобувь": [16000, 48000, 500],
  "Резиновые сапоги": [9000, 26000, 500],
  "Слипоны и легкая спецобувь": [3500, 9000, 100],
  "Утепленные жилеты": [12000, 28000, 500],
  "Нательное белье": [7000, 19000, 250],
  "Рабочие халаты": [6500, 22000, 250],
  Манометры: [12000, 96000, 500],
  "Приборы для контроля электрооборудования": [180000, 1400000, 1000],
  Сверла: [4500, 42000, 250],
  Фрезы: [18000, 145000, 500],
  Метчики: [2500, 14000, 100],
  "Гаечные ключи": [3500, 38000, 250],
  Отвертки: [1800, 24000, 100],
  Напильники: [1200, 9500, 100],
  "Твердосплавные пластины": [12000, 78000, 500],
  "Буровые коронки": [24000, 180000, 500],
  Цанги: [6500, 32000, 250],
  "Шлифовальные круги": [900, 8500, 50],
  "Шлифовальные шкурки": [1500, 12000, 100],
  "Проволочные ерши": [800, 6500, 50],
  "Сварочные электроды": [1800, 9500, 50],
  "Расходные материалы для сварочных горелок": [2500, 26000, 250],
  "Сопла для резки": [1500, 14000, 100],
  Болты: [80, 1400, 5],
  Гайки: [40, 800, 5],
  Шайбы: [20, 450, 5],
  Хомуты: [250, 3500, 50],
  "Поддерживающие зажимы": [1500, 12000, 100],
  "Канатные зажимы": [600, 6500, 50],
  Проушины: [900, 9500, 50],
  "Монтажные клинья": [700, 7500, 50],
  Шпонки: [300, 4500, 50],
  "Автоматические выключатели": [8500, 145000, 500],
  "Датчики температуры": [14000, 120000, 500],
  Переключатели: [3500, 48000, 250],
  "Клеммы электрические": [350, 6500, 50],
  "Электротехнические шкафы и корпуса": [28000, 380000, 1000],
  "Электрические разъемы": [1200, 24000, 100],
  "Источники питания": [18000, 220000, 500],
  "Промежуточные реле": [4500, 42000, 250],
  Пускатели: [9500, 96000, 500],
};

const DEFAULT_PRICE = [1500, 25000, 100];

function priceOf(kindName, sourceName) {
  const [min, max, step] = PRICE_BY_KIND[kindName] ?? DEFAULT_PRICE;
  return pick(sourceName, min, max, step);
}

/**
 * Нормативный срок службы, дней — только для расходуемого инструмента
 * и оснастки: на нём строится аналитика ходимости.
 */
const SERVICE_LIFE_BY_KIND = {
  Сверла: [30, 90],
  Фрезы: [60, 150],
  Метчики: [30, 90],
  "Твердосплавные пластины": [20, 60],
  "Буровые коронки": [45, 120],
  Цанги: [180, 365],
  "Шлифовальные круги": [15, 45],
  "Шлифовальные шкурки": [20, 60],
  "Проволочные ерши": [30, 90],
  "Сварочные электроды": [20, 45],
  "Сопла для резки": [30, 90],
  "Расходные материалы для сварочных горелок": [30, 75],
  "Гаечные ключи": [180, 540],
  Отвертки: [120, 365],
  Напильники: [45, 120],
};

function serviceLifeOf(kindName, sourceName) {
  const band = SERVICE_LIFE_BY_KIND[kindName];
  if (!band) return undefined;
  return pick(`life:${sourceName}`, band[0], band[1], 5);
}

/* ———————————————— Описание и характеристики ———————————————— */

/**
 * Краткое описание позиции. Собирается из раздела, группы и вида: в источнике
 * номенклатуры описания либо нет, либо это повтор названия в верхнем регистре.
 */
const DESCRIPTION_BY_ROOT = {
  "Хозяйственные, офисные и канцелярские товары": (kind) =>
    `Позиция административно-хозяйственного обеспечения из группы «${kind}» — для повседневных нужд подразделений.`,
  "Спецодежда и средства защиты": (kind) =>
    `Спецодежда и СИЗ из группы «${kind}» — выдаётся работникам по утверждённым нормам обеспечения.`,
  "Инструменты и измерительная техника": (kind) =>
    `Инструмент из группы «${kind}» — применяется при ремонтных и монтажных работах на предприятиях Группы.`,
  "Расходные материалы и оснастка": (kind) =>
    `Расходный материал из группы «${kind}» — списывается по факту выработки.`,
  "Метизы и крепежные изделия": (kind) =>
    `Крепёжное изделие из группы «${kind}» — применяется при ремонте и монтаже оборудования.`,
  "Электротехника и автоматизация": (kind) =>
    `Электротехническое изделие из группы «${kind}» — для систем питания и автоматизации оборудования.`,
};

function descriptionOf(rootName, kindName, warehouseName, externalSource) {
  const first =
    DESCRIPTION_BY_ROOT[rootName]?.(kindName) ??
    `Позиция раздела «${rootName}» из группы «${kindName}».`;
  // Позиции внешнего маркетплейса идут мимо РЕСХ — в описании его не упоминаем.
  const second = externalSource
    ? `Позиция из каталога ${externalSource} — поставляется напрямую, минуя РЕСХ.`
    : `Поставка на ${warehouseName} по рамочному договору категории.`;
  return `${first} ${second}`;
}

/**
 * Извлечение характеристик из названия. Границы слов заданы явно:
 * \b в JS опирается на латиницу и цифры, поэтому на кириллице не работает.
 */
const EDGE = "(?:^|[\\s(,;])";
const SPEC_PATTERNS = [
  [new RegExp(`${EDGE}(?:формат\\s*)?[АA]([34])(?![\\d])`, "i"), "Формат", (m) => `A${m[1]}`],
  [new RegExp(`(\\d+)\\s*(ШТ|ПРЕДМЕТ|ПРЕДМ|ПАР)(?![А-Яа-я])`, "i"), "В упаковке", (m) => `${m[1]} ${m[2].toLowerCase()}`],
  [new RegExp(`ГОСТ\\s*([\\d.\\-]+)`, "i"), "Стандарт", (m) => `ГОСТ ${m[1]}`],
  [new RegExp(`DIN\\s*(\\d+)`, "i"), "Стандарт", (m) => `DIN ${m[1]}`],
  [new RegExp(`IP\\s?(\\d{2})(?![\\d])`, "i"), "Степень защиты", (m) => `IP${m[1]}`],
  [new RegExp(`${EDGE}Р\\.?\\s?(\\d{2,3}-\\d{2,3}/\\d{2,3}-\\d{2,3})`, "i"), "Размер", (m) => m[1]],
  [new RegExp(`${EDGE}Р\\.?\\s?(\\d{2})(?![\\d])`, "i"), "Размер", (m) => m[1]],
  [new RegExp(`D\\s?(\\d+[,.]?\\d*)\\s*ММ`, "i"), "Диаметр", (m) => `${m[1]} мм`],
  [new RegExp(`(\\d+[,.]?\\d*)\\s*ММ(?![А-Яа-я])`, "i"), "Размер", (m) => `${m[1]} мм`],
  [new RegExp(`М(\\d+)[ХX](\\d+[,.]?\\d*)`, "i"), "Резьба", (m) => `M${m[1]}×${m[2]}`],
  [new RegExp(`${EDGE}М(\\d{1,2})(?![\\dХXх])`), "Резьба", (m) => `M${m[1]}`],
  [new RegExp(`(\\d+)\\s*А(?![А-Яа-я])`), "Номинальный ток", (m) => `${m[1]} А`],
  [new RegExp(`(\\d+)\\s*В(?![А-Яа-я])`), "Напряжение", (m) => `${m[1]} В`],
  [new RegExp(`(\\d+)\\s*ВТ(?![А-Яа-я])`, "i"), "Мощность", (m) => `${m[1]} Вт`],
  [new RegExp(`(\\d+)\\s*Л(?![А-Яа-я])`), "Объём", (m) => `${m[1]} л`],
  [new RegExp(`(Х/Б|БРЕЗЕНТ|КОЖ|НЕРЖ|ФАРФОР|АЛЮМИНИЙ|РЕЗИН|ЛАТЕКС)`, "i"), "Материал", (m) => m[1]],
];

/** Гарантия — только для оборудования и приборов, не для расходников. */
const WARRANTY_KINDS = new Set([
  "Принтеры",
  "Стиральные машины",
  "Манометры",
  "Приборы для контроля электрооборудования",
  "Источники питания",
  "Автоматические выключатели",
  "Датчики температуры",
  "Пускатели",
  "Промежуточные реле",
  "Электротехнические шкафы и корпуса",
]);

function specsOf({ sourceName, kindName, sku, unit, serviceLifeDays }) {
  const specs = [{ label: "Артикул", value: sku }];
  const seen = new Set(["Артикул"]);

  for (const [pattern, label, format] of SPEC_PATTERNS) {
    if (seen.has(label) || specs.length >= 4) continue;
    const match = pattern.exec(sourceName);
    if (match) {
      specs.push({ label, value: format(match) });
      seen.add(label);
    }
  }

  if (specs.length < 4 && serviceLifeDays) {
    specs.push({ label: "Нормативный срок службы", value: `${serviceLifeDays} дн.` });
  }
  if (specs.length < 4 && WARRANTY_KINDS.has(kindName)) {
    specs.push({ label: "Гарантия", value: "12 мес." });
  }
  if (specs.length < 4) {
    specs.push({ label: "Единица измерения", value: unit });
  }
  return specs;
}

/* ————————————————————— Внешние источники ————————————————————— */

/**
 * Часть карточек подтянута из внешних маркетплейсов, которыми пользуется
 * Торговый Дом. Это визуальный атрибут: рамочный договор и поставщик
 * категории от источника не зависят.
 */
const EXTERNAL_SOURCES = ["Garwin", "Lamed", "TSSP"];

/** Источник примерно у каждой третьей позиции, распределение стабильное. */
function externalSourceOf(productId) {
  const bucket = hash(`source:${productId}`) % 3;
  if (bucket !== 0) return undefined;
  return EXTERNAL_SOURCES[hash(`market:${productId}`) % EXTERNAL_SOURCES.length];
}

/* —————————————————————— Остатки на РЕСХ —————————————————————— */

const WAREHOUSES = [
  ["wh-krg", "reg-krg"],
  ["wh-blh", "reg-blh"],
  ["wh-zhz", "reg-zhz"],
  ["wh-chu", "reg-chu"],
];

/**
 * Нормативный срок поставки по рамочному договору категории, дней.
 * Те же значения, что у поставщиков в src/mocks/suppliers.ts.
 */
const CONTRACT_DELIVERY_DAYS = {
  "cat-hozyaystvennye-ofisnye": 7,
  "cat-specodezhda-i": 12,
  "cat-instrumenty-i": 10,
  "cat-rashodnye-materialy": 8,
  "cat-metizy-i": 6,
  "cat-elektrotehnika-i": 14,
};

/** Названия РЕСХ — для описания позиции. */
const WAREHOUSE_NAMES = {
  "wh-krg": "РЕСХ Караганда",
  "wh-blh": "РЕСХ Балхаш",
  "wh-zhz": "РЕСХ Жезказган",
  "wh-chu": "РЕСХ Шатыркуль",
};

/** Дешёвое лежит сотнями, дорогое — единицами. */
function stockBandOf(price) {
  if (price < 1000) return [200, 4000, 50];
  if (price < 10000) return [40, 600, 10];
  if (price < 100000) return [6, 90, 2];
  return [1, 12, 1];
}

function stockOf(productId, price) {
  const [min, max, step] = stockBandOf(price);
  const count = 1 + (hash(`wh:${productId}`) % 3); // 1–3 склада
  const start = hash(`ws:${productId}`) % WAREHOUSES.length;
  return Array.from({ length: count }, (_, i) => {
    const [warehouseId, regionId] = WAREHOUSES[(start + i) % WAREHOUSES.length];
    const quantity = pick(`${productId}:${warehouseId}`, min, max, step);
    return { warehouseId, regionId, quantity };
  });
}

/* ————————————————— Предложения продавцов ————————————————— */

/**
 * Профили внешних маркетплейсов ТД: рейтинг, отзывы и типичный срок поставки.
 * TSSP возит быстрее всех, Lamed — медленнее: список получается осмысленным,
 * а не набором случайных чисел.
 */
const SELLER_PROFILES = {
  Garwin: { rating: [47, 50], reviews: [60, 420], days: [2, 6] },
  Lamed: { rating: [46, 49], reviews: [40, 260], days: [4, 9] },
  TSSP: { rating: [47, 50], reviews: [80, 540], days: [1, 4] },
};

/**
 * Способы поставки внешнего продавца. В строку данных пишется индекс,
 * сама подпись живёт в src/mocks/offers.ts — 482 повтора строки в бандле
 * прототипу ни к чему.
 */
const DELIVERY_MODES = [
  "Доставка до предприятия",
  "Самовывоз со склада продавца",
  "Доставка транспортом продавца",
];

/**
 * Предложения продавцов по позиции: у кого есть, почём и когда привезёт.
 *
 * Договорное предложение всегда первое: цена каталога, поставка на РЕСХ,
 * нормативный срок из договора категории, доставка входит в цену. Дальше —
 * внешние продавцы: цена гуляет вокруг договорной (−6…+14 %), срок и способ
 * поставки свои. У позиции с указанным источником этот продавец идёт первым
 * среди внешних — карточка и список предложений не расходятся.
 */
function buildOffers({ productId, price, stock, externalSource, contractDays }) {
  const offers = [
    {
      productId,
      price,
      availableQuantity: stock.reduce((sum, s) => sum + s.quantity, 0),
      deliveryDays: contractDays,
      deliveryCost: 0,
      rating: pick(`rate:${productId}`, 47, 50) / 10,
      reviews: pick(`rev:${productId}`, 12, 180),
    },
  ];

  const names = Object.keys(SELLER_PROFILES);
  const start = externalSource
    ? names.indexOf(externalSource)
    : hash(`seller:${productId}`) % names.length;
  // У каждой позиции есть с чем сравнить: минимум одно внешнее предложение.
  const count = externalSource
    ? 2 + (hash(`extra:${productId}`) % 2)
    : 1 + (hash(`extra:${productId}`) % 3);

  for (let i = 0; i < count; i += 1) {
    const name = names[(start + i) % names.length];
    const profile = SELLER_PROFILES[name];
    const deltaPercent = pick(`delta:${productId}:${name}`, -6, 14);
    const offerPrice = Math.max(
      10,
      Math.round((price * (100 + deltaPercent)) / 100 / 10) * 10
    );
    const freeDelivery = hash(`free:${productId}:${name}`) % 3 === 0;
    offers.push({
      productId,
      sellerName: name,
      price: offerPrice,
      availableQuantity: pick(`qty:${productId}:${name}`, 2, 240),
      deliveryDays: pick(
        `days:${productId}:${name}`,
        profile.days[0],
        profile.days[1]
      ),
      deliveryMode: hash(`mode:${productId}:${name}`) % DELIVERY_MODES.length,
      deliveryCost: freeDelivery
        ? 0
        : pick(`dc:${productId}:${name}`, 900, 4500, 100),
      rating:
        pick(`rate:${productId}:${name}`, profile.rating[0], profile.rating[1]) /
        10,
      reviews: pick(
        `rev:${productId}:${name}`,
        profile.reviews[0],
        profile.reviews[1]
      ),
    });
  }

  return offers;
}

/* ——————————————————————— Сборка данных ——————————————————————— */

const STOCK_SYNCED_AT = "2026-08-20T04:15:00.000Z";

/** Этап разворачивания и иконка раздела — по порядку из концепции. */
const ROOT_META = {
  "Хозяйственные, офисные и канцелярские товары": { stage: "pilot", icon: "PenTool" },
  "Спецодежда и средства защиты": { stage: "stage2", icon: "HardHat" },
  "Инструменты и измерительная техника": { stage: "stage3", icon: "Wrench" },
  "Расходные материалы и оснастка": { stage: "stage4", icon: "Disc3" },
  "Метизы и крепежные изделия": { stage: "stage4", icon: "Bolt" },
  "Электротехника и автоматизация": { stage: "stage4", icon: "Zap" },
};

/**
 * Категории следующих этапов: тендер не проведён, каталога ещё нет.
 * Нужны, чтобы в админке и каталоге была видна этапность расширения.
 */
const FUTURE_ROOTS = [
  { id: "cat-kip", name: "КИП и автоматика", icon: "Gauge" },
  { id: "cat-stroymaterialy", name: "Стройматериалы", icon: "Blocks" },
  { id: "cat-kabelnaya", name: "Кабельная продукция", icon: "Cable" },
];

const categories = [];
const products = [];
const offers = [];
const usedIds = new Set();

function uniqueId(base) {
  let id = base;
  let n = 2;
  while (usedIds.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  usedIds.add(id);
  return id;
}

for (const root of selection.roots) {
  const meta = ROOT_META[root.name] ?? { stage: "stage4" };
  const rootId = uniqueId(`cat-${slug(root.name)}`);
  const rootSlug = rootId.replace(/^cat-/, "");

  categories.push({
    id: rootId,
    name: root.name,
    parentId: null,
    level: 1,
    stage: meta.stage,
    isActive: true,
    icon: meta.icon,
    description: `${root.groups.length} групп(ы) номенклатуры`,
  });

  let productIndex = 0;

  for (const group of root.groups) {
    const groupId = uniqueId(`${rootId}-${slug(group.name)}`);
    categories.push({
      id: groupId,
      name: group.name,
      parentId: rootId,
      level: 2,
      stage: meta.stage,
      isActive: true,
    });

    for (const kind of group.kinds) {
      const kindId = uniqueId(`${groupId}-${slug(kind.name, 1)}`);
      categories.push({
        id: kindId,
        name: kind.name,
        parentId: groupId,
        level: 3,
        stage: meta.stage,
        isActive: true,
      });

      for (const item of kind.products) {
        productIndex += 1;
        const id = `prd-${rootSlug}-${String(productIndex).padStart(3, "0")}`;
        const price = priceOf(kind.name, item.sourceName);
        const serviceLifeDays = serviceLifeOf(kind.name, item.sourceName);
        const stock = stockOf(id, price);
        const sku = `KM-${rootSlug.slice(0, 3).toUpperCase()}-${String(
          pick(`sku:${id}`, 1000, 9999)
        )}`;
        const warehouseName =
          WAREHOUSE_NAMES[stock[0].warehouseId] ?? "РЕСХ региона";
        const externalSource = externalSourceOf(id);

        offers.push(
          ...buildOffers({
            productId: id,
            price,
            stock,
            externalSource,
            contractDays: CONTRACT_DELIVERY_DAYS[rootId] ?? 10,
          })
        );

        products.push({
          id,
          name: humanizeName(item.sourceName),
          // Артикул и код номенклатуры сгенерированы: коды источника
          // (внутренние данные) в прототип не переносятся.
          sku,
          erpItemId: `NOM-${pick(`erp:${id}`, 500000, 599999)}`,
          categoryId: kindId,
          unit: unitOf(kind.name, item.sourceName),
          price,
          vatRate: 12,
          stock,
          primaryWarehouseId: stock[0].warehouseId,
          primaryRegionId: stock[0].regionId,
          ...(serviceLifeDays ? { serviceLifeDays } : {}),
          ...(IMAGES[id] ? { imageUrl: IMAGES[id] } : {}),
          ...(externalSource ? { externalSource } : {}),
          description: descriptionOf(
            root.name,
            kind.name,
            warehouseName,
            externalSource
          ),
          specs: specsOf({
            sourceName: item.sourceName,
            kindName: kind.name,
            sku,
            unit: unitOf(kind.name, item.sourceName),
            serviceLifeDays,
          }),
        });
      }
    }
  }
}

for (const future of FUTURE_ROOTS) {
  categories.push({
    id: uniqueId(future.id),
    name: future.name,
    parentId: null,
    level: 1,
    stage: "next",
    isActive: false,
    icon: future.icon,
    description: "Подключается после тендера и заключения рамочного договора",
  });
}

/* ——————————————————————— Запись файлов ——————————————————————— */

const ts = (value) => JSON.stringify(value, null, 2).replace(/"([a-zA-Z]\w*)":/g, "$1:");

const categoriesFile = `import type { Category } from "@/types";

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
export const CATEGORIES: Category[] = ${ts(
  categories.map(({ level, ...rest }) => {
    void level;
    return rest;
  })
)};

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
`;

const productsFile = `import type { Product, StockBalance } from "@/types";

import { rootCategoryId } from "@/mocks/categories";
import { supplierOfCategory } from "@/mocks/suppliers";

/**
 * Номенклатура каталога. Названия и привязка к видам категорий — реальные
 * (источник: SMAT, номенклатура склада Казахмыса). Артикулы, коды
 * номенклатуры, цены, единицы измерения, остатки на РЕСХ и нормативные сроки
 * службы сгенерированы для прототипа: в источнике этих данных нет.
 *
 * Поставщик не задаётся вручную, а выводится от категории закупа —
 * модель «один поставщик на категорию» не может разойтись с данными.
 *
 * ФАЙЛ СГЕНЕРИРОВАН: scripts/generate-catalog.mjs из data/smat-selection.json.
 */

/** Момент последней синхронизации остатков с D365 F&O. */
const STOCK_SYNCED_AT = "${STOCK_SYNCED_AT}";

interface ProductRow {
  id: string;
  name: string;
  sku: string;
  erpItemId: string;
  categoryId: string;
  unit: Product["unit"];
  price: number;
  vatRate: number;
  stock: Array<{ warehouseId: string; regionId: string; quantity: number }>;
  primaryWarehouseId: string;
  primaryRegionId: string;
  serviceLifeDays?: number;
  imageUrl?: string;
  externalSource?: string;
  description?: string;
  specs?: Array<{ label: string; value: string }>;
}

const PRODUCT_ROWS: ProductRow[] = ${ts(products)};

function toStock(rows: ProductRow["stock"]): StockBalance[] {
  return rows.map((row) => ({ ...row, updatedAt: STOCK_SYNCED_AT }));
}

export const PRODUCTS: Product[] = PRODUCT_ROWS.map((row) => {
  const purchaseCategoryId = rootCategoryId(row.categoryId);
  const supplier = supplierOfCategory(purchaseCategoryId);
  if (!supplier) {
    throw new Error(
      \`Нет поставщика для категории закупа \${purchaseCategoryId} (позиция \${row.id})\`
    );
  }
  return {
    ...row,
    supplierId: supplier.id,
    stock: toStock(row.stock),
  };
});

export function productById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/** Позиции категории закупа со всеми вложенными группами и видами. */
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
`;

const offersFile = `import type { ProductOffer } from "@/types";

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

const OFFER_ROWS: OfferRow[] = ${ts(offers)};

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
      id: \`\${row.productId}-o-\${row.sellerName.toLowerCase()}\`,
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
    id: \`\${row.productId}-o-contract\`,
    deliveryLabel: \`Поставка на \${warehouse?.name ?? "РЕСХ региона"}\`,
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
`;

writeFileSync("src/mocks/categories.ts", categoriesFile, "utf8");
writeFileSync("src/mocks/products.ts", productsFile, "utf8");
writeFileSync("src/mocks/offers.ts", offersFile, "utf8");

const byRoot = new Map();
for (const product of products) {
  const root = product.id.replace(/^prd-/, "").replace(/-\d+$/, "");
  byRoot.set(root, (byRoot.get(root) ?? 0) + 1);
}

console.log(
  `Категорий: ${categories.length} (разделов ${categories.filter((c) => !c.parentId).length}), позиций: ${products.length}`
);
for (const [root, count] of byRoot) console.log(`  ${root}: ${count}`);
console.log(`Предложений продавцов: ${offers.length}`);
console.log(
  "Записано: src/mocks/categories.ts, src/mocks/products.ts, src/mocks/offers.ts"
);
