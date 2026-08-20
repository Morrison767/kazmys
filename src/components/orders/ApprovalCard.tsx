import { useState } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ShieldAlert,
  User,
  X,
} from "lucide-react";

import { OrderLinesTable } from "@/components/orders/OrderLinesTable";
import {
  Badge,
  Button,
  Card,
  OrderStatusBadge,
  ProgressBar,
} from "@/components/ui";
import {
  amountsByCategory,
  escalationThresholdOf,
  needsBudgetController,
} from "@/lib/approve-order";
import { limitTone, usedPercent } from "@/lib/cart-limits";
import { cn, formatDateTime, formatMoney } from "@/lib/utils";
import type { Limit, Order } from "@/types";

/**
 * Карточка заказа в очереди согласований: кто заказал, цех, дата, сумма,
 * состояние лимита цеха с учётом этого заказа, разворачиваемый состав
 * и действия согласующего.
 */
export function ApprovalCard({
  order,
  workshopName,
  enterpriseName,
  categoryName,
  limits,
  onApprove,
  onReject,
}: {
  order: Order;
  workshopName: string;
  enterpriseName: string;
  categoryName: (categoryId: string) => string;
  limits: Limit[];
  /** budgetControllerConfirmed — подтверждён ли второй шаг согласования. */
  onApprove: (budgetControllerConfirmed: boolean) => void;
  onReject: (comment: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [comment, setComment] = useState("");
  const [budgetConfirmed, setBudgetConfirmed] = useState(false);

  const requiresBudgetController = needsBudgetController(order, limits);
  const escalationThreshold = escalationThresholdOf(order, limits);
  const canApprove = !requiresBudgetController || budgetConfirmed;
  const commentIsValid = comment.trim().length > 0;

  // Лимит цеха по каждой категории заказа — с учётом этого заказа.
  const limitRows = [...amountsByCategory(order).entries()].map(
    ([categoryId, amount]) => {
      const limit = limits.find(
        (l) => l.workshopId === order.workshopId && l.categoryId === categoryId
      );
      const used = limit?.amountUsed ?? 0;
      return {
        categoryId,
        amount,
        limit,
        /**
         * Факт уже включает оформленный заказ (лимит резервируется при
         * оформлении), поэтому для показа «до заказа» вычитаем его сумму.
         */
        usedBefore: Math.max(0, used - amount),
        usedWithOrder: used,
      };
    }
  );

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Шапка заказа */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold tracking-tight text-foreground">
                {order.number}
              </span>
              <OrderStatusBadge status={order.status} showStep />
              {order.erp?.isOutsideErp && (
                <Badge tone="neutral">вне D365 F&O</Badge>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {order.customerName}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {workshopName} · {enterpriseName}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDateTime(order.createdAt)}
              </span>
            </div>
          </div>

          <div className="shrink-0 sm:text-right">
            <p className="text-lg font-bold tabular-nums tracking-tight text-foreground">
              {formatMoney(order.totalWithVat)}
            </p>
            <p className="text-xs text-muted-foreground">
              с НДС · {formatMoney(order.totalAmount)} без НДС ·{" "}
              {order.lines.length} поз.
            </p>
          </div>
        </div>

        {order.comment && (
          <p className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              Комментарий заказчика:
            </span>{" "}
            {order.comment}
          </p>
        )}

        {/* Повышенный порог — нужен второй шаг согласования */}
        {requiresBudgetController && (
          <div className="flex flex-col gap-3 rounded-xl border border-warning-border bg-warning-soft p-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-warning-foreground">
                  Требуется также согласование бюджетного контролёра
                </p>
                <p className="mt-0.5 text-xs text-warning-foreground">
                  Сумма заказа превышает повышенный порог
                  {escalationThreshold !== undefined
                    ? ` ${formatMoney(escalationThreshold)}`
                    : ""}
                  . В прототипе второй шаг подтверждается здесь же.
                </p>
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-2 text-xs font-semibold text-warning-foreground">
              <input
                type="checkbox"
                checked={budgetConfirmed}
                onChange={(e) => setBudgetConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
              />
              Подтверждаю согласование руководителя подразделения и бюджетного
              контролёра
            </label>
          </div>
        )}

        {/* Лимит цеха с учётом заказа */}
        <div className="flex flex-col gap-3">
          {limitRows.map((row) => {
            if (!row.limit) {
              return (
                <p
                  key={row.categoryId}
                  className="text-xs text-muted-foreground"
                >
                  {categoryName(row.categoryId)}: лимит цеха не настроен.
                </p>
              );
            }
            const percent = usedPercent(
              row.usedWithOrder,
              row.limit.amountLimit
            );
            return (
              <div key={row.categoryId} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-xs font-semibold text-foreground">
                    {categoryName(row.categoryId)} · в заказе{" "}
                    {formatMoney(row.amount)}
                  </span>
                  <Badge
                    tone={
                      limitTone(percent) === "success"
                        ? "success"
                        : limitTone(percent) === "warning"
                          ? "warning"
                          : "danger"
                    }
                  >
                    лимит {percent}%
                  </Badge>
                </div>
                <ProgressBar
                  value={row.usedWithOrder}
                  max={row.limit.amountLimit}
                  tone={limitTone(percent)}
                />
                <p className="text-xs text-muted-foreground tabular-nums">
                  С учётом заказа: {formatMoney(row.usedWithOrder)} из{" "}
                  {formatMoney(row.limit.amountLimit)}
                  <span className="hidden sm:inline">
                    {" "}
                    · до заказа было {formatMoney(row.usedBefore)}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Состав заказа */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex items-center gap-2 self-start text-sm font-semibold text-primary transition-colors hover:underline"
        >
          {expanded ? "Скрыть состав" : `Состав заказа · ${order.lines.length}`}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")}
          />
        </button>

        {expanded && (
          <OrderLinesTable
            lines={order.lines}
            categoryName={categoryName}
            className="animate-fade-in"
          />
        )}
      </div>

      {/* Действия согласующего */}
      <div className="flex flex-col gap-3 border-t border-border bg-muted/30 p-4 sm:p-5">
        {rejecting ? (
          <div className="flex flex-col gap-2">
            <label
              htmlFor={`reject-${order.id}`}
              className="text-xs font-semibold text-foreground"
            >
              Причина отклонения<span className="ml-0.5 text-destructive">*</span>
            </label>
            <textarea
              id={`reject-${order.id}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              autoFocus
              placeholder="Например: превышена норма расхода по позиции, потребность не подтверждена мастером"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {!commentIsValid && (
              <p className="text-xs text-muted-foreground">
                Комментарий обязателен: он уйдёт заказчику и сохранится в истории
                заказа.
              </p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <Button
                variant="danger"
                size="lg"
                fullWidth
                icon={X}
                disabled={!commentIsValid}
                onClick={() => onReject(comment.trim())}
                className="sm:order-2 sm:h-10 sm:w-auto"
              >
                Подтвердить отклонение
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => {
                  setRejecting(false);
                  setComment("");
                }}
                className="sm:order-1 sm:h-10 sm:w-auto"
              >
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            {requiresBudgetController && !budgetConfirmed && (
              <span className="text-xs text-muted-foreground sm:mr-auto">
                Отметьте второй шаг согласования, чтобы согласовать заказ.
              </span>
            )}
            {/* На мобильном главное действие идёт первым и на всю ширину */}
            <Button
              icon={Check}
              size="lg"
              fullWidth
              disabled={!canApprove}
              onClick={() => onApprove(budgetConfirmed)}
              className="sm:order-2 sm:h-10 sm:w-auto"
            >
              Согласовать
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              icon={X}
              onClick={() => setRejecting(true)}
              className="sm:order-1 sm:h-10 sm:w-auto"
            >
              Отклонить
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
