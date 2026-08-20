import { OrderStatus } from "@/types";

/** Тон бейджа — соответствует вариантам компонента Badge. */
export type StatusTone =
  | "neutral"
  | "info"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export interface OrderStatusMeta {
  status: OrderStatus;
  label: string;
  tone: StatusTone;
  /** Номер шага пути заказа (1–7); null для терминального отклонения. */
  step: number | null;
  /** Пояснение для карточки заказа и таймлайна. */
  hint: string;
}

/**
 * Жизненный цикл заказа в порядке шагов пути заказа. Порядок массива
 * используется таймлайном заказа и прогрессом исполнения.
 */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  OrderStatus.Draft,
  OrderStatus.PendingApproval,
  OrderStatus.Approved,
  OrderStatus.SentToErp,
  OrderStatus.AtSupplier,
  OrderStatus.AtWarehouse,
  OrderStatus.InTransit,
  OrderStatus.Received,
];

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  [OrderStatus.Draft]: {
    status: OrderStatus.Draft,
    label: "Черновик",
    tone: "neutral",
    step: 2,
    hint: "Заказ оформляется заказчиком, ещё не отправлен на согласование",
  },
  [OrderStatus.PendingApproval]: {
    status: OrderStatus.PendingApproval,
    label: "На согласовании",
    tone: "warning",
    step: 3,
    hint: "Ожидает решения начальника цеха / участка",
  },
  [OrderStatus.Approved]: {
    status: OrderStatus.Approved,
    label: "Согласован",
    tone: "info",
    step: 3,
    hint: "Согласование пройдено, заказ готов к передаче в ERP",
  },
  [OrderStatus.SentToErp]: {
    status: OrderStatus.SentToErp,
    label: "Передан в ERP",
    tone: "info",
    step: 4,
    hint: "Создан Purchase Requisition в D365 F&O и привязан к рамочному договору",
  },
  [OrderStatus.AtSupplier]: {
    status: OrderStatus.AtSupplier,
    label: "У поставщика",
    tone: "primary",
    step: 5,
    hint: "Заказ на поставку сформирован и передан поставщику",
  },
  [OrderStatus.AtWarehouse]: {
    status: OrderStatus.AtWarehouse,
    label: "На РЕСХ",
    tone: "primary",
    step: 5,
    hint: "Товар принят на региональный единый склад хранения",
  },
  [OrderStatus.InTransit]: {
    status: OrderStatus.InTransit,
    label: "В пути на предприятие",
    tone: "primary",
    step: 6,
    hint: "Перемещение РЕСХ → предприятие-заказчик зафиксировано в D365 F&O",
  },
  [OrderStatus.Received]: {
    status: OrderStatus.Received,
    label: "Получен",
    tone: "success",
    step: 7,
    hint: "Получение подтверждено сотрудником, данные ушли в аналитику ходимости",
  },
  [OrderStatus.Rejected]: {
    status: OrderStatus.Rejected,
    label: "Отклонён",
    tone: "danger",
    step: null,
    hint: "Отклонён согласующим или заблокирован проверкой лимитов",
  },
};

/** Индекс статуса в потоке — для прогресса и таймлайна (-1 для отклонённого). */
export function orderStatusIndex(status: OrderStatus): number {
  return ORDER_STATUS_FLOW.indexOf(status);
}
