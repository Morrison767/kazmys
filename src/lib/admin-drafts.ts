import { rootCategoryId } from "@/mocks";
import type {
  Category,
  Limit,
  LimitPeriod,
  Product,
  Supplier,
  UnitOfMeasure,
  Warehouse,
} from "@/types";

/**
 * Сборка новых объектов из форм админ-панели: позиции каталога и лимита
 * цеха. Логика вынесена из компонентов, чтобы правила (поставщик берётся
 * от категории, идентификаторы не пересекаются) были в одном месте.
 */

export interface ProductFormValues {
  name: string;
  sku: string;
  /** Подгруппа каталога — категория закупа выводится от неё. */
  categoryId: string;
  unit: UnitOfMeasure;
  price: number;
  /** РЕСХ основного хранения. */
  warehouseId: string;
  /** Свободный остаток на этом РЕСХ. */
  stockQuantity: number;
  /** Нормативный срок службы, дней — для инструмента. */
  serviceLifeDays?: number;
  description?: string;
}

export const UNITS: UnitOfMeasure[] = [
  "шт",
  "упак",
  "компл",
  "набор",
  "пара",
  "кг",
  "л",
  "м",
  "рул",
  "пач",
];

/** Категории, в которые можно добавлять позиции: активные подгруппы. */
export function selectableCategories(categories: Category[]): Category[] {
  return categories.filter((c) => c.parentId !== null && c.isActive);
}

export interface ProductFormErrors {
  name?: string;
  sku?: string;
  categoryId?: string;
  price?: string;
  supplier?: string;
}

export function validateProductForm(
  values: ProductFormValues,
  { suppliers, existing }: { suppliers: Supplier[]; existing: Product[] }
): ProductFormErrors {
  const errors: ProductFormErrors = {};
  if (!values.name.trim()) errors.name = "Укажите название позиции";
  if (!values.sku.trim()) errors.sku = "Укажите артикул поставщика";
  if (!values.categoryId) errors.categoryId = "Выберите категорию";
  if (!Number.isFinite(values.price) || values.price <= 0) {
    errors.price = "Цена должна быть больше нуля";
  }
  if (
    values.sku.trim() &&
    existing.some(
      (p) => p.sku.toLowerCase() === values.sku.trim().toLowerCase()
    )
  ) {
    errors.sku = "Позиция с таким артикулом уже есть";
  }
  if (values.categoryId) {
    const purchaseCategoryId = rootCategoryId(values.categoryId);
    const supplier = suppliers.find((s) => s.categoryId === purchaseCategoryId);
    if (!supplier) {
      // Модель «один поставщик на категорию»: без договора позиции нет.
      errors.supplier =
        "По категории нет поставщика с рамочным договором — сначала проведите тендер";
    }
  }
  return errors;
}

/**
 * Новая позиция каталога. Поставщик не выбирается вручную, а выводится
 * от категории закупа — так модель «один поставщик на категорию»
 * не может быть нарушена из интерфейса.
 */
export function buildProductFromForm({
  values,
  suppliers,
  warehouses,
  existing,
  base,
}: {
  values: ProductFormValues;
  suppliers: Supplier[];
  warehouses: Warehouse[];
  existing: Product[];
  /** Редактируемая позиция — тогда сохраняются id, остатки других РЕСХ. */
  base?: Product;
}): Product {
  const purchaseCategoryId = rootCategoryId(values.categoryId);
  const supplier = suppliers.find((s) => s.categoryId === purchaseCategoryId);
  if (!supplier) {
    throw new Error(`Нет поставщика для категории ${purchaseCategoryId}`);
  }

  const warehouse = warehouses.find((w) => w.id === values.warehouseId);
  const regionId = warehouse?.regionId ?? "";
  const now = new Date().toISOString();

  const otherStock = (base?.stock ?? []).filter(
    (s) => s.warehouseId !== values.warehouseId
  );
  const primaryStock = {
    warehouseId: values.warehouseId,
    regionId,
    quantity: Math.max(0, Math.round(values.stockQuantity)),
    updatedAt: now,
  };

  return {
    id: base?.id ?? nextProductId(existing),
    name: values.name.trim(),
    sku: values.sku.trim(),
    erpItemId: base?.erpItemId ?? nextErpItemId(existing),
    categoryId: values.categoryId,
    supplierId: supplier.id,
    unit: values.unit,
    price: Math.round(values.price),
    vatRate: base?.vatRate ?? 12,
    stock: [primaryStock, ...otherStock],
    primaryWarehouseId: values.warehouseId,
    primaryRegionId: regionId,
    ...(base?.imageUrl ? { imageUrl: base.imageUrl } : {}),
    ...(values.description?.trim()
      ? { description: values.description.trim() }
      : {}),
    ...(values.serviceLifeDays && values.serviceLifeDays > 0
      ? { serviceLifeDays: Math.round(values.serviceLifeDays) }
      : {}),
    ...(base?.isArchived ? { isArchived: true } : {}),
  };
}

/** Следующий идентификатор позиции: prd-adm-001, prd-adm-002, … */
export function nextProductId(existing: Product[]): string {
  const used = existing
    .map((p) => /^prd-adm-(\d+)$/.exec(p.id)?.[1])
    .filter((n): n is string => Boolean(n))
    .map(Number);
  const next = (used.length > 0 ? Math.max(...used) : 0) + 1;
  return `prd-adm-${String(next).padStart(3, "0")}`;
}

/** Код номенклатуры для новой позиции — как в D365 F&O: NOM-9xxxxx. */
export function nextErpItemId(existing: Product[]): string {
  const used = existing
    .map((p) => /^NOM-9(\d{5})$/.exec(p.erpItemId ?? "")?.[1])
    .filter((n): n is string => Boolean(n))
    .map(Number);
  const next = (used.length > 0 ? Math.max(...used) : 0) + 1;
  return `NOM-9${String(next).padStart(5, "0")}`;
}

/**
 * Лимит для пары «цех × категория», которой лимит ещё не настроен —
 * например, сразу после открытия категории цеху в матрице доступа.
 */
export function buildLimitDraft({
  workshopId,
  categoryId,
  period = "month",
  amountLimit,
  autoApprovalThreshold,
  updatedBy,
  today,
}: {
  workshopId: string;
  categoryId: string;
  period?: LimitPeriod;
  amountLimit: number;
  autoApprovalThreshold: number;
  updatedBy?: string;
  today: Date;
}): Limit {
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();
  const periodStart = new Date(Date.UTC(year, month, 1))
    .toISOString()
    .slice(0, 10);
  const periodEnd = new Date(Date.UTC(year, month + 1, 0))
    .toISOString()
    .slice(0, 10);

  return {
    id: `lim-${workshopId.replace(/^wsh-/, "")}-${categoryId.replace(/^cat-/, "")}`,
    workshopId,
    categoryId,
    period,
    periodStart,
    periodEnd,
    amountLimit: Math.max(0, Math.round(amountLimit)),
    amountUsed: 0,
    quantityLimit: null,
    quantityUsed: 0,
    autoApprovalThreshold: Math.max(0, Math.round(autoApprovalThreshold)),
    ...(updatedBy ? { updatedBy } : {}),
    updatedAt: today.toISOString(),
    isActive: true,
  };
}
