import { create } from "zustand";

import type { CartItem } from "@/types";

/**
 * Корзина заказчика (шаг 1 пути заказа). Хранит productId, количество и выбор
 * предложения продавца; цены и остатки берутся из каталога при отображении и
 * фиксируются в заказе на шаге «Оформление».
 */
interface CartState {
  items: CartItem[];
  /** Выбранный РЕСХ доставки — уточняется на шаге «Оформление». */
  warehouseId: string | null;
  /** Цех-заказчик; по умолчанию — цех текущего пользователя. */
  workshopId: string | null;
  comment: string;
  add: (productId: string, quantity?: number, offerId?: string) => void;
  /** Сменить продавца по позиции (выбор на странице товара). */
  setOffer: (productId: string, offerId: string) => void;
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

  add: (productId, quantity = 1, offerId) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === productId
              ? {
                  ...i,
                  quantity: i.quantity + quantity,
                  // Повторное добавление с явно выбранным продавцом
                  // переносит строку к нему: в корзине одна позиция —
                  // один продавец.
                  ...(offerId ? { offerId } : {}),
                }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId,
            quantity,
            ...(offerId ? { offerId } : {}),
            addedAt: new Date().toISOString(),
          },
        ],
      };
    }),

  setOffer: (productId, offerId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, offerId } : i
      ),
    })),

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
