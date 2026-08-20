import { nextSimulatedStatus, statusChainFor } from "@/config/order-stepper";
import { applyErpTransfer } from "@/lib/approve-order";
import { supplierOfCategory, warehouseById } from "@/mocks";
import { OrderStatus, type Order, type OrderStatusEvent } from "@/types";

/**
 * Продвижение заказа по конвейеру исполнения (шаги 4–7 пути заказа).
 * Чистые функции: принимают заказ, возвращают новый — хранилище только
 * подменяет объект.
 *
 * В реальной системе эти переходы приходят из D365 F&O по событию
 * (Purchase Order, приём на РЕСХ, перемещение на предприятие). Здесь они
 * вызываются демо-кнопкой на карточке заказа.
 */

function withEvent(order: Order, event: OrderStatusEvent): Order {
  return {
    ...order,
    status: event.status,
    updatedAt: event.at,
    statusHistory: [...order.statusHistory, event],
  };
}

/** Номерная часть заказа — из неё строятся номера документов ERP. */
function seqOf(order: Order): string {
  return order.number.split("-").pop() ?? "000000";
}

/** Заказ передан поставщику: Purchase Order по рамочному договору. */
function applySupplierHandoff(order: Order, at: string): Order {
  const supplierName = supplierOfCategory(order.lines[0]?.categoryId ?? "")?.name;
  const outsideErp = Boolean(order.erp?.isOutsideErp);
  const year = new Date(at).getFullYear();

  const next = withEvent(order, {
    status: OrderStatus.AtSupplier,
    at,
    actor: outsideErp ? "Система" : "D365 F&O",
    comment: outsideErp
      ? `Заказ передан поставщику напрямую${
          supplierName ? ` (${supplierName})` : ""
        }: предприятие вне контура D365 F&O`
      : `Заказ на поставку передан поставщику${
          supplierName ? ` ${supplierName}` : ""
        }`,
  });

  // Purchase Order существует только в контуре ERP.
  return outsideErp
    ? next
    : {
        ...next,
        erp: { ...next.erp, purchaseOrderId: `PO-${year}-${seqOf(order)}` },
      };
}

/** Товар принят на РЕСХ региона. */
function applyWarehouseArrival(order: Order, at: string): Order {
  const warehouseName = warehouseById(order.warehouseId)?.name ?? "РЕСХ";
  return withEvent(order, {
    status: OrderStatus.AtWarehouse,
    at,
    actor: warehouseName,
    comment: `Товар принят на ${warehouseName}`,
  });
}

/** Перемещение РЕСХ → предприятие-заказчик. */
function applyTransfer(order: Order, at: string): Order {
  const year = new Date(at).getFullYear();
  const next = withEvent(order, {
    status: OrderStatus.InTransit,
    at,
    actor: "D365 F&O",
    comment:
      "Перемещение РЕСХ → предприятие проведено: сформированы бухгалтерские проводки и расчёт себестоимости",
  });
  return {
    ...next,
    erp: { ...next.erp, transferOrderId: `TO-${year}-${seqOf(order)}` },
  };
}

/** Черновик отправлен на согласование. */
function applySubmitForApproval(order: Order, at: string): Order {
  return withEvent(order, {
    status: OrderStatus.PendingApproval,
    at,
    actor: order.customerName,
    comment: "Направлен на согласование начальнику цеха / участка",
  });
}

/**
 * Один шаг вперёд по конвейеру. Возвращает исходный заказ без изменений,
 * если автоматического следующего шага нет (решение согласующего,
 * подтверждение получения, отклонённый или уже полученный заказ).
 */
export function advanceOrder(order: Order, at: string): Order {
  const next = nextSimulatedStatus(order);
  if (!next) return order;

  switch (next) {
    case OrderStatus.PendingApproval:
      return applySubmitForApproval(order, at);
    case OrderStatus.SentToErp:
      return applyErpTransfer(order, at);
    case OrderStatus.AtSupplier:
      return applySupplierHandoff(order, at);
    case OrderStatus.AtWarehouse:
      return applyWarehouseArrival(order, at);
    case OrderStatus.InTransit:
      return applyTransfer(order, at);
    default:
      return order;
  }
}

/**
 * Подтверждение получения заказчиком (шаг 7): осознанное действие человека.
 * Фиксирует фактически полученные количества — дальше они идут в аналитику
 * ходимости инструмента.
 */
export function confirmReceipt(
  order: Order,
  { at, actorName, actorUserId }: { at: string; actorName: string; actorUserId?: string }
): Order {
  const next = withEvent(order, {
    status: OrderStatus.Received,
    at,
    actor: actorName,
    comment: "Получение подтверждено на предприятии",
    ...(actorUserId ? { actorUserId } : {}),
  });

  return {
    ...next,
    receivedAt: at,
    lines: next.lines.map((line) => ({
      ...line,
      receivedQuantity: line.receivedQuantity ?? line.quantity,
    })),
  };
}

/**
 * Подтверждение получения с текущего шага трекера.
 *
 * Если заказ стоит на «На РЕСХ», а перемещение РЕСХ → предприятие ещё не
 * зафиксировано, оно записывается автоматически: товар физически не может
 * быть получен на предприятии, минуя перемещение, и в D365 F&O этот документ
 * создаётся до приёмки. Так шаг 6 пути заказа не выпадает из истории.
 */
export function confirmReceiptFromCurrentStep(
  order: Order,
  options: { at: string; actorName: string; actorUserId?: string }
): Order {
  const needsTransit =
    order.status === OrderStatus.AtWarehouse &&
    statusChainFor(order).includes(OrderStatus.InTransit);

  return confirmReceipt(
    needsTransit ? advanceOrder(order, options.at) : order,
    options
  );
}
