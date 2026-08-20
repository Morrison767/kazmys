/**
 * Оргструктура и география: регион → предприятие → цех/участок.
 * Источник в проде — D365 F&O (Data Entities, оргструктура и центры затрат);
 * для предприятий вне D365 F&O справочники ведутся в самом маркетплейсе.
 */

/** Учётный контур предприятия — определяет, идёт ли ERP-интеграция. */
export type ErpSystem = "d365fo" | "external";

/** Регион присутствия Группы (см. раздел «География» концепции). */
export interface Region {
  id: string;
  /** Караганда / Балхаш / Жезказган / Чуйская обл. */
  name: string;
  /** Код региона для РЕСХ — регионального единого склада хранения. */
  code: string;
  /** Предприятия региона (id из Enterprise). */
  enterpriseIds: string[];
  /** Признак «в D365 F&O» / «вне D365 F&O» на уровне региона (по умолчанию). */
  erp: ErpSystem;
  /** Название РЕСХ, обслуживающего регион. */
  warehouseName: string;
}

/** Предприятие Группы (или сервисная компания вне D365 F&O). */
export interface Enterprise {
  id: string;
  name: string;
  /** Короткое имя для бейджей и таблиц. */
  shortName: string;
  regionId: string;
  /**
   * Учётный контур конкретного предприятия. Может отличаться от региона:
   * Казахсервис и др. работают на других учётных системах.
   */
  erp: ErpSystem;
  /** БИН — для карточки предприятия и документов. */
  bin?: string;
  workshopIds: string[];
}

/** Цех / участок — единица потребления и точка контроля лимитов. */
export interface Workshop {
  id: string;
  name: string;
  enterpriseId: string;
  regionId: string;
  /** Центр затрат в D365 F&O (для предприятий в контуре ERP). */
  costCenter?: string;
  /**
   * Категории, доступные цеху (ограничение «по типу товара»):
   * буровой участок видит буровой инструмент, но не канцелярию.
   */
  allowedCategoryIds: string[];
  /** РЕСХ по умолчанию для доставки заказов цеха. */
  defaultWarehouseId: string;
}

/** РЕСХ — региональный единый склад хранения. */
export interface Warehouse {
  id: string;
  name: string;
  regionId: string;
  /** Код склада в D365 F&O. */
  erpCode?: string;
  address?: string;
}
