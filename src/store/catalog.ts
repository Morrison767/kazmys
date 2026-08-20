import { create } from "zustand";

import {
  CATEGORIES,
  ENTERPRISES,
  PRODUCTS,
  REGIONS,
  SUPPLIERS,
  WAREHOUSES,
  WORKSHOPS,
} from "@/mocks";
import type {
  Category,
  Enterprise,
  Product,
  Region,
  Supplier,
  Warehouse,
  Workshop,
} from "@/types";

/**
 * Справочники: каталог, поставщики, оргструктура, склады РЕСХ.
 * В проде синхронизируются из D365 F&O (номенклатура, цены, поставщики,
 * договоры, остатки, оргструктура); на Этапе 0 — пустые.
 */
interface CatalogState {
  categories: Category[];
  products: Product[];
  suppliers: Supplier[];
  regions: Region[];
  enterprises: Enterprise[];
  workshops: Workshop[];
  warehouses: Warehouse[];
  setCategories: (categories: Category[]) => void;
  setProducts: (products: Product[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  setOrgStructure: (payload: {
    regions: Region[];
    enterprises: Enterprise[];
    workshops: Workshop[];
    warehouses: Warehouse[];
  }) => void;
  /** Добавить или обновить позицию каталога (админ-панель ТД). */
  upsertProduct: (product: Product) => void;
  /**
   * Скрыть/показать позицию. Скрытая позиция исчезает из каталога заказчика:
   * фильтр по isArchived живёт в lib/customer-scope.ts.
   */
  setProductArchived: (productId: string, archived: boolean) => void;
  /**
   * Матрица доступа: открыть/закрыть цеху категорию закупа.
   * Меняет тот же Workshop.allowedCategoryIds, по которому строится каталог
   * заказчика и проверка лимитов в корзине.
   */
  toggleWorkshopCategory: (workshopId: string, categoryId: string) => void;
  setWorkshopCategories: (workshopId: string, categoryIds: string[]) => void;
  productById: (productId: string) => Product | undefined;
  categoryById: (categoryId: string) => Category | undefined;
  supplierById: (supplierId: string) => Supplier | undefined;
  workshopById: (workshopId: string) => Workshop | undefined;
  /** Категории верхнего уровня — для навигации по каталогу. */
  rootCategories: () => Category[];
  childCategories: (parentId: string) => Category[];
  /** Поставщик категории — модель «один поставщик на категорию». */
  supplierOfCategory: (categoryId: string) => Supplier | undefined;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  // Справочники заполнены демо-данными; в проде их место займёт синхронизация
  // из D365 F&O (номенклатура, цены, поставщики, договоры, оргструктура).
  categories: CATEGORIES,
  products: PRODUCTS,
  suppliers: SUPPLIERS,
  regions: REGIONS,
  enterprises: ENTERPRISES,
  workshops: WORKSHOPS,
  warehouses: WAREHOUSES,

  setCategories: (categories) => set(() => ({ categories })),
  setProducts: (products) => set(() => ({ products })),
  setSuppliers: (suppliers) => set(() => ({ suppliers })),
  setOrgStructure: ({ regions, enterprises, workshops, warehouses }) =>
    set(() => ({ regions, enterprises, workshops, warehouses })),

  upsertProduct: (product) =>
    set((state) => ({
      products: state.products.some((p) => p.id === product.id)
        ? state.products.map((p) => (p.id === product.id ? product : p))
        : [product, ...state.products],
    })),

  setProductArchived: (productId, archived) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, isArchived: archived } : p
      ),
    })),

  toggleWorkshopCategory: (workshopId, categoryId) =>
    set((state) => ({
      workshops: state.workshops.map((w) => {
        if (w.id !== workshopId) return w;
        const allowed = w.allowedCategoryIds.includes(categoryId)
          ? w.allowedCategoryIds.filter((id) => id !== categoryId)
          : [...w.allowedCategoryIds, categoryId];
        return { ...w, allowedCategoryIds: allowed };
      }),
    })),

  setWorkshopCategories: (workshopId, categoryIds) =>
    set((state) => ({
      workshops: state.workshops.map((w) =>
        w.id === workshopId ? { ...w, allowedCategoryIds: categoryIds } : w
      ),
    })),

  productById: (productId) => get().products.find((p) => p.id === productId),
  categoryById: (categoryId) =>
    get().categories.find((c) => c.id === categoryId),
  supplierById: (supplierId) =>
    get().suppliers.find((s) => s.id === supplierId),
  workshopById: (workshopId) =>
    get().workshops.find((w) => w.id === workshopId),

  rootCategories: () => get().categories.filter((c) => c.parentId === null),
  childCategories: (parentId) =>
    get().categories.filter((c) => c.parentId === parentId),
  supplierOfCategory: (categoryId) =>
    get().suppliers.find((s) => s.categoryId === categoryId),
}));
