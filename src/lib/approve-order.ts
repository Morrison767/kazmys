import { supplierOfCategory } from "@/mocks";
import {
  OrderStatus,
  type ApprovalStep,
  type Limit,
  type Order,
} from "@/types";

/**
 * Шаг 3 пути заказа (согласование) и переход к шагу 4 (передача в ERP).
 * Функции чистые: принимают заказ и возвращают новый — хранилище только
 * подменяет объект, а логика остаётся тестируемой.
 */

/** Суммы заказа в разрезе категорий закупа. */
export function amountsByCategory(order: Order): Map<string, number> {
  const result = new Map<string, number>();
  for (const line of order.lines) {
    result.set(line.categoryId, (result.get(line.categoryId) ?? 0) + line.lineTotal);
  }
  return result;
}

/**
 * Нужен ли второй шаг согласования (бюджетный контролёр).
 * Порог — escalationThreshold лимита цеха по категории заказа; если маршрут
 * согласования уже содержит такой шаг, он тоже считается признаком.
 */
export function needsBudgetController(order: Order, limits: Limit[]): boolean {
  if (order.approvalRoute.some((s) => s.role === "budget_controller")) return true;

  return [...amountsByCategory(order).entries()].some(([categoryId, amount]) => {
    const limit = limits.find(
      (l) => l.workshopId === order.workshopId && l.categoryId === categoryId
    );
    return (
      limit?.escalationThreshold !== undefined &&
      amount > limit.escalationThreshold
    );
  });
}

/** Порог эскалации, применимый к заказу (максимальный по его категориям). */
export function escalationThresholdOf(
  order: Order,
  limits: Limit[]
): number | undefined {
  const thresholds = [...amountsByCategory(order).keys()]
    .map(
      (categoryId) =>
        limits.find(
          (l) =>
            l.workshopId === order.workshopId && l.categoryId === categoryId
        )?.escalationThreshold
    )
    .filter((t): t is number => t !== undefined);
  return thresholds.length > 0 ? Math.min(...thresholds) : undefined;
}

function withStep(
  route: ApprovalStep[],
  role: ApprovalStep["role"],
  patch: Partial<ApprovalStep>
): ApprovalStep[] {
  return route.map((step) => (step.role === role ? { ...step, ...patch } : step));
}

/** Согласование заказа начальником цеха (плюс подтверждение эскалации). */
export function applyApproval(
  order: Order,
  {
    actorName,
    actorUserId,
    at,
    budgetControllerConfirmed = false,
    comment,
  }: {
    actorName: string;
    actorUserId?: string;
    at: string;
    /** Подтверждён ли второй шаг — бюджетный контролёр. */
    budgetControllerConfirmed?: boolean;
    comment?: string;
  }
): Order {
  let route = withStep(order.approvalRoute, "workshop_head", {
    status: "approved",
    at,
    approverUserId: actorUserId,
    approverName: actorName,
  });

  if (budgetControllerConfirmed) {
    route = withStep(route, "division_head", { status: "approved", at });
    route = withStep(route, "budget_controller", { status: "approved", at });
  }

  return {
    ...order,
    status: OrderStatus.Approved,
    updatedAt: at,
    approvalRoute: route,
    statusHistory: [
      ...order.statusHistory,
      {
        status: OrderStatus.Approved,
        at,
        actor: actorName,
        comment:
          comment ??
          (budgetControllerConfirmed
            ? "Согласовано начальником цеха и бюджетным контролёром"
            : "Согласовано начальником цеха / участка"),
        ...(actorUserId ? { actorUserId } : {}),
      },
    ],
  };
}

/** Отклонение заказа: комментарий обязателен и попадает в историю. */
export function applyRejection(
  order: Order,
  {
    actorName,
    actorUserId,
    at,
    comment,
  }: {
    actorName: string;
    actorUserId?: string;
    at: string;
    comment: string;
  }
): Order {
  return {
    ...order,
    status: OrderStatus.Rejected,
    updatedAt: at,
    rejectionReason: comment,
    approvalRoute: withStep(order.approvalRoute, "workshop_head", {
      status: "rejected",
      at,
      approverUserId: actorUserId,
      approverName: actorName,
      comment,
    }),
    statusHistory: [
      ...order.statusHistory,
      {
        status: OrderStatus.Rejected,
        at,
        actor: actorName,
        comment,
        ...(actorUserId ? { actorUserId } : {}),
      },
    ],
  };
}

/**
 * Передача согласованного заказа в ERP (шаг 4): создаётся Purchase
 * Requisition и привязывается к рамочному договору.
 *
 * Для предприятий вне D365 F&O шага нет: заказ остаётся в статусе
 * «Согласован» — это финал упрощённого пути, дальше поставщик получает
 * заказ напрямую.
 */
export function applyErpTransfer(order: Order, at: string): Order {
  if (order.erp?.isOutsideErp) return order;
  if (order.status !== OrderStatus.Approved) return order;

  const seq = order.number.split("-").pop() ?? "000000";
  const year = new Date(at).getFullYear();
  const purchaseRequisitionId = `PR-${year}-${seq}`;
  const contractNumber =
    order.erp?.frameworkContractNumber ??
    supplierOfCategory(order.lines[0]?.categoryId ?? "")?.contractNumber;

  return {
    ...order,
    status: OrderStatus.SentToErp,
    updatedAt: at,
    erp: {
      ...order.erp,
      purchaseRequisitionId,
      ...(contractNumber ? { frameworkContractNumber: contractNumber } : {}),
    },
    statusHistory: [
      ...order.statusHistory,
      {
        status: OrderStatus.SentToErp,
        at,
        actor: "D365 F&O",
        comment: contractNumber
          ? `Создан Purchase Requisition ${purchaseRequisitionId}, привязан к договору ${contractNumber}`
          : `Создан Purchase Requisition ${purchaseRequisitionId}`,
      },
    ],
  };
}
