import { create } from "zustand";

import type { CartItem } from "@/types";

/**
 * Корзина заказчика (шаг 1 пути заказа). Хранит только productId + количество;
 * цены и остатки берутся из каталога при отображении и фиксируются в заказе
 * на шаге «Оформление».
 */
interface CartState {
  items: CartItem[];
  /** Выбранный РЕСХ доставки — уточняется на шаге «Оформление». */
  warehouseId: string | null;
  /** Цех-заказчик; по умолчанию — цех текущего пользователя. */
  workshopId: string | null;
  comment: string;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setWarehouseId: (warehouseId: string | null) => void;
  setWorkshopId: (workshopId: string | null) => void;
  setComment: (comment: string) => void;
  /** Суммарное количество единиц — для бейджа в навигации. */
  totalQuantity: () => number;
  /** Число различных позиций в корзине. */
  lineCount: () => number;
  quantityOf: (productId: string) => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  warehouseId: null,
  workshopId: null,
  comment: "",

  add: (productId, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { productId, quantity, addedAt: new Date().toISOString() },
        ],
      };
    }),

  setQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
    })),

  remove: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  clear: () => set(() => ({ items: [], comment: "" })),

  setWarehouseId: (warehouseId) => set(() => ({ warehouseId })),
  setWorkshopId: (workshopId) => set(() => ({ workshopId })),
  setComment: (comment) => set(() => ({ comment })),

  totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  lineCount: () => get().items.length,
  quantityOf: (productId) =>
    get().items.find((i) => i.productId === productId)?.quantity ?? 0,
}));
