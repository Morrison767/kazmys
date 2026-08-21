/**
 * Mock-данные прототипа (Этап 1). Наборы согласованы между собой:
 * поставщик выводится от категории закупа, суммы заказов и маршруты
 * согласования собираются из позиций и порогов лимитов, метрики
 * ходимости считаются из архива перезаказов.
 *
 * К UI на этом этапе данные не подключены — это следующие этапы.
 */

// География, предприятия, РЕСХ
export {
  REGIONS,
  ENTERPRISES,
  WAREHOUSES,
  ENTERPRISES_OUTSIDE_ERP,
  regionById,
  enterpriseById,
  warehouseById,
  isOutsideErp,
} from "./regions";

// Цеха и участки
export {
  WORKSHOPS,
  workshopById,
  isCategoryAllowedForWorkshop,
} from "./workshops";

// Категории
export {
  CATEGORIES,
  ROOT_CATEGORY_IDS,
  ACTIVE_ROOT_CATEGORY_IDS,
  categoryById,
  rootCategoryId,
  categoryWithDescendantIds,
  childCategories,
  categoryLevel,
  leafCategories,
  categoryPath,
} from "./categories";

// Поставщики и рамочные договоры
export { SUPPLIERS, supplierById, supplierOfCategory } from "./suppliers";

// Номенклатура
export {
  PRODUCTS,
  productById,
  productsOfPurchaseCategory,
  stockAt,
} from "./products";

// Пользователи
export {
  USERS,
  userById,
  usersByRole,
  defaultUserForRole,
  approverOfWorkshop,
} from "./users";

// Лимиты и нормы расхода
export {
  LIMITS,
  PRODUCT_QUOTAS,
  LIMITS_AT_RISK,
  LIMITS_EXCEEDED,
  limitById,
  limitOf,
  limitUsedPercent,
} from "./limits";

// Заказы
export {
  ORDERS,
  ORDERS_OUTSIDE_ERP,
  orderById,
  ordersByCustomer,
  ordersByWorkshop,
  ordersPendingApproval,
} from "./orders";

// Ходимость инструмента
export {
  TOOL_USAGE_HISTORY,
  TOOL_LIFECYCLE_METRICS,
  CONSUMPTION_ANOMALIES,
  TOOL_ANALYTICS_REPORT_DATE,
  reorderIntervals,
  usageHistoryOf,
} from "./tool-usage-history";
