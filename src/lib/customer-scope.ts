import { rootCategoryId } from "@/mocks";
import type {
  Category,
  Enterprise,
  Product,
  Region,
  User,
  Warehouse,
  Workshop,
} from "@/types";

/**
 * Область видимости заказчика: цех, предприятие, регион, РЕСХ доставки
 * и категории, которые цеху разрешено заказывать.
 *
 * Каталог обязан показывать только доступную цеху номенклатуру
 * (ограничение «по типу товара»): буровой участок видит инструмент и СИЗ,
 * но не канцелярию.
 *
 * Функция чистая — её же используют хук useCustomerScope и проверки данных.
 */
export interface CustomerScope {
  user: User | null;
  workshop: Workshop | null;
  enterprise: Enterprise | null;
  region: Region | null;
  /** РЕСХ доставки — подставляется по региону предприятия цеха. */
  warehouse: Warehouse | null;
  /** Категории закупа, доступные цеху (верхний уровень, только активные). */
  allowedCategories: Category[];
  allowedCategoryIds: string[];
  /** Позиции каталога, доступные цеху. */
  availableProducts: Product[];
  /** Работает ли предприятие вне контура D365 F&O. */
  isOutsideErp: boolean;
}

export interface CustomerScopeInput {
  user: User | null;
  workshops: Workshop[];
  enterprises: Enterprise[];
  regions: Region[];
  warehouses: Warehouse[];
  categories: Category[];
  products: Product[];
}

export function computeCustomerScope({
  user,
  workshops,
  enterprises,
  regions,
  warehouses,
  categories,
  products,
}: CustomerScopeInput): CustomerScope {
  const workshop = workshops.find((w) => w.id === user?.workshopId) ?? null;
  const enterprise =
    enterprises.find((e) => e.id === workshop?.enterpriseId) ?? null;
  const region = regions.find((r) => r.id === workshop?.regionId) ?? null;
  const warehouse =
    warehouses.find((w) => w.id === workshop?.defaultWarehouseId) ??
    warehouses.find((w) => w.regionId === workshop?.regionId) ??
    null;

  const allowedCategories = (workshop?.allowedCategoryIds ?? []).flatMap(
    (id) => {
      const category = categories.find((c) => c.id === id);
      // Категория без действующего тендера и каталога недоступна для заказа.
      return category && category.isActive ? [category] : [];
    }
  );

  const availableProducts = products.filter(
    (p) =>
      !p.isArchived &&
      allowedCategories.some((c) => c.id === rootCategoryId(p.categoryId))
  );

  return {
    user,
    workshop,
    enterprise,
    region,
    warehouse,
    allowedCategories,
    allowedCategoryIds: allowedCategories.map((c) => c.id),
    availableProducts,
    isOutsideErp: enterprise?.erp === "external",
  };
}
