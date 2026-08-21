import type { Product, StockBalance } from "@/types";

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
const STOCK_SYNCED_AT = "2026-08-20T04:15:00.000Z";

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

const PRODUCT_ROWS: ProductRow[] = [
  {
    id: "prd-hozyaystvennye-ofisnye-001",
    name: "Бланк график работы ЭПУ формат А3 Ч/Б плотн БУМ80Г/М2 одност",
    sku: "KM-HOZ-8597",
    erpItemId: "NOM-539403",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-blanki",
    unit: "упак",
    price: 2950,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 370
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 290
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Позиция административно-хозяйственного обеспечения из группы «Бланки и формы» — для повседневных нужд подразделений. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-8597"
      },
      {
        label: "Формат",
        value: "A3"
      },
      {
        label: "Единица измерения",
        value: "упак"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-002",
    name: "Талон медицинского освидетел ЦВ, 40Х55ММ КЗ 540Х280 ЧБ/ЦВ",
    sku: "KM-HOZ-6978",
    erpItemId: "NOM-517022",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-blanki",
    unit: "упак",
    price: 3300,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 410
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Позиция административно-хозяйственного обеспечения из группы «Бланки и формы» — для повседневных нужд подразделений. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-6978"
      },
      {
        label: "Размер",
        value: "55 мм"
      },
      {
        label: "Единица измерения",
        value: "упак"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-003",
    name: "Бланк извещение А4/1 книж 80Г/М2 цветной",
    sku: "KM-HOZ-5359",
    erpItemId: "NOM-594641",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-blanki",
    unit: "упак",
    price: 3700,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 420
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 40
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 240
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "Lamed",
    description: "Позиция административно-хозяйственного обеспечения из группы «Бланки и формы» — для повседневных нужд подразделений. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-5359"
      },
      {
        label: "Формат",
        value: "A4"
      },
      {
        label: "Единица измерения",
        value: "упак"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-004",
    name: "Папка биговка А4",
    sku: "KM-HOZ-3740",
    erpItemId: "NOM-572260",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-papki",
    unit: "шт",
    price: 440,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 2800
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 3250
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    externalSource: "TSSP",
    description: "Позиция административно-хозяйственного обеспечения из группы «Папки» — для повседневных нужд подразделений. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-3740"
      },
      {
        label: "Формат",
        value: "A4"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-005",
    name: "Папка-уголок А4 прозрачная бесцветная",
    sku: "KM-HOZ-2121",
    erpItemId: "NOM-549879",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-papki",
    unit: "шт",
    price: 1210,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 380
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    imageUrl: "/products/papka.jpg",
    description: "Позиция административно-хозяйственного обеспечения из группы «Папки» — для повседневных нужд подразделений. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-2121"
      },
      {
        label: "Формат",
        value: "A4"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-006",
    name: "Папка на резинках А4",
    sku: "KM-HOZ-9502",
    erpItemId: "NOM-527498",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-papki",
    unit: "шт",
    price: 1190,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 170
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 530
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 580
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Позиция административно-хозяйственного обеспечения из группы «Папки» — для повседневных нужд подразделений. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-9502"
      },
      {
        label: "Формат",
        value: "A4"
      },
      {
        label: "Материал",
        value: "РЕЗИН"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-007",
    name: "Ручка MAXRITER красная 1ШТ",
    sku: "KM-HOZ-7883",
    erpItemId: "NOM-505117",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-ruchki",
    unit: "шт",
    price: 310,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 550
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 350
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Позиция административно-хозяйственного обеспечения из группы «Ручки и карандаши» — для повседневных нужд подразделений. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-7883"
      },
      {
        label: "В упаковке",
        value: "1 шт"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-008",
    name: "Карандаш с ластиком",
    sku: "KM-HOZ-6264",
    erpItemId: "NOM-540832",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-ruchki",
    unit: "шт",
    price: 155,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 600
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Позиция административно-хозяйственного обеспечения из группы «Ручки и карандаши» — для повседневных нужд подразделений. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-6264"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-009",
    name: "Мел 10-12СМ",
    sku: "KM-HOZ-4645",
    erpItemId: "NOM-518451",
    categoryId: "cat-hozyaystvennye-ofisnye-kancelyarskie-tovary-ruchki",
    unit: "шт",
    price: 135,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 1100
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 2500
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 2250
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    externalSource: "TSSP",
    description: "Позиция административно-хозяйственного обеспечения из группы «Ручки и карандаши» — для повседневных нужд подразделений. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-4645"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-010",
    name: "Тарелка десертная 6ШТ фарфор",
    sku: "KM-HOZ-6407",
    erpItemId: "NOM-557471",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-tarelki",
    unit: "шт",
    price: 1100,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 360
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 50
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "Garwin",
    description: "Позиция административно-хозяйственного обеспечения из группы «Тарелки» — для повседневных нужд подразделений. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-6407"
      },
      {
        label: "В упаковке",
        value: "6 шт"
      },
      {
        label: "Материал",
        value: "ФАРФОР"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-011",
    name: "Тарелка для супа 15СМ",
    sku: "KM-HOZ-8026",
    erpItemId: "NOM-535090",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-tarelki",
    unit: "шт",
    price: 3300,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 410
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 510
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 130
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Позиция административно-хозяйственного обеспечения из группы «Тарелки» — для повседневных нужд подразделений. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-8026"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-012",
    name: "Тарелка глубокая 20СМ",
    sku: "KM-HOZ-9645",
    erpItemId: "NOM-512709",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-tarelki",
    unit: "шт",
    price: 1900,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 280
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Позиция административно-хозяйственного обеспечения из группы «Тарелки» — для повседневных нужд подразделений. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-9645"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-013",
    name: "Набор столовых вилок 12ШТ",
    sku: "KM-HOZ-2264",
    erpItemId: "NOM-590328",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-stolovye",
    unit: "набор",
    price: 1750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 600
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 340
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Позиция административно-хозяйственного обеспечения из группы «Столовые приборы» — для повседневных нужд подразделений. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-2264"
      },
      {
        label: "В упаковке",
        value: "12 шт"
      },
      {
        label: "Единица измерения",
        value: "набор"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-014",
    name: "Вилка столовая металлическая L 200-65 B 2MM",
    sku: "KM-HOZ-8931",
    erpItemId: "NOM-546995",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-stolovye",
    unit: "шт",
    price: 2450,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 350
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Позиция административно-хозяйственного обеспечения из группы «Столовые приборы» — для повседневных нужд подразделений. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-8931"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-015",
    name: "Ложка столовая металл L200-66 B2MM",
    sku: "KM-HOZ-1550",
    erpItemId: "NOM-524614",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-stolovye",
    unit: "шт",
    price: 3950,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 560
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 310
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    externalSource: "TSSP",
    description: "Позиция административно-хозяйственного обеспечения из группы «Столовые приборы» — для повседневных нужд подразделений. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-1550"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-016",
    name: "Сковорода D28СМ алюминий",
    sku: "KM-HOZ-3169",
    erpItemId: "NOM-502233",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-kuhonnyy",
    unit: "шт",
    price: 8300,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 410
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 540
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 340
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    externalSource: "Garwin",
    description: "Позиция административно-хозяйственного обеспечения из группы «Кухонный инвентарь» — для повседневных нужд подразделений. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-3169"
      },
      {
        label: "Материал",
        value: "АЛЮМИНИЙ"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-017",
    name: "Ножницы кухонные К012 нерж.сталь",
    sku: "KM-HOZ-4788",
    erpItemId: "NOM-579852",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-kuhonnyy",
    unit: "шт",
    price: 6000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 330
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Позиция административно-хозяйственного обеспечения из группы «Кухонный инвентарь» — для повседневных нужд подразделений. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-4788"
      },
      {
        label: "Материал",
        value: "НЕРЖ"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-018",
    name: "Миска 5Л эмалированная",
    sku: "KM-HOZ-2455",
    erpItemId: "NOM-578423",
    categoryId: "cat-hozyaystvennye-ofisnye-posuda-i-kuhonnyy",
    unit: "шт",
    price: 9200,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 520
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 290
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 460
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Позиция административно-хозяйственного обеспечения из группы «Кухонный инвентарь» — для повседневных нужд подразделений. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-2455"
      },
      {
        label: "Объём",
        value: "5 л"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-019",
    name: "Тонер-картридж CANON IR2016/2020/2022/2025/2030/2318",
    sku: "KM-HOZ-4074",
    erpItemId: "NOM-556042",
    categoryId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-kartridzhi",
    unit: "шт",
    price: 32500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 86
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    imageUrl: "/products/kartridzh.jpg",
    description: "Позиция административно-хозяйственного обеспечения из группы «Картриджи для принтеров» — для повседневных нужд подразделений. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-4074"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-020",
    name: "Принтер лазерный цветной 41СТ/МИН/1.5GB/1.2GHZ/556X589X399MM",
    sku: "KM-HOZ-2598",
    erpItemId: "NOM-544662",
    categoryId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-printery",
    unit: "шт",
    price: 915000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 2
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Позиция административно-хозяйственного обеспечения из группы «Принтеры» — для повседневных нужд подразделений. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-2598"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-021",
    name: "Принтер А3 цветной Ч/Б/600Х600/20СТР/МИН/192МБ",
    sku: "KM-HOZ-9979",
    erpItemId: "NOM-567043",
    categoryId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-printery",
    unit: "шт",
    price: 261000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 1
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 11
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "TSSP",
    description: "Позиция административно-хозяйственного обеспечения из группы «Принтеры» — для повседневных нужд подразделений. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-9979"
      },
      {
        label: "Формат",
        value: "A3"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-022",
    name: "Принтер А4 цветной 128МБ USB 2.0/RJ-45/750 мгц",
    sku: "KM-HOZ-5836",
    erpItemId: "NOM-599900",
    categoryId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-printery",
    unit: "шт",
    price: 292000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 12
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 10
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Позиция административно-хозяйственного обеспечения из группы «Принтеры» — для повседневных нужд подразделений. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-5836"
      },
      {
        label: "Формат",
        value: "A4"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-023",
    name: "Машина стиральная 9КГ 1400ОБ/МИН",
    sku: "KM-HOZ-4217",
    erpItemId: "NOM-522281",
    categoryId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-stiralnye",
    unit: "шт",
    price: 462000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 9
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 1
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 11
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Позиция административно-хозяйственного обеспечения из группы «Стиральные машины» — для повседневных нужд подразделений. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-4217"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-024",
    name: "Машина стиральная 7КГ 1200ОБ/МИН автомат",
    sku: "KM-HOZ-9074",
    erpItemId: "NOM-555138",
    categoryId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-stiralnye",
    unit: "шт",
    price: 251000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 8
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 10
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 6
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    externalSource: "Lamed",
    description: "Позиция административно-хозяйственного обеспечения из группы «Стиральные машины» — для повседневных нужд подразделений. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-9074"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-hozyaystvennye-ofisnye-025",
    name: "Машина стиральная 9КГ 1400ОБ/МИН А+++ автомат",
    sku: "KM-HOZ-7455",
    erpItemId: "NOM-577519",
    categoryId: "cat-hozyaystvennye-ofisnye-ofisnoe-oborudovanie-stiralnye",
    unit: "шт",
    price: 466000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 5
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Позиция административно-хозяйственного обеспечения из группы «Стиральные машины» — для повседневных нужд подразделений. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-HOZ-7455"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-001",
    name: "Костюм ИТР утепл. Х/Б ткань Р.88-92/158-164",
    sku: "KM-SPE-1735",
    erpItemId: "NOM-520503",
    categoryId: "cat-specodezhda-i-kostyumy-i-uteplennye",
    unit: "компл",
    price: 52500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 48
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 70
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Спецодежда и СИЗ из группы «Утепленные костюмы» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-1735"
      },
      {
        label: "Размер",
        value: "88-92/158-164"
      },
      {
        label: "Материал",
        value: "Х/Б"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-002",
    name: "Костюм ИТР утепл. Х/Б ткань Р.88-92/170-176",
    sku: "KM-SPE-6592",
    erpItemId: "NOM-553360",
    categoryId: "cat-specodezhda-i-kostyumy-i-uteplennye",
    unit: "компл",
    price: 46000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 42
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 26
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Спецодежда и СИЗ из группы «Утепленные костюмы» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-6592"
      },
      {
        label: "Размер",
        value: "88-92/170-176"
      },
      {
        label: "Материал",
        value: "Х/Б"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-003",
    name: "Костюм ИТР утепл. Х/Б ткань Р.96-100/158-164",
    sku: "KM-SPE-4973",
    erpItemId: "NOM-575741",
    categoryId: "cat-specodezhda-i-kostyumy-i-uteplennye",
    unit: "компл",
    price: 31000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 44
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 62
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 34
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "TSSP",
    description: "Спецодежда и СИЗ из группы «Утепленные костюмы» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-4973"
      },
      {
        label: "Размер",
        value: "96-100/158-164"
      },
      {
        label: "Материал",
        value: "Х/Б"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-004",
    name: "Костюм рабочий утепл. от электр.дуги 65 КАЛ 136-140/170-176",
    sku: "KM-SPE-5878",
    erpItemId: "NOM-587646",
    categoryId: "cat-specodezhda-i-kostyumy-i-zaschitnye",
    unit: "компл",
    price: 309000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 12
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 10
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Спецодежда и СИЗ из группы «Защитные костюмы от электрической дуги» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-5878"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-005",
    name: "Костюм рабочий от электр.дуги 12 КАЛ/СМ2 136-140/170-176",
    sku: "KM-SPE-4259",
    erpItemId: "NOM-510027",
    categoryId: "cat-specodezhda-i-kostyumy-i-zaschitnye",
    unit: "компл",
    price: 177000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 1
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 1
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 3
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    externalSource: "Garwin",
    description: "Спецодежда и СИЗ из группы «Защитные костюмы от электрической дуги» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-4259"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-006",
    name: "Костюм рабочий от электр.дуги 20КАЛ Р.88-92/170-176",
    sku: "KM-SPE-9116",
    erpItemId: "NOM-542884",
    categoryId: "cat-specodezhda-i-kostyumy-i-zaschitnye",
    unit: "компл",
    price: 304000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 10
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 2
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 12
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Спецодежда и СИЗ из группы «Защитные костюмы от электрической дуги» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-9116"
      },
      {
        label: "Размер",
        value: "88-92/170-176"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-007",
    name: "Костюм ИТР Х/Б ткань Р.96-100/182-188",
    sku: "KM-SPE-7497",
    erpItemId: "NOM-565265",
    categoryId: "cat-specodezhda-i-kostyumy-i-letnie",
    unit: "компл",
    price: 39500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 12
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Спецодежда и СИЗ из группы «Летние костюмы» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-7497"
      },
      {
        label: "Размер",
        value: "96-100/182-188"
      },
      {
        label: "Материал",
        value: "Х/Б"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-008",
    name: "Костюм ИТР Х/Б ткань Р.104-108/170-176",
    sku: "KM-SPE-7306",
    erpItemId: "NOM-577170",
    categoryId: "cat-specodezhda-i-kostyumy-i-letnie",
    unit: "компл",
    price: 21000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 62
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 84
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Спецодежда и СИЗ из группы «Летние костюмы» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-7306"
      },
      {
        label: "Размер",
        value: "104-108/170-176"
      },
      {
        label: "Материал",
        value: "Х/Б"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-009",
    name: "Костюм ИТР Х/Б ткань Р.104-108/182-188",
    sku: "KM-SPE-5687",
    erpItemId: "NOM-599551",
    categoryId: "cat-specodezhda-i-kostyumy-i-letnie",
    unit: "компл",
    price: 42000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 36
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 34
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 78
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    externalSource: "Garwin",
    description: "Спецодежда и СИЗ из группы «Летние костюмы» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-5687"
      },
      {
        label: "Размер",
        value: "104-108/182-188"
      },
      {
        label: "Материал",
        value: "Х/Б"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-010",
    name: "Галоши диэлектр Р.30 высота 10-15СМ ГОСТ 13385-78",
    sku: "KM-SPE-2687",
    erpItemId: "NOM-585313",
    categoryId: "cat-specodezhda-i-specobuv-zaschitnaya",
    unit: "пара",
    price: 39500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 38
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 44
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Спецодежда и СИЗ из группы «Защитная спецобувь» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-2687"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 13385-78"
      },
      {
        label: "Размер",
        value: "30"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-011",
    name: "Ботинки кож. лет. с метал.подноском Р.38",
    sku: "KM-SPE-1068",
    erpItemId: "NOM-562932",
    categoryId: "cat-specodezhda-i-specobuv-zaschitnaya",
    unit: "пара",
    price: 41500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 40
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    imageUrl: "/products/botinki.jpg",
    externalSource: "TSSP",
    description: "Спецодежда и СИЗ из группы «Защитная спецобувь» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-1068"
      },
      {
        label: "Размер",
        value: "38"
      },
      {
        label: "Материал",
        value: "КОЖ"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-012",
    name: "Ботинки кож. утепл. с метал.подноском Р.39",
    sku: "KM-SPE-5925",
    erpItemId: "NOM-530075",
    categoryId: "cat-specodezhda-i-specobuv-zaschitnaya",
    unit: "пара",
    price: 45500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 20
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Спецодежда и СИЗ из группы «Защитная спецобувь» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-5925"
      },
      {
        label: "Размер",
        value: "39"
      },
      {
        label: "Материал",
        value: "КОЖ"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-013",
    name: "Сапоги болотные Р.41 ГОСТ 12.4.072-79, ГОСТ 5375-79",
    sku: "KM-SPE-4306",
    erpItemId: "NOM-507694",
    categoryId: "cat-specodezhda-i-specobuv-rezinovye",
    unit: "пара",
    price: 12000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 34
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 58
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 46
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    imageUrl: "/products/sapogi.jpg",
    description: "Спецодежда и СИЗ из группы «Резиновые сапоги» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-4306"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 12.4.072-79"
      },
      {
        label: "Размер",
        value: "41"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-014",
    name: "Сапоги болотные Р.44 ГОСТ 12.4.072-79, ГОСТ 5375-79",
    sku: "KM-SPE-5211",
    erpItemId: "NOM-595789",
    categoryId: "cat-specodezhda-i-specobuv-rezinovye",
    unit: "пара",
    price: 9000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 380
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "Garwin",
    description: "Спецодежда и СИЗ из группы «Резиновые сапоги» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-5211"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 12.4.072-79"
      },
      {
        label: "Размер",
        value: "44"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-015",
    name: "Сапоги болотные Р.42 ГОСТ 12.4.072-79, ГОСТ 5375-79",
    sku: "KM-SPE-3592",
    erpItemId: "NOM-573408",
    categoryId: "cat-specodezhda-i-specobuv-rezinovye",
    unit: "пара",
    price: 13000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 62
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 90
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 42
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Спецодежда и СИЗ из группы «Резиновые сапоги» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-3592"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 12.4.072-79"
      },
      {
        label: "Размер",
        value: "42"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-016",
    name: "Сланцы Р.37",
    sku: "KM-SPE-8449",
    erpItemId: "NOM-540551",
    categoryId: "cat-specodezhda-i-specobuv-slipony",
    unit: "пара",
    price: 5200,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 440
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 460
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 470
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Спецодежда и СИЗ из группы «Слипоны и легкая спецобувь» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-8449"
      },
      {
        label: "Размер",
        value: "37"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-017",
    name: "Сланцы Р.38",
    sku: "KM-SPE-6830",
    erpItemId: "NOM-518170",
    categoryId: "cat-specodezhda-i-specobuv-slipony",
    unit: "пара",
    price: 6900,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 240
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 510
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    externalSource: "Garwin",
    description: "Спецодежда и СИЗ из группы «Слипоны и легкая спецобувь» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-6830"
      },
      {
        label: "Размер",
        value: "38"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-018",
    name: "Сланцы Р.39",
    sku: "KM-SPE-7735",
    erpItemId: "NOM-564361",
    categoryId: "cat-specodezhda-i-specobuv-slipony",
    unit: "пара",
    price: 5000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 530
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 290
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 50
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "Garwin",
    description: "Спецодежда и СИЗ из группы «Слипоны и легкая спецобувь» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-7735"
      },
      {
        label: "Размер",
        value: "39"
      },
      {
        label: "Единица измерения",
        value: "пара"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-019",
    name: "Жилет утепл. Р.88-92/158-164 ГОСТ 25295-2003",
    sku: "KM-SPE-6116",
    erpItemId: "NOM-541980",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-uteplennye",
    unit: "шт",
    price: 15500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 86
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 86
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Спецодежда и СИЗ из группы «Утепленные жилеты» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-6116"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 25295-2003"
      },
      {
        label: "Размер",
        value: "88-92/158-164"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-020",
    name: "Жилет утепл. Р.88-92/170-176",
    sku: "KM-SPE-1972",
    erpItemId: "NOM-592132",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-uteplennye",
    unit: "шт",
    price: 16500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 14
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 68
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 16
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Спецодежда и СИЗ из группы «Утепленные жилеты» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-1972"
      },
      {
        label: "Размер",
        value: "88-92/170-176"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-021",
    name: "Жилет утепл. Р.96-100/170-176 ГОСТ 25295-2003",
    sku: "KM-SPE-9353",
    erpItemId: "NOM-569751",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-uteplennye",
    unit: "шт",
    price: 12000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 58
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 50
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "Garwin",
    description: "Спецодежда и СИЗ из группы «Утепленные жилеты» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-9353"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 25295-2003"
      },
      {
        label: "Размер",
        value: "96-100/170-176"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-022",
    name: "Белье нательное ХБ (ДЛЯ ДУГОСТОЙ.КОСТЮМОВ), 136-140/170-176",
    sku: "KM-SPE-7734",
    erpItemId: "NOM-547370",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-natelnoe",
    unit: "компл",
    price: 18500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 26
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    externalSource: "Garwin",
    description: "Спецодежда и СИЗ из группы «Нательное белье» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-7734"
      },
      {
        label: "Единица измерения",
        value: "компл"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-023",
    name: "Белье нательное Х/Б ткань Р.88-92/182-188",
    sku: "KM-SPE-6115",
    erpItemId: "NOM-524989",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-natelnoe",
    unit: "шт",
    price: 8750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 510
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 600
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 240
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Спецодежда и СИЗ из группы «Нательное белье» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-6115"
      },
      {
        label: "Размер",
        value: "88-92/182-188"
      },
      {
        label: "Материал",
        value: "Х/Б"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-024",
    name: "Белье нательное Х/Б ткань Р.88-92/194-200",
    sku: "KM-SPE-8448",
    erpItemId: "NOM-581656",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-natelnoe",
    unit: "шт",
    price: 12000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 12
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    externalSource: "Garwin",
    description: "Спецодежда и СИЗ из группы «Нательное белье» — выдаётся работникам по утверждённым нормам обеспечения. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-8448"
      },
      {
        label: "Размер",
        value: "88-92/194-200"
      },
      {
        label: "Материал",
        value: "Х/Б"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-025",
    name: "Халат махровый, XL BAG-2472/001-006",
    sku: "KM-SPE-6829",
    erpItemId: "NOM-559275",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-rabochie",
    unit: "шт",
    price: 20750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 76
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 24
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 66
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Спецодежда и СИЗ из группы «Рабочие халаты» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-6829"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-026",
    name: "Халат медицинский смес.ткань Р.88-92/170-176",
    sku: "KM-SPE-5210",
    erpItemId: "NOM-536894",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-rabochie",
    unit: "шт",
    price: 14750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 84
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 24
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Спецодежда и СИЗ из группы «Рабочие халаты» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-5210"
      },
      {
        label: "Размер",
        value: "88-92/170-176"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-specodezhda-i-027",
    name: "Халат рабочий смес.ткань Р.88-92/158-164 12.4.131-83",
    sku: "KM-SPE-3591",
    erpItemId: "NOM-514513",
    categoryId: "cat-specodezhda-i-rabochaya-odezhda-rabochie",
    unit: "шт",
    price: 12250,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 12
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Спецодежда и СИЗ из группы «Рабочие халаты» — выдаётся работникам по утверждённым нормам обеспечения. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-SPE-3591"
      },
      {
        label: "Размер",
        value: "88-92/158-164"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-001",
    name: "Манометр МП2-УФ 0-1МПА-КЛТ2,5-D50-IP40-М12Х1,5-РШ-У2 РРК",
    sku: "KM-INS-2429",
    erpItemId: "NOM-558339",
    categoryId: "cat-instrumenty-i-kontrolno-izmeritelnye-manometry",
    unit: "шт",
    price: 55500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 22
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Инструмент из группы «Манометры» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-2429"
      },
      {
        label: "Степень защиты",
        value: "IP40"
      },
      {
        label: "Резьба",
        value: "M12×1,5"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      }
    ]
  },
  {
    id: "prd-instrumenty-i-002",
    name: "Манометр МП4-УУ2-250КГС/СМ2-1,5-IP53-ЦСМ",
    sku: "KM-INS-9810",
    erpItemId: "NOM-535958",
    categoryId: "cat-instrumenty-i-kontrolno-izmeritelnye-manometry",
    unit: "шт",
    price: 89000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 18
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 58
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Инструмент из группы «Манометры» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-9810"
      },
      {
        label: "Степень защиты",
        value: "IP53"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-003",
    name: "Манометр МП3-УФ 0-6КГС/СМ2 КЛ.Т.1,5 ОШ",
    sku: "KM-INS-8191",
    erpItemId: "NOM-513577",
    categoryId: "cat-instrumenty-i-kontrolno-izmeritelnye-manometry",
    unit: "шт",
    price: 22000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 66
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 56
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 90
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    imageUrl: "/products/manometr.jpg",
    description: "Инструмент из группы «Манометры» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-8191"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-004",
    name: "Установка автомат для поверки эл.счетчиков нева-тест 6303",
    sku: "KM-INS-6572",
    erpItemId: "NOM-591196",
    categoryId: "cat-instrumenty-i-kontrolno-izmeritelnye-pribory",
    unit: "шт",
    price: 265000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 4
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Инструмент из группы «Приборы для контроля электрооборудования» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-6572"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-005",
    name: "Платформа компактная EXFO FTB-2 PRO",
    sku: "KM-INS-4953",
    erpItemId: "NOM-568815",
    categoryId: "cat-instrumenty-i-kontrolno-izmeritelnye-pribory",
    unit: "шт",
    price: 1358000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 9
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 7
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Инструмент из группы «Приборы для контроля электрооборудования» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-4953"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-006",
    name: "Мегаомметр ЭС-0202/2-Г",
    sku: "KM-INS-3334",
    erpItemId: "NOM-546434",
    categoryId: "cat-instrumenty-i-kontrolno-izmeritelnye-pribory",
    unit: "шт",
    price: 406000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 12
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 8
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 6
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Инструмент из группы «Приборы для контроля электрооборудования» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-3334"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-007",
    name: "Сверло сборное 42ММ K3D42040-13",
    sku: "KM-INS-1715",
    erpItemId: "NOM-524053",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-sverla",
    unit: "шт",
    price: 15500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 72
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 40,
    imageUrl: "/products/sverlo.jpg",
    externalSource: "TSSP",
    description: "Инструмент из группы «Сверла» — применяется при ремонтных и монтажных работах на предприятиях Группы. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-1715"
      },
      {
        label: "Размер",
        value: "42 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "40 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-008",
    name: "Сверло сборное K5D18025-06",
    sku: "KM-INS-8000",
    erpItemId: "NOM-501672",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-sverla",
    unit: "шт",
    price: 21500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 80
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 75,
    description: "Инструмент из группы «Сверла» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-8000"
      },
      {
        label: "Нормативный срок службы",
        value: "75 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-009",
    name: "Сверло сборное K5D19025-06",
    sku: "KM-INS-6381",
    erpItemId: "NOM-579291",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-sverla",
    unit: "шт",
    price: 33000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 58
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 86
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 65,
    description: "Инструмент из группы «Сверла» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-6381"
      },
      {
        label: "Нормативный срок службы",
        value: "65 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-010",
    name: "Фреза торцевая EMP02-040-A16-AP16-04C D40ММ",
    sku: "KM-INS-1993",
    erpItemId: "NOM-593529",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-frezy",
    unit: "шт",
    price: 135500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 1
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 100,
    description: "Инструмент из группы «Фрезы» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-1993"
      },
      {
        label: "Диаметр",
        value: "40 мм"
      },
      {
        label: "Размер",
        value: "40 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "100 дн."
      }
    ]
  },
  {
    id: "prd-instrumenty-i-011",
    name: "Фреза торцевая EMP02-080-A27-AP16-07C D80ММ",
    sku: "KM-INS-9374",
    erpItemId: "NOM-515910",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-frezy",
    unit: "шт",
    price: 92000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 84
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 66
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 8
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 120,
    externalSource: "TSSP",
    description: "Инструмент из группы «Фрезы» — применяется при ремонтных и монтажных работах на предприятиях Группы. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-9374"
      },
      {
        label: "Диаметр",
        value: "80 мм"
      },
      {
        label: "Размер",
        value: "80 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "120 дн."
      }
    ]
  },
  {
    id: "prd-instrumenty-i-012",
    name: "Фреза концевая D25ММ EPAV12M025C25.0R03L",
    sku: "KM-INS-7755",
    erpItemId: "NOM-538291",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-frezy",
    unit: "шт",
    price: 113500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 1
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 11
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 100,
    externalSource: "TSSP",
    description: "Инструмент из группы «Фрезы» — применяется при ремонтных и монтажных работах на предприятиях Группы. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-7755"
      },
      {
        label: "Диаметр",
        value: "25 мм"
      },
      {
        label: "Размер",
        value: "25 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "100 дн."
      }
    ]
  },
  {
    id: "prd-instrumenty-i-013",
    name: "Метчик М22Х1,5 машинно-ручной",
    sku: "KM-INS-6136",
    erpItemId: "NOM-560672",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-metchiki",
    unit: "шт",
    price: 2600,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 360
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 40,
    description: "Инструмент из группы «Метчики» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-6136"
      },
      {
        label: "Резьба",
        value: "M22×1,5"
      },
      {
        label: "Нормативный срок службы",
        value: "40 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-014",
    name: "Метчик М14Х2 гаечный",
    sku: "KM-INS-8469",
    erpItemId: "NOM-504005",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-metchiki",
    unit: "шт",
    price: 9400,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 500
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 370
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 50,
    externalSource: "TSSP",
    description: "Инструмент из группы «Метчики» — применяется при ремонтных и монтажных работах на предприятиях Группы. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-8469"
      },
      {
        label: "Резьба",
        value: "M14×2"
      },
      {
        label: "Нормативный срок службы",
        value: "50 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-015",
    name: "Метчик М14Х1,5 машинно-ручной ГОСТ 3266-81",
    sku: "KM-INS-6850",
    erpItemId: "NOM-526386",
    categoryId: "cat-instrumenty-i-metallorezhuschiy-inst-metchiki",
    unit: "шт",
    price: 7600,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 490
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 90,
    description: "Инструмент из группы «Метчики» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-6850"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 3266-81"
      },
      {
        label: "Резьба",
        value: "M14×1,5"
      },
      {
        label: "Нормативный срок службы",
        value: "90 дн."
      }
    ]
  },
  {
    id: "prd-instrumenty-i-016",
    name: "Трещотка 3/4\" 520-800ММ раздвижная",
    sku: "KM-INS-5231",
    erpItemId: "NOM-548767",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-gaechnye",
    unit: "шт",
    price: 28750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 22
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 46
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 86
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 410,
    imageUrl: "/products/trehcotka.jpg",
    description: "Инструмент из группы «Гаечные ключи» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-5231"
      },
      {
        label: "Размер",
        value: "800 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "410 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-017",
    name: "Набор головок ударных 1/2 17ПРЕДМ №5039920",
    sku: "KM-INS-3612",
    erpItemId: "NOM-571148",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-gaechnye",
    unit: "набор",
    price: 29750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 32
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 30
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 195,
    description: "Инструмент из группы «Гаечные ключи» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-3612"
      },
      {
        label: "В упаковке",
        value: "17 предм"
      },
      {
        label: "Нормативный срок службы",
        value: "195 дн."
      },
      {
        label: "Единица измерения",
        value: "набор"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-018",
    name: "Ключ головка 36ММх200ММ",
    sku: "KM-INS-7041",
    erpItemId: "NOM-514481",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-gaechnye",
    unit: "шт",
    price: 9250,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 400
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 150
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 520,
    description: "Инструмент из группы «Гаечные ключи» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-7041"
      },
      {
        label: "Размер",
        value: "200 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "520 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-019",
    name: "Отвертка Т09 звездочка",
    sku: "KM-INS-5422",
    erpItemId: "NOM-536862",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-otvertki",
    unit: "шт",
    price: 23700,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 18
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 185,
    description: "Инструмент из группы «Отвертки» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-5422"
      },
      {
        label: "Нормативный срок службы",
        value: "185 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-020",
    name: "Набор отверток 6ШТ диэлектрических 1097006",
    sku: "KM-INS-5802",
    erpItemId: "NOM-506338",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-otvertki",
    unit: "набор",
    price: 7700,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 430
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 480
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 150,
    description: "Инструмент из группы «Отвертки» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-5802"
      },
      {
        label: "В упаковке",
        value: "6 шт"
      },
      {
        label: "Нормативный срок службы",
        value: "150 дн."
      },
      {
        label: "Единица измерения",
        value: "набор"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-021",
    name: "Набор отверток 7ПРЕДМЕТ диэлектрических 288400700",
    sku: "KM-INS-7421",
    erpItemId: "NOM-583957",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-otvertki",
    unit: "набор",
    price: 9600,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 600
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 430
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 590
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 210,
    description: "Инструмент из группы «Отвертки» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-7421"
      },
      {
        label: "В упаковке",
        value: "7 предмет"
      },
      {
        label: "Нормативный срок службы",
        value: "210 дн."
      },
      {
        label: "Единица измерения",
        value: "набор"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-022",
    name: "Черенок напильника",
    sku: "KM-INS-2564",
    erpItemId: "NOM-551100",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-napilniki",
    unit: "шт",
    price: 5900,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 580
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 270
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 240
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 100,
    externalSource: "Garwin",
    description: "Инструмент из группы «Напильники» — применяется при ремонтных и монтажных работах на предприятиях Группы. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-2564"
      },
      {
        label: "Нормативный срок службы",
        value: "100 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-023",
    name: "Надфиль трехграннный односторон.",
    sku: "KM-INS-4183",
    erpItemId: "NOM-528719",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-napilniki",
    unit: "шт",
    price: 9400,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 190
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 105,
    description: "Инструмент из группы «Напильники» — применяется при ремонтных и монтажных работах на предприятиях Группы. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-4183"
      },
      {
        label: "Нормативный срок службы",
        value: "105 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-instrumenty-i-024",
    name: "Напильник плоский 150ММ №1 тупоносый 2820-0011 ГОСТ 1465-80",
    sku: "KM-INS-8326",
    erpItemId: "NOM-595862",
    categoryId: "cat-instrumenty-i-ruchnoy-instrument-napilniki",
    unit: "шт",
    price: 8600,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 380
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 65,
    imageUrl: "/products/napilnik.png",
    externalSource: "TSSP",
    description: "Инструмент из группы «Напильники» — применяется при ремонтных и монтажных работах на предприятиях Группы. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-INS-8326"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 1465-80"
      },
      {
        label: "Размер",
        value: "150 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "65 дн."
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-001",
    name: "Пластина твердосплавная 13632 Т5К10",
    sku: "KM-RAS-3583",
    erpItemId: "NOM-520961",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-tverdosplavnye",
    unit: "упак",
    price: 75500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 86
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 22
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 86
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 25,
    externalSource: "TSSP",
    description: "Расходный материал из группы «Твердосплавные пластины» — списывается по факту выработки. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-3583"
      },
      {
        label: "Нормативный срок службы",
        value: "25 дн."
      },
      {
        label: "Единица измерения",
        value: "упак"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-002",
    name: "Пластина твердосплавная 67420 ВК6ОМ",
    sku: "KM-RAS-5202",
    erpItemId: "NOM-543342",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-tverdosplavnye",
    unit: "упак",
    price: 23000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 54
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 60,
    externalSource: "TSSP",
    description: "Расходный материал из группы «Твердосплавные пластины» — списывается по факту выработки. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-5202"
      },
      {
        label: "Нормативный срок службы",
        value: "60 дн."
      },
      {
        label: "Единица измерения",
        value: "упак"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-003",
    name: "Пластина сменная многогранная HFPR6030 IC808",
    sku: "KM-RAS-6821",
    erpItemId: "NOM-565723",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-tverdosplavnye",
    unit: "упак",
    price: 57500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 36
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 62
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 50,
    description: "Расходный материал из группы «Твердосплавные пластины» — списывается по факту выработки. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-6821"
      },
      {
        label: "Нормативный срок службы",
        value: "50 дн."
      },
      {
        label: "Единица измерения",
        value: "упак"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-004",
    name: "Коронка буровая 7581-6051A-F70 D51ММ Α360",
    sku: "KM-RAS-4488",
    erpItemId: "NOM-509056",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-burovye",
    unit: "шт",
    price: 169500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 8
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 85,
    externalSource: "Garwin",
    description: "Расходный материал из группы «Буровые коронки» — списывается по факту выработки. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-4488"
      },
      {
        label: "Диаметр",
        value: "51 мм"
      },
      {
        label: "Размер",
        value: "51 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "85 дн."
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-005",
    name: "Коронка алмазная 07 кс-то D95,6ММ",
    sku: "KM-RAS-6107",
    erpItemId: "NOM-531437",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-burovye",
    unit: "шт",
    price: 161500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 5
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 3
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 80,
    description: "Расходный материал из группы «Буровые коронки» — списывается по факту выработки. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-6107"
      },
      {
        label: "Диаметр",
        value: "95,6 мм"
      },
      {
        label: "Размер",
        value: "95,6 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "80 дн."
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-006",
    name: "Коронка 7528-5604-S65/S81 D204ММ ST58 буровая",
    sku: "KM-RAS-7726",
    erpItemId: "NOM-553818",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-burovye",
    unit: "шт",
    price: 33000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 58
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 10
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 8
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 120,
    description: "Расходный материал из группы «Буровые коронки» — списывается по факту выработки. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-7726"
      },
      {
        label: "Диаметр",
        value: "204 мм"
      },
      {
        label: "Размер",
        value: "204 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "120 дн."
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-007",
    name: "Цанга 470E-08",
    sku: "KM-RAS-9345",
    erpItemId: "NOM-576199",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-cangi",
    unit: "шт",
    price: 20000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 6
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 180,
    description: "Расходный материал из группы «Цанги» — списывается по факту выработки. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-9345"
      },
      {
        label: "Нормативный срок службы",
        value: "180 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-008",
    name: "Цанга 470ЕP-16",
    sku: "KM-RAS-7012",
    erpItemId: "NOM-577628",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-cangi",
    unit: "шт",
    price: 15000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 74
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 34
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 72
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 335,
    description: "Расходный материал из группы «Цанги» — списывается по факту выработки. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-7012"
      },
      {
        label: "Нормативный срок службы",
        value: "335 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-009",
    name: "Цанга 472ЕР-08",
    sku: "KM-RAS-8631",
    erpItemId: "NOM-500009",
    categoryId: "cat-rashodnye-materialy-instrumentalnaya-osnas-cangi",
    unit: "шт",
    price: 13750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 34
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 360,
    description: "Расходный материал из группы «Цанги» — списывается по факту выработки. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-8631"
      },
      {
        label: "Нормативный срок службы",
        value: "360 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-010",
    name: "Круг шлифовальный 200X20X32 25А F45 K6 V35М/С 2 кл",
    sku: "KM-RAS-5773",
    erpItemId: "NOM-585771",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-shlifovalnye",
    unit: "шт",
    price: 7050,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 270
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 360
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 480
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 35,
    imageUrl: "/products/krug-shlif.jpg",
    externalSource: "TSSP",
    description: "Расходный материал из группы «Шлифовальные круги» — списывается по факту выработки. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-5773"
      },
      {
        label: "Номинальный ток",
        value: "25 А"
      },
      {
        label: "Нормативный срок службы",
        value: "35 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-011",
    name: "Круг шлифовальный 100Х20Х20 25А 60К 6 V 50 2",
    sku: "KM-RAS-4154",
    erpItemId: "NOM-563390",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-shlifovalnye",
    unit: "шт",
    price: 6650,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 320
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 250
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 15,
    description: "Расходный материал из группы «Шлифовальные круги» — списывается по факту выработки. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-4154"
      },
      {
        label: "Номинальный ток",
        value: "25 А"
      },
      {
        label: "Нормативный срок службы",
        value: "15 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-012",
    name: "Круг шлифовальный алмаз. 12V9 75X20X20 3-10 DF64-3-PD",
    sku: "KM-RAS-2535",
    erpItemId: "NOM-541009",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-shlifovalnye",
    unit: "шт",
    price: 3150,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 60
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 45,
    description: "Расходный материал из группы «Шлифовальные круги» — списывается по факту выработки. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-2535"
      },
      {
        label: "Нормативный срок службы",
        value: "45 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-013",
    name: "Шкурка шлиф. на тканевой основе 700ММ Р50 водост.",
    sku: "KM-RAS-9916",
    erpItemId: "NOM-518628",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-shlifovalnye-2",
    unit: "рул",
    price: 3400,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 240
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 260
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 460
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 20,
    description: "Расходный материал из группы «Шлифовальные шкурки» — списывается по факту выработки. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-9916"
      },
      {
        label: "Размер",
        value: "50"
      },
      {
        label: "Нормативный срок службы",
        value: "20 дн."
      },
      {
        label: "Единица измерения",
        value: "рул"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-014",
    name: "Шкурка шлиф. на тканевой основе №0-6 720ММ 14А",
    sku: "KM-RAS-8297",
    erpItemId: "NOM-596247",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-shlifovalnye-2",
    unit: "рул",
    price: 3600,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 40
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 360
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 60,
    description: "Расходный материал из группы «Шлифовальные шкурки» — списывается по факту выработки. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-8297"
      },
      {
        label: "Размер",
        value: "720 мм"
      },
      {
        label: "Номинальный ток",
        value: "14 А"
      },
      {
        label: "Нормативный срок службы",
        value: "60 дн."
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-015",
    name: "Шкурка шлиф. на тканевой основе №12-16",
    sku: "KM-RAS-6678",
    erpItemId: "NOM-573866",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-shlifovalnye-2",
    unit: "рул",
    price: 10800,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 28
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 40,
    description: "Расходный материал из группы «Шлифовальные шкурки» — списывается по факту выработки. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-6678"
      },
      {
        label: "Нормативный срок службы",
        value: "40 дн."
      },
      {
        label: "Единица измерения",
        value: "рул"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-016",
    name: "Жшпт ерши ф 5060 6-10-40-П-20",
    sku: "KM-RAS-5059",
    erpItemId: "NOM-551485",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-provolochnye",
    unit: "шт",
    price: 1650,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 480
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 590
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 160
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 65,
    description: "Расходный материал из группы «Проволочные ерши» — списывается по факту выработки. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-5059"
      },
      {
        label: "Нормативный срок службы",
        value: "65 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-017",
    name: "Ерши ф 6-10-40-П-20",
    sku: "KM-RAS-3440",
    erpItemId: "NOM-529104",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-provolochnye",
    unit: "шт",
    price: 5450,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 70
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 420
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 50,
    externalSource: "Lamed",
    description: "Расходный материал из группы «Проволочные ерши» — списывается по факту выработки. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-3440"
      },
      {
        label: "Нормативный срок службы",
        value: "50 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-018",
    name: "Жшпт ерши Ф40 6-10-40-П-20",
    sku: "KM-RAS-1821",
    erpItemId: "NOM-564819",
    categoryId: "cat-rashodnye-materialy-abrazivnye-materialy-provolochnye",
    unit: "шт",
    price: 800,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 3600
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 75,
    description: "Расходный материал из группы «Проволочные ерши» — списывается по факту выработки. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-1821"
      },
      {
        label: "Нормативный срок службы",
        value: "75 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-019",
    name: "Электрод FOX SAS-2-A-4,0 E347-17",
    sku: "KM-RAS-9202",
    erpItemId: "NOM-542438",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-svarochnye",
    unit: "кг",
    price: 3850,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 80
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 200
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 160
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 30,
    imageUrl: "/products/elektrody.jpg",
    description: "Расходный материал из группы «Сварочные электроды» — списывается по факту выработки. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-9202"
      },
      {
        label: "Нормативный срок службы",
        value: "30 дн."
      },
      {
        label: "Единица измерения",
        value: "кг"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-020",
    name: "Пруток сварочный D2ММ алюминиевый ER 5356 (AlMg5, АМГ5)",
    sku: "KM-RAS-4290",
    erpItemId: "NOM-572962",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-svarochnye",
    unit: "кг",
    price: 4900,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 130
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 40,
    externalSource: "Lamed",
    description: "Расходный материал из группы «Сварочные электроды» — списывается по факту выработки. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-4290"
      },
      {
        label: "Диаметр",
        value: "2 мм"
      },
      {
        label: "Размер",
        value: "2 мм"
      },
      {
        label: "Нормативный срок службы",
        value: "40 дн."
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-021",
    name: "Электрод ОЗЛ-8 D4ММ ГОСТ 9466-75, ГОСТ 10052-75",
    sku: "KM-RAS-2671",
    erpItemId: "NOM-595343",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-svarochnye",
    unit: "кг",
    price: 9100,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 300
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 280
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 320
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 40,
    description: "Расходный материал из группы «Сварочные электроды» — списывается по факту выработки. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-2671"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 9466-75"
      },
      {
        label: "Диаметр",
        value: "4 мм"
      },
      {
        label: "Размер",
        value: "4 мм"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-022",
    name: "Держатель наконечника М6/М8х25хМ10х1,0",
    sku: "KM-RAS-7528",
    erpItemId: "NOM-528200",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-rashodnye",
    unit: "шт",
    price: 7250,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 180
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 80
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 250
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 70,
    description: "Расходный материал из группы «Расходные материалы для сварочных горелок» — списывается по факту выработки. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-7528"
      },
      {
        label: "Резьба",
        value: "M8×25"
      },
      {
        label: "Нормативный срок службы",
        value: "70 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-023",
    name: "Катод G-30 для плазмотрона S45",
    sku: "KM-RAS-5909",
    erpItemId: "NOM-550581",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-rashodnye",
    unit: "шт",
    price: 23750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 30
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 68
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 40,
    externalSource: "Lamed",
    description: "Расходный материал из группы «Расходные материалы для сварочных горелок» — списывается по факту выработки. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-5909"
      },
      {
        label: "Нормативный срок службы",
        value: "40 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-024",
    name: "Диффузор TBI 7W газовый",
    sku: "KM-RAS-6814",
    erpItemId: "NOM-562486",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-rashodnye",
    unit: "шт",
    price: 14750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 30
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 62
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 72
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    serviceLifeDays: 60,
    description: "Расходный материал из группы «Расходные материалы для сварочных горелок» — списывается по факту выработки. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-6814"
      },
      {
        label: "Нормативный срок службы",
        value: "60 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-025",
    name: "Сопло 130А 220182",
    sku: "KM-RAS-5195",
    erpItemId: "NOM-584867",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-sopla",
    unit: "шт",
    price: 2200,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 250
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 400
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    serviceLifeDays: 85,
    externalSource: "Lamed",
    description: "Расходный материал из группы «Сопла для резки» — списывается по факту выработки. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-5195"
      },
      {
        label: "Номинальный ток",
        value: "130 А"
      },
      {
        label: "Нормативный срок службы",
        value: "85 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-026",
    name: "Сопло 30А 220193",
    sku: "KM-RAS-1052",
    erpItemId: "NOM-517724",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-sopla",
    unit: "шт",
    price: 3700,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 470
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 130
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    serviceLifeDays: 30,
    description: "Расходный материал из группы «Сопла для резки» — списывается по факту выработки. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-1052"
      },
      {
        label: "Номинальный ток",
        value: "30 А"
      },
      {
        label: "Нормативный срок службы",
        value: "30 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-rashodnye-materialy-027",
    name: "Кожух сопла 220313",
    sku: "KM-RAS-8433",
    erpItemId: "NOM-540105",
    categoryId: "cat-rashodnye-materialy-rashodnye-materialy-sopla",
    unit: "шт",
    price: 6400,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 500
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    serviceLifeDays: 40,
    description: "Расходный материал из группы «Сопла для резки» — списывается по факту выработки. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-RAS-8433"
      },
      {
        label: "Материал",
        value: "КОЖ"
      },
      {
        label: "Нормативный срок службы",
        value: "40 дн."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-001",
    name: "Болт 7008-9134-01",
    sku: "KM-MET-7947",
    erpItemId: "NOM-586125",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-bolty",
    unit: "шт",
    price: 485,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 1500
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 1500
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    imageUrl: "/products/bolt.jpg",
    description: "Крепёжное изделие из группы «Болты» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-7947"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-002",
    name: "Винт клина SANDVIK 7008-9134-03",
    sku: "KM-MET-3804",
    erpItemId: "NOM-553268",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-bolty",
    unit: "шт",
    price: 1250,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 220
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 330
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    externalSource: "TSSP",
    description: "Крепёжное изделие из группы «Болты» — применяется при ремонте и монтаже оборудования. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-3804"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-003",
    name: "Винт M8Х1,0Х21Х9,68Х7,9Х3ММ VHX0821",
    sku: "KM-MET-2185",
    erpItemId: "NOM-530887",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-bolty",
    unit: "шт",
    price: 690,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 1750
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 700
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 1600
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Крепёжное изделие из группы «Болты» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-2185"
      },
      {
        label: "Размер",
        value: "3 мм"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-004",
    name: "Гайка M16 SANDVIK 7008-9120",
    sku: "KM-MET-7042",
    erpItemId: "NOM-598030",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-gayki",
    unit: "шт",
    price: 795,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 3050
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 800
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 1050
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Крепёжное изделие из группы «Гайки» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-7042"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-005",
    name: "Гайка 25 (БЕЗ РЕЗЬБЫ) КЗ-6636.002",
    sku: "KM-MET-5423",
    erpItemId: "NOM-575649",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-gayki",
    unit: "шт",
    price: 435,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 2250
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "Lamed",
    description: "Крепёжное изделие из группы «Гайки» — применяется при ремонте и монтаже оборудования. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-5423"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-006",
    name: "Гайка Tr400x12LH Ф-36993",
    sku: "KM-MET-1280",
    erpItemId: "NOM-542792",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-gayki",
    unit: "шт",
    price: 340,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 1450
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Крепёжное изделие из группы «Гайки» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-1280"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-007",
    name: "Шайба стопорная М16 SANDVIK 7008-4341-19",
    sku: "KM-MET-8661",
    erpItemId: "NOM-520411",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-shayby",
    unit: "шт",
    price: 160,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 1300
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 500
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Крепёжное изделие из группы «Шайбы» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-8661"
      },
      {
        label: "Резьба",
        value: "M16"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-008",
    name: "Шайба стопорная М16 7008-9135-01",
    sku: "KM-MET-5614",
    erpItemId: "NOM-587554",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-shayby",
    unit: "шт",
    price: 165,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 3650
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 1800
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 2200
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Крепёжное изделие из группы «Шайбы» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-5614"
      },
      {
        label: "Резьба",
        value: "M16"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-009",
    name: "Шайба С10.01.10 ГОСТ 11371-78",
    sku: "KM-MET-3995",
    erpItemId: "NOM-565173",
    categoryId: "cat-metizy-i-izdeliya-rezbovye-shayby",
    unit: "шт",
    price: 335,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 1300
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "Garwin",
    description: "Крепёжное изделие из группы «Шайбы» — применяется при ремонте и монтаже оборудования. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-3995"
      },
      {
        label: "Стандарт",
        value: "ГОСТ 11371-78"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-010",
    name: "Хомут 16ММ длина 420ММ ширина 70ММ",
    sku: "KM-MET-5757",
    erpItemId: "NOM-594557",
    categoryId: "cat-metizy-i-zazhimy-i-homuty",
    unit: "шт",
    price: 550,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 1100
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 1000
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Крепёжное изделие из группы «Хомуты» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-5757"
      },
      {
        label: "Размер",
        value: "16 мм"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-011",
    name: "Жшпт клиня 6-10-40-П-30",
    sku: "KM-MET-7376",
    erpItemId: "NOM-572176",
    categoryId: "cat-metizy-i-zazhimy-i-podderzhivayuschie",
    unit: "шт",
    price: 2900,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 370
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Крепёжное изделие из группы «Поддерживающие зажимы» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-7376"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-012",
    name: "Клиня 6-10-40-П-30",
    sku: "KM-MET-2519",
    erpItemId: "NOM-539319",
    categoryId: "cat-metizy-i-zazhimy-i-podderzhivayuschie",
    unit: "шт",
    price: 9200,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 580
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "TSSP",
    description: "Крепёжное изделие из группы «Поддерживающие зажимы» — применяется при ремонте и монтаже оборудования. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-2519"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-013",
    name: "Зажим канатный (ТРОСОВЫЙ) К-676-У3",
    sku: "KM-MET-4138",
    erpItemId: "NOM-516938",
    categoryId: "cat-metizy-i-zazhimy-i-podderzhivayuschie",
    unit: "шт",
    price: 9600,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 390
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 120
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 340
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Крепёжное изделие из группы «Поддерживающие зажимы» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-4138"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-014",
    name: "Зажим канатный (ТРОСОВЫЙ) D22 DIN 741",
    sku: "KM-MET-8281",
    erpItemId: "NOM-584081",
    categoryId: "cat-metizy-i-zazhimy-i-kanatnye",
    unit: "шт",
    price: 1250,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 430
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 200
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 400
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    externalSource: "Lamed",
    description: "Крепёжное изделие из группы «Канатные зажимы» — применяется при ремонте и монтаже оборудования. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-8281"
      },
      {
        label: "Стандарт",
        value: "DIN 741"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-015",
    name: "Зажим канатный (ТРОСОВЫЙ) D40 DIN 741",
    sku: "KM-MET-9900",
    erpItemId: "NOM-561700",
    categoryId: "cat-metizy-i-zazhimy-i-kanatnye",
    unit: "шт",
    price: 5250,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 120
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 600
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Крепёжное изделие из группы «Канатные зажимы» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-9900"
      },
      {
        label: "Стандарт",
        value: "DIN 741"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-016",
    name: "Зажим канатный (ТРОСОВЫЙ) D10 DIN 741",
    sku: "KM-MET-5043",
    erpItemId: "NOM-528843",
    categoryId: "cat-metizy-i-zazhimy-i-kanatnye",
    unit: "шт",
    price: 4400,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 390
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 580
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Крепёжное изделие из группы «Канатные зажимы» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-5043"
      },
      {
        label: "Стандарт",
        value: "DIN 741"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-017",
    name: "Проушины навесных замков PSL-PE1",
    sku: "KM-MET-6662",
    erpItemId: "NOM-506462",
    categoryId: "cat-metizy-i-specialnyy-krepezh-proushiny",
    unit: "шт",
    price: 4750,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 260
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    externalSource: "TSSP",
    description: "Крепёжное изделие из группы «Проушины» — применяется при ремонте и монтаже оборудования. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-6662"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-018",
    name: "Ушко У1-7-16",
    sku: "KM-MET-9709",
    erpItemId: "NOM-573605",
    categoryId: "cat-metizy-i-specialnyy-krepezh-proushiny",
    unit: "шт",
    price: 2900,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 250
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 60
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 540
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    externalSource: "TSSP",
    description: "Крепёжное изделие из группы «Проушины» — применяется при ремонте и монтаже оборудования. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-9709"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-019",
    name: "Ухо контакное ч.бм 7034",
    sku: "KM-MET-2328",
    erpItemId: "NOM-551224",
    categoryId: "cat-metizy-i-specialnyy-krepezh-proushiny",
    unit: "шт",
    price: 3800,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 250
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 540
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Крепёжное изделие из группы «Проушины» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-2328"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-020",
    name: "Клин пазовый",
    sku: "KM-MET-8184",
    erpItemId: "NOM-582888",
    categoryId: "cat-metizy-i-specialnyy-krepezh-montazhnye",
    unit: "шт",
    price: 1700,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 320
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 310
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 210
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    externalSource: "Lamed",
    description: "Крепёжное изделие из группы «Монтажные клинья» — применяется при ремонте и монтаже оборудования. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-8184"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-021",
    name: "Клин отделительный 20Х20Х0,13",
    sku: "KM-MET-6565",
    erpItemId: "NOM-560507",
    categoryId: "cat-metizy-i-specialnyy-krepezh-montazhnye",
    unit: "шт",
    price: 4550,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 350
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 400
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Крепёжное изделие из группы «Монтажные клинья» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-6565"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-022",
    name: "Клин B913S7450B",
    sku: "KM-MET-4946",
    erpItemId: "NOM-538126",
    categoryId: "cat-metizy-i-specialnyy-krepezh-montazhnye",
    unit: "шт",
    price: 3050,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 320
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Крепёжное изделие из группы «Монтажные клинья» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-4946"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-023",
    name: "Шпонка опорного кольца №М.1395",
    sku: "KM-MET-3327",
    erpItemId: "NOM-515745",
    categoryId: "cat-metizy-i-specialnyy-krepezh-shponki",
    unit: "шт",
    price: 850,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 2000
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 2650
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 1200
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Крепёжное изделие из группы «Шпонки» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-3327"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-024",
    name: "Шпонка 314042-П2",
    sku: "KM-MET-1708",
    erpItemId: "NOM-593364",
    categoryId: "cat-metizy-i-specialnyy-krepezh-shponki",
    unit: "шт",
    price: 1850,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 70
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 230
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Крепёжное изделие из группы «Шпонки» — применяется при ремонте и монтаже оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-1708"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-metizy-i-025",
    name: "Шпонка специальная насоса 1Д 1250-125 Ч.ГМ10574.49",
    sku: "KM-MET-9089",
    erpItemId: "NOM-570983",
    categoryId: "cat-metizy-i-specialnyy-krepezh-shponki",
    unit: "шт",
    price: 4050,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 150
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    externalSource: "Lamed",
    description: "Крепёжное изделие из группы «Шпонки» — применяется при ремонте и монтаже оборудования. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-MET-9089"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-001",
    name: "Выключатель авт. ВА88-33 3Р 160А 35КА",
    sku: "KM-ELE-1129",
    erpItemId: "NOM-513631",
    categoryId: "cat-elektrotehnika-i-promyshlennaya-avtomat-avtomaticheskie",
    unit: "шт",
    price: 75000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 8
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 22
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    imageUrl: "/products/vyklyuchatel.jpg",
    externalSource: "Garwin",
    description: "Электротехническое изделие из группы «Автоматические выключатели» — для систем питания и автоматизации оборудования. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-1129"
      },
      {
        label: "Номинальный ток",
        value: "160 А"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-002",
    name: "Выключатель авт. ВА25-29DC-2-С-2 2P 2А (C)",
    sku: "KM-ELE-5728",
    erpItemId: "NOM-546488",
    categoryId: "cat-elektrotehnika-i-promyshlennaya-avtomat-avtomaticheskie",
    unit: "шт",
    price: 58500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 24
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 64
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Электротехническое изделие из группы «Автоматические выключатели» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-5728"
      },
      {
        label: "Номинальный ток",
        value: "2 А"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-003",
    name: "Датчик ВБО-У25-80У-1273-ЛА",
    sku: "KM-ELE-4109",
    erpItemId: "NOM-568869",
    categoryId: "cat-elektrotehnika-i-promyshlennaya-avtomat-datchiki",
    unit: "шт",
    price: 89500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 8
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 88
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 84
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Электротехническое изделие из группы «Датчики температуры» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-4109"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-004",
    name: "Датчик температуры ДТС034-РТ100.ВЗ.20/0,5",
    sku: "KM-ELE-5986",
    erpItemId: "NOM-580774",
    categoryId: "cat-elektrotehnika-i-promyshlennaya-avtomat-datchiki",
    unit: "шт",
    price: 82500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 60
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 46
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Электротехническое изделие из группы «Датчики температуры» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-5986"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-005",
    name: "Датчик КСЛ-2М",
    sku: "KM-ELE-7605",
    erpItemId: "NOM-503155",
    categoryId: "cat-elektrotehnika-i-promyshlennaya-avtomat-datchiki",
    unit: "шт",
    price: 51000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 6
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 6
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 86
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Электротехническое изделие из группы «Датчики температуры» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-7605"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-006",
    name: "Кнопка КУ-123-11",
    sku: "KM-ELE-2748",
    erpItemId: "NOM-536012",
    categoryId: "cat-elektrotehnika-i-promyshlennaya-avtomat-pereklyuchateli",
    unit: "шт",
    price: 11000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 10
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 80
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 10
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    externalSource: "TSSP",
    description: "Электротехническое изделие из группы «Переключатели» — для систем питания и автоматизации оборудования. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-2748"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-007",
    name: "Переключатель 4G10-53-U-S1-R014 кулачковый",
    sku: "KM-ELE-4367",
    erpItemId: "NOM-558393",
    categoryId: "cat-elektrotehnika-i-promyshlennaya-avtomat-pereklyuchateli",
    unit: "шт",
    price: 26000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 36
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Электротехническое изделие из группы «Переключатели» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-4367"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-008",
    name: "Переключатель 4G10-55-OU-S1-R014 кулачковый",
    sku: "KM-ELE-3462",
    erpItemId: "NOM-512202",
    categoryId: "cat-elektrotehnika-i-promyshlennaya-avtomat-pereklyuchateli",
    unit: "шт",
    price: 39500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 48
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 28
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 86
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Электротехническое изделие из группы «Переключатели» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-3462"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-009",
    name: "Клемник WAGO 221-413 3-ПРОВ 0,08-2,5-4 мм.кв",
    sku: "KM-ELE-5081",
    erpItemId: "NOM-534583",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-klemmy",
    unit: "шт",
    price: 1050,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 490
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Электротехническое изделие из группы «Клеммы электрические» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-5081"
      },
      {
        label: "Размер",
        value: "4 мм"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-010",
    name: "Наконечник кабельный круглый C-RC 2,5/M4 DIN 3240078 100ШТ",
    sku: "KM-ELE-3745",
    erpItemId: "NOM-578441",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-klemmy",
    unit: "шт",
    price: 4400,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 490
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 540
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Электротехническое изделие из группы «Клеммы электрические» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-3745"
      },
      {
        label: "В упаковке",
        value: "100 шт"
      },
      {
        label: "Стандарт",
        value: "DIN 3240078"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-011",
    name: "Наконечник кабельный круглый C-RC 2,5/M5 DIN 3240079 100ШТ",
    sku: "KM-ELE-5364",
    erpItemId: "NOM-556060",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-klemmy",
    unit: "шт",
    price: 1300,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 390
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Электротехническое изделие из группы «Клеммы электрические» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-5364"
      },
      {
        label: "В упаковке",
        value: "100 шт"
      },
      {
        label: "Стандарт",
        value: "DIN 3240079"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-012",
    name: "Часть нижняя пульта TOPPULT TP 6700.500 600х675х400",
    sku: "KM-ELE-9507",
    erpItemId: "NOM-523203",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-elektrotehnicheskie",
    unit: "шт",
    price: 206000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 1
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    externalSource: "TSSP",
    description: "Электротехническое изделие из группы «Электротехнические шкафы и корпуса» — для систем питания и автоматизации оборудования. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-9507"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-013",
    name: "Коробка шахтная высоковольтная 400х250ММ",
    sku: "KM-ELE-2126",
    erpItemId: "NOM-500822",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-elektrotehnicheskie",
    unit: "шт",
    price: 259000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 10
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 4
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 8
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Электротехническое изделие из группы «Электротехнические шкафы и корпуса» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-2126"
      },
      {
        label: "Размер",
        value: "250 мм"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-014",
    name: "Шкаф ШКУ-02-500Х400Х250 коммутационный антивандальный",
    sku: "KM-ELE-1221",
    erpItemId: "NOM-588917",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-elektrotehnicheskie",
    unit: "шт",
    price: 84000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 28
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Электротехническое изделие из группы «Электротехнические шкафы и корпуса» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-1221"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-015",
    name: "Разъем D-SUB 9-ПОЛЮСНЫЙ, PROFIBUS DP до 12МБИТ/С 2708232",
    sku: "KM-ELE-2840",
    erpItemId: "NOM-566536",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-elektricheskie",
    unit: "шт",
    price: 4700,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 230
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 120
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 60
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    externalSource: "Lamed",
    description: "Электротехническое изделие из группы «Электрические разъемы» — для систем питания и автоматизации оборудования. Позиция из каталога Lamed — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-2840"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-016",
    name: "Переходник на евро розетку 47Х58Х22 белый",
    sku: "KM-ELE-6983",
    erpItemId: "NOM-533679",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-elektricheskie",
    unit: "шт",
    price: 23300,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 62
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 84
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 72
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Электротехническое изделие из группы «Электрические разъемы» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-6983"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-017",
    name: "Разъем герметичный RJ45 IP68 с проходным адаптером 2X8P8C",
    sku: "KM-ELE-8602",
    erpItemId: "NOM-511298",
    categoryId: "cat-elektrotehnika-i-elektromontazhnye-izde-elektricheskie",
    unit: "шт",
    price: 23000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 40
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 26
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Электротехническое изделие из группы «Электрические разъемы» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-8602"
      },
      {
        label: "Степень защиты",
        value: "IP68"
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-018",
    name: "Ибп 6000ВА 230В SRT6KXLI",
    sku: "KM-ELE-8793",
    erpItemId: "NOM-599393",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-istochniki",
    unit: "шт",
    price: 187500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 5
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Электротехническое изделие из группы «Источники питания» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-8793"
      },
      {
        label: "Напряжение",
        value: "230 В"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-019",
    name: "Преобразователь напряжения 12/220 1500ВТ инверторный",
    sku: "KM-ELE-1412",
    erpItemId: "NOM-577012",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-istochniki",
    unit: "шт",
    price: 31500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 78
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 68
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 44
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    externalSource: "Garwin",
    description: "Электротехническое изделие из группы «Источники питания» — для систем питания и автоматизации оборудования. Позиция из каталога Garwin — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-1412"
      },
      {
        label: "Мощность",
        value: "1500 Вт"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-020",
    name: "Блок питания 76ВТ 24В 3,2А DIN",
    sku: "KM-ELE-7700",
    erpItemId: "NOM-515196",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-istochniki",
    unit: "шт",
    price: 88500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 26
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    externalSource: "TSSP",
    description: "Электротехническое изделие из группы «Источники питания» — для систем питания и автоматизации оборудования. Позиция из каталога TSSP — поставляется напрямую, минуя РЕСХ.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-7700"
      },
      {
        label: "Номинальный ток",
        value: "2 А"
      },
      {
        label: "Напряжение",
        value: "24 В"
      },
      {
        label: "Мощность",
        value: "76 Вт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-021",
    name: "Реле ЭП-41В-21 220В промежуточное",
    sku: "KM-ELE-9319",
    erpItemId: "NOM-592815",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-promezhutochnye",
    unit: "шт",
    price: 36250,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 36
      },
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 26
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 44
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Электротехническое изделие из группы «Промежуточные реле» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-9319"
      },
      {
        label: "Напряжение",
        value: "41 В"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-022",
    name: "Реле 1670138/2543783",
    sku: "KM-ELE-1938",
    erpItemId: "NOM-570434",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-promezhutochnye",
    unit: "шт",
    price: 35500,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 82
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 8
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Электротехническое изделие из группы «Промежуточные реле» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-1938"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-023",
    name: "Реле 3T2662",
    sku: "KM-ELE-3557",
    erpItemId: "NOM-548053",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-promezhutochnye",
    unit: "шт",
    price: 40250,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 38
      }
    ],
    primaryWarehouseId: "wh-zhz",
    primaryRegionId: "reg-zhz",
    description: "Электротехническое изделие из группы «Промежуточные реле» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Жезказган по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-3557"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-024",
    name: "Пускатель многофункциональн TESYS U 12А 110-240VAC UIMP-6KV",
    sku: "KM-ELE-1224",
    erpItemId: "NOM-504720",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-puskateli",
    unit: "шт",
    price: 20000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 18
      },
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 56
      }
    ],
    primaryWarehouseId: "wh-chu",
    primaryRegionId: "reg-chu",
    description: "Электротехническое изделие из группы «Пускатели» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Шатыркуль по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-1224"
      },
      {
        label: "Номинальный ток",
        value: "12 А"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-025",
    name: "Пускатель ПРН-100-УХЛ3 100А 380В РН1 IP54 рудничный",
    sku: "KM-ELE-2843",
    erpItemId: "NOM-582339",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-puskateli",
    unit: "шт",
    price: 71000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-krg",
        regionId: "reg-krg",
        quantity: 52
      }
    ],
    primaryWarehouseId: "wh-krg",
    primaryRegionId: "reg-krg",
    description: "Электротехническое изделие из группы «Пускатели» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Караганда по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-2843"
      },
      {
        label: "Степень защиты",
        value: "IP54"
      },
      {
        label: "Номинальный ток",
        value: "100 А"
      },
      {
        label: "Напряжение",
        value: "380 В"
      }
    ]
  },
  {
    id: "prd-elektrotehnika-i-026",
    name: "Пускатель ПРР-40М-1-УХЛ5 380В с реверсивным приводом",
    sku: "KM-ELE-4462",
    erpItemId: "NOM-559958",
    categoryId: "cat-elektrotehnika-i-silovaya-elektronika-puskateli",
    unit: "шт",
    price: 88000,
    vatRate: 12,
    stock: [
      {
        warehouseId: "wh-blh",
        regionId: "reg-blh",
        quantity: 80
      },
      {
        warehouseId: "wh-zhz",
        regionId: "reg-zhz",
        quantity: 38
      },
      {
        warehouseId: "wh-chu",
        regionId: "reg-chu",
        quantity: 78
      }
    ],
    primaryWarehouseId: "wh-blh",
    primaryRegionId: "reg-blh",
    description: "Электротехническое изделие из группы «Пускатели» — для систем питания и автоматизации оборудования. Поставка на РЕСХ Балхаш по рамочному договору категории.",
    specs: [
      {
        label: "Артикул",
        value: "KM-ELE-4462"
      },
      {
        label: "Напряжение",
        value: "380 В"
      },
      {
        label: "Гарантия",
        value: "12 мес."
      },
      {
        label: "Единица измерения",
        value: "шт"
      }
    ]
  }
];

function toStock(rows: ProductRow["stock"]): StockBalance[] {
  return rows.map((row) => ({ ...row, updatedAt: STOCK_SYNCED_AT }));
}

export const PRODUCTS: Product[] = PRODUCT_ROWS.map((row) => {
  const purchaseCategoryId = rootCategoryId(row.categoryId);
  const supplier = supplierOfCategory(purchaseCategoryId);
  if (!supplier) {
    throw new Error(
      `Нет поставщика для категории закупа ${purchaseCategoryId} (позиция ${row.id})`
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
