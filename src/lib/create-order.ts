import { approverOfWorkshop, isOutsideErp, supplierOfCategory } from "@/mocks";
import type { CartLimitCheck, CartLine } from "@/lib/cart-limits";
import {
  OrderStatus,
  type ApprovalStep,
  type ErpLinks,
  type Order,
  type OrderLine,
  type OrderStatusEvent,
  type User,
  type Workshop,
} from "@/types";
import { rootCategoryId } from "@/mocks";

/**
 * Оформление заказа из корзины (шаги 2–3 пути заказа).
 *
 * Статус нового заказа определяется проверкой лимитов:
 * — вся корзина в пределах порогов авто-одобрения → «Согласован»
 *   (заказ уходит в исполнение без согласующего);
 * — хотя бы одна категория выше порога → «На согласовании».
 * Заказы с превышением лимита не оформляются вовсе (см. canSubmit).
 */

/** Следующий номер заказа в формате ЗК-ГГГГ-NNNNNN. */
export function nextOrderNumber(existing: Order[], year: number): string {
  const prefix = `ЗК-${year}-`;
  const maxSeq = existing
    .filter((o) => o.number.startsWith(prefix))
    .reduce((max, o) => {
      const seq = Number.parseInt(o.number.slice(prefix.length), 10);
      return Number.isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
  return `${prefix}${String(maxSeq + 1).padStart(6, "0")}`;
}

function buildLines(orderId: string, lines: CartLine[], warehouseId: string): OrderLine[] {
  return lines.map(({ product, quantity, lineTotal }, index) => ({
    id: `${orderId}-l${index + 1}`,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    unit: product.unit,
    quantity,
    /** Цена фиксируется на момент оформления — цена рамочного договора. */
    price: product.price,
    vatRate: product.vatRate,
    lineTotal,
    categoryId: rootCategoryId(product.categoryId),
    supplierId: product.supplierId,
    warehouseId,
  }));
}

function buildApprovalRoute(
  check: CartLimitCheck,
  workshopId: string
): ApprovalStep[] {
  if (check.verdict === "auto") return [];

  const approver = approverOfWorkshop(workshopId);
  const route: ApprovalStep[] = [
    {
      role: "workshop_head",
      approverUserId: approver?.id,
      approverName: approver?.fullName,
      status: "pending",
    },
  ];

  // Превышен порог эскалации хотя бы по одной категории — подключаются
  // руководитель подразделения и бюджетный контролёр.
  const needsEscalation = check.categories.some(
    (c) =>
      c.limit?.escalationThreshold !== undefined &&
      c.cartAmount > c.limit.escalationThreshold
  );
  if (needsEscalation) {
    route.push(
      { role: "division_head", status: "pending" },
      { role: "budget_controller", status: "pending" }
    );
  }

  return route;
}

function buildErpLinks(workshop: Workshop, purchaseCategoryId: string): ErpLinks {
  const contractNumber = supplierOfCategory(purchaseCategoryId)?.contractNumber;
  const outside = isOutsideErp(workshop.enterpriseId);
  return {
    ...(contractNumber ? { frameworkContractNumber: contractNumber } : {}),
    ...(outside ? { isOutsideErp: true } : {}),
  };
}

export function createOrderFromCart({
  lines,
  check,
  customer,
  workshop,
  warehouseId,
  existingOrders,
  comment,
  now = new Date().toISOString(),
}: {
  lines: CartLine[];
  check: CartLimitCheck;
  customer: User;
  workshop: Workshop;
  warehouseId: string;
  existingOrders: Order[];
  comment?: string;
  /** Момент оформления — параметром, чтобы функция была тестируемой. */
  now?: string;
}): Order {
  const year = new Date(now).getFullYear();
  const number = nextOrderNumber(existingOrders, year);
  const id = `ord-${year}-${number.split("-").pop()}`;
  const autoApproved = check.verdict === "auto";
  const status = autoApproved ? OrderStatus.Approved : OrderStatus.PendingApproval;

  const orderLines = buildLines(id, lines, warehouseId);
  const totalAmount = orderLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const vatAmount = orderLines.reduce(
    (sum, l) => sum + Math.round((l.lineTotal * l.vatRate) / 100),
    0
  );

  const statusHistory: OrderStatusEvent[] = [
    {
      status: OrderStatus.Draft,
      at: now,
      actor: customer.fullName,
      comment: "Заказ оформлен в маркетплейсе",
    },
    autoApproved
      ? {
          status: OrderStatus.Approved,
          at: now,
          actor: "Система",
          comment: "Автоматическое одобрение: сумма в пределах порога цеха",
        }
      : {
          status: OrderStatus.PendingApproval,
          at: now,
          actor: customer.fullName,
          comment: "Направлен на согласование начальнику цеха / участка",
        },
  ];

  return {
    id,
    number,
    customerId: customer.id,
    customerName: customer.fullName,
    workshopId: workshop.id,
    enterpriseId: workshop.enterpriseId,
    regionId: workshop.regionId,
    warehouseId,
    createdAt: now,
    updatedAt: now,
    status,
    lines: orderLines,
    totalAmount,
    vatAmount,
    totalWithVat: totalAmount + vatAmount,
    approvalRoute: buildApprovalRoute(check, workshop.id),
    statusHistory,
    erp: buildErpLinks(workshop, orderLines[0].categoryId),
    ...(autoApproved ? { autoApproved: true } : {}),
    ...(comment ? { comment } : {}),
  };
}
