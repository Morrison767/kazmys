import { create } from "zustand";

import { ORDERS } from "@/mocks";
import { OrderStatus, type Order, type OrderStatusEvent } from "@/types";

/**
 * Заказы: демо-история за последние три месяца плюс заказы, оформленные
 * в прототипе. Переходы по ERP-шагам — на последующих этапах.
 */
interface OrdersState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  /** Перевод заказа по жизненному циклу с записью в историю статусов. */
  updateStatus: (
    orderId: string,
    status: OrderStatus,
    event?: Partial<OrderStatusEvent>
  ) => void;
  /**
   * Заменить заказ результатом чистой функции (согласование, отклонение,
   * передача в ERP — см. src/lib/approve-order.ts).
   */
  updateOrder: (orderId: string, updater: (order: Order) => Order) => void;
  byId: (orderId: string) => Order | undefined;
  /** Заказы конкретного заказчика — экран «Мои заказы». */
  byCustomer: (customerId: string) => Order[];
  /** Очередь согласований — экран «Согласования». */
  pendingApproval: (workshopId?: string) => Order[];
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: ORDERS,

  setOrders: (orders) => set(() => ({ orders })),

  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

  updateStatus: (orderId, status, event) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const at = event?.at ?? new Date().toISOString();
        return {
          ...o,
          status,
          updatedAt: at,
          statusHistory: [
            ...o.statusHistory,
            {
              status,
              at,
              actor: event?.actor ?? "Система",
              actorUserId: event?.actorUserId,
              comment: event?.comment,
            },
          ],
        };
      }),
    })),

  updateOrder: (orderId, updater) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? updater(o) : o)),
    })),

  byId: (orderId) => get().orders.find((o) => o.id === orderId),

  byCustomer: (customerId) =>
    get().orders.filter((o) => o.customerId === customerId),

  pendingApproval: (workshopId) =>
    get().orders.filter(
      (o) =>
        o.status === OrderStatus.PendingApproval &&
        (!workshopId || o.workshopId === workshopId)
    ),
}));
