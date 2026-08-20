import { OrderStatus, type Order } from "@/types";

/**
 * Модель визуального трекера заказа.
 *
 * ВЫБОР ВАРИАНТА СТЕППЕРА (важно):
 * вариант определяется признаком предприятия из демо-данных — Enterprise.erp
 * («d365fo» / «external»), который при оформлении заказа фиксируется в
 * Order.erp.isOutsideErp (см. lib/create-order.ts и mocks/orders.ts).
 *
 * — Предприятие в контуре D365 F&O → FULL_STEPS: полный путь с ERP-шагами
 *   (передача в ERP, отгрузка поставщиком, приём на РЕСХ и перемещение
 *   на предприятие). Эти шаги в реальной системе выполняет интеграция,
 *   заказчик видит только смену статуса.
 * — Предприятие вне D365 F&O (например, ТОО «Казахсервис») → SHORT_STEPS:
 *   ERP-шагов нет вовсе, маркетплейс работает автономно и передаёт данные
 *   о заказе в учётную систему предприятия. Путь после согласования сразу
 *   ведёт к получению.
 *
 * Один визуальный шаг может покрывать несколько статусов жизненного цикла:
 * «На РЕСХ / в пути на предприятие» — это AtWarehouse и InTransit,
 * а в коротком варианте отгрузка поставщиком показывается внутри шага
 * «Согласован». Так enum остаётся полным (данные ERP не теряются),
 * а трекер — компактным и читаемым.
 */

export interface StepperStep {
  id: string;
  label: string;
  /** Статусы, которые покрывает шаг, в порядке прохождения. */
  statuses: OrderStatus[];
  /**
   * Пояснение об интеграции с D365 F&O — показывается иконкой «i».
   * Заполнено только у шагов, за которыми стоит ERP.
   */
  erpHint?: string;
  /** Шаг подтверждает человек, а не интеграция. */
  humanAction?: boolean;
}

/** Полный путь: предприятия в контуре D365 F&O. */
export const FULL_STEPS: StepperStep[] = [
  {
    id: "placed",
    label: "Оформлен",
    statuses: [OrderStatus.Draft],
  },
  {
    id: "approval",
    label: "На согласовании",
    statuses: [OrderStatus.PendingApproval],
  },
  {
    id: "approved",
    label: "Согласован",
    statuses: [OrderStatus.Approved],
  },
  {
    id: "erp",
    label: "Передан в ERP",
    statuses: [OrderStatus.SentToErp],
    erpHint:
      "В реальной системе шаг выполняет интеграция: согласованный заказ создаёт Purchase Requisition в MS Dynamics 365 F&O и привязывается к рамочному договору категории.",
  },
  {
    id: "supplier",
    label: "У поставщика",
    statuses: [OrderStatus.AtSupplier],
    erpHint:
      "Из заявки в D365 F&O формируется Purchase Order и уходит поставщику по рамочному договору. Маркетплейс получает статус отгрузки из ERP по событию.",
  },
  {
    id: "logistics",
    label: "На РЕСХ / в пути на предприятие",
    statuses: [OrderStatus.AtWarehouse, OrderStatus.InTransit],
    erpHint:
      "Приём на РЕСХ и перемещение на предприятие ведутся в D365 F&O: складские остатки обновляются по OData каждые 15 минут, перемещение формирует бухгалтерские проводки и расчёт себестоимости.",
  },
  {
    id: "received",
    label: "Получен",
    statuses: [OrderStatus.Received],
    humanAction: true,
  },
];

/**
 * Короткий путь: предприятия вне D365 F&O. ERP-шагов нет; отгрузка
 * поставщиком показывается внутри шага «Согласован», потому что заказ
 * уходит поставщику напрямую, без Purchase Requisition и РЕСХ.
 */
export const SHORT_STEPS: StepperStep[] = [
  {
    id: "placed",
    label: "Оформлен",
    statuses: [OrderStatus.Draft],
  },
  {
    id: "approval",
    label: "На согласовании",
    statuses: [OrderStatus.PendingApproval],
  },
  {
    id: "approved",
    label: "Согласован",
    statuses: [OrderStatus.Approved, OrderStatus.AtSupplier],
  },
  {
    id: "received",
    label: "Получен",
    statuses: [OrderStatus.Received],
    humanAction: true,
  },
];

/** Работает ли заказ по короткому пути (предприятие вне D365 F&O). */
export function isShortPath(order: Order): boolean {
  return Boolean(order.erp?.isOutsideErp);
}

/** Шаги трекера для конкретного заказа. */
export function stepsFor(order: Order): StepperStep[] {
  return isShortPath(order) ? SHORT_STEPS : FULL_STEPS;
}

/** Последовательность статусов, по которой движется заказ. */
export function statusChainFor(order: Order): OrderStatus[] {
  return stepsFor(order).flatMap((step) => step.statuses);
}

/** Момент достижения статуса из истории заказа (первая запись). */
export function reachedAt(order: Order, status: OrderStatus): string | undefined {
  return order.statusHistory.find((e) => e.status === status)?.at;
}

/** Запись истории по статусу — нужна для автора перехода и комментария. */
export function historyEventOf(order: Order, status: OrderStatus) {
  return order.statusHistory.find((e) => e.status === status);
}

/** Индекс шага, на котором заказ находится сейчас (-1 для отклонённого). */
export function currentStepIndex(order: Order): number {
  if (order.status === OrderStatus.Rejected) {
    // Отклонение случается на согласовании: последний пройденный шаг — он.
    return stepsFor(order).findIndex((s) =>
      s.statuses.includes(OrderStatus.PendingApproval)
    );
  }
  return stepsFor(order).findIndex((s) => s.statuses.includes(order.status));
}

/**
 * Следующий автоматический статус для демо-симуляции.
 *
 * Не возвращается для:
 * — «На согласовании» — решение принимает согласующий в разделе
 *   «Согласования» (там же маршрут, комментарии и лимиты);
 * — «Получен» — подтверждает заказчик отдельной кнопкой;
 * — отклонённых и уже полученных заказов.
 */
export function nextSimulatedStatus(order: Order): OrderStatus | null {
  if (
    order.status === OrderStatus.Rejected ||
    order.status === OrderStatus.Received ||
    order.status === OrderStatus.PendingApproval
  ) {
    return null;
  }

  const chain = statusChainFor(order);
  const index = chain.indexOf(order.status);
  if (index === -1) return null;

  const next = chain[index + 1];
  // Получение подтверждает человек — автоматическим шагом не продвигаем.
  return next && next !== OrderStatus.Received ? next : null;
}

/**
 * Можно ли подтверждать получение: заказ дошёл до предпоследнего шага
 * трекера («На РЕСХ / в пути» в полном пути, «Согласован» — в коротком).
 */
export function canConfirmReceipt(order: Order): boolean {
  if (order.status === OrderStatus.Rejected) return false;
  const steps = stepsFor(order);
  const beforeReceipt = steps[steps.length - 2];
  return Boolean(beforeReceipt?.statuses.includes(order.status));
}
