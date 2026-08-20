import { Check, Loader2, X } from "lucide-react";

import { Badge, InfoHint, OrderStatusBadge } from "@/components/ui";
import {
  currentStepIndex,
  historyEventOf,
  isShortPath,
  reachedAt,
  stepsFor,
  type StepperStep,
} from "@/config/order-stepper";
import { ORDER_STATUS_META, type StatusTone } from "@/config/order-status";
import { cn, formatDateTime } from "@/lib/utils";
import { OrderStatus, type Order } from "@/types";

/**
 * Визуальный трекер заказа. Цвет активного шага берётся из того же
 * ORDER_STATUS_META, что и Badge в списке заказов — единый визуальный язык
 * статусов на всех экранах.
 *
 * Вариант трекера (полный / короткий, без ERP-шагов) выбирается по признаку
 * предприятия — см. config/order-stepper.ts.
 */

/** Классы точки шага по тону статуса — те же тона, что у Badge. */
const DOT_TONE: Record<StatusTone, string> = {
  neutral: "border-muted-foreground bg-muted-foreground",
  info: "border-info bg-info",
  primary: "border-primary bg-primary",
  success: "border-success bg-success",
  warning: "border-warning bg-warning",
  danger: "border-destructive bg-destructive",
};

const RING_TONE: Record<StatusTone, string> = {
  neutral: "ring-muted-foreground/20",
  info: "ring-info/20",
  primary: "ring-primary/20",
  success: "ring-success/20",
  warning: "ring-warning/25",
  danger: "ring-destructive/20",
};

type StepState = "done" | "current" | "pending" | "rejected";

function StepDot({
  state,
  tone,
}: {
  state: StepState;
  tone: StatusTone;
}) {
  if (state === "rejected") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground ring-4 ring-destructive/20 transition-all duration-300">
        <X className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  }

  if (state === "done") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300">
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  }

  if (state === "current") {
    return (
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-card ring-4 transition-all duration-300",
          DOT_TONE[tone],
          RING_TONE[tone]
        )}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-card" strokeWidth={3} />
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card transition-all duration-300">
      <span className="h-1.5 w-1.5 rounded-full bg-border" />
    </span>
  );
}

/** Подстатусы шага с датами: «Принят на РЕСХ», «В пути на предприятие». */
function SubStatuses({ order, step }: { order: Order; step: StepperStep }) {
  const rows = step.statuses
    .map((status) => ({ status, at: reachedAt(order, status) }))
    .filter((row) => row.at);

  // Один статус на шаг — дата уже показана в заголовке шага.
  if (step.statuses.length < 2 || rows.length === 0) return null;

  return (
    <ul className="mt-1.5 flex flex-col gap-1">
      {rows.map((row) => (
        <li key={row.status} className="flex flex-wrap items-baseline gap-x-2 text-xs">
          <span className="text-foreground">
            {ORDER_STATUS_META[row.status].label}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {formatDateTime(row.at!)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function OrderStepper({ order }: { order: Order }) {
  const steps = stepsFor(order);
  const activeIndex = currentStepIndex(order);
  const isRejected = order.status === OrderStatus.Rejected;
  const rejectionEvent = historyEventOf(order, OrderStatus.Rejected);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <OrderStatusBadge status={order.status} showStep />
        <Badge tone="neutral" outline>
          {isShortPath(order)
            ? "Короткий путь · предприятие вне D365 F&O"
            : "Полный путь · D365 F&O"}
        </Badge>
      </div>

      <ol className="mt-2 flex flex-col">
        {steps.map((step, index) => {
          // Отклонённый заказ: шаги после согласования не рисуются —
          // вместо них красная ветка «Отклонён».
          if (isRejected && index > activeIndex) return null;

          const state: StepState =
            index < activeIndex ? "done" : index === activeIndex ? "current" : "pending";
          const primaryStatus =
            step.statuses.find((s) => reachedAt(order, s)) ?? step.statuses[0];
          const tone = ORDER_STATUS_META[primaryStatus].tone;
          const at = reachedAt(order, primaryStatus);
          const event = historyEventOf(order, primaryStatus);
          const isLastDrawn =
            index === steps.length - 1 || (isRejected && index === activeIndex);

          return (
            <li key={step.id} className="flex items-stretch gap-3">
              {/* Рельс: линия + точка */}
              <div className="flex w-7 shrink-0 flex-col items-center">
                <span
                  className={cn(
                    "w-0.5 flex-1 transition-colors duration-300",
                    index === 0
                      ? "bg-transparent"
                      : index <= activeIndex
                        ? "bg-primary"
                        : "bg-border"
                  )}
                />
                <StepDot state={state} tone={tone} />
                <span
                  className={cn(
                    "w-0.5 flex-1 transition-colors duration-300",
                    isLastDrawn
                      ? "bg-transparent"
                      : index < activeIndex
                        ? "bg-primary"
                        : "bg-border"
                  )}
                />
              </div>

              <div
                className={cn(
                  "min-w-0 flex-1 rounded-xl border p-2.5 transition-colors duration-300 sm:p-3",
                  state === "current"
                    ? "border-border bg-muted/40"
                    : "border-transparent"
                )}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span
                    className={cn(
                      "text-sm",
                      state === "pending"
                        ? "text-muted-foreground"
                        : "font-semibold text-foreground"
                    )}
                  >
                    {step.label}
                  </span>

                  {step.erpHint && (
                    <InfoHint
                      text={step.erpHint}
                      label={`Как работает шаг «${step.label}»`}
                    />
                  )}

                  {state === "current" && !isRejected && (
                    <Badge tone={tone}>текущий шаг</Badge>
                  )}
                  {step.humanAction && state === "pending" && (
                    <Badge tone="neutral" outline>
                      подтверждает заказчик
                    </Badge>
                  )}
                </div>

                {at ? (
                  <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                    {formatDateTime(at)}
                    {event?.actor ? ` · ${event.actor}` : ""}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {state === "current" ? "выполняется" : "ожидается"}
                  </p>
                )}

                {event?.comment && state !== "pending" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.comment}
                  </p>
                )}

                <SubStatuses order={order} step={step} />
              </div>
            </li>
          );
        })}

        {/* Ветка отклонения — вместо остатка шагов */}
        {isRejected && (
          <li className="flex items-stretch gap-3">
            <div className="flex w-7 shrink-0 flex-col items-center">
              <span className="w-0.5 flex-1 bg-destructive" />
              <StepDot state="rejected" tone="danger" />
              <span className="w-0.5 flex-1 bg-transparent" />
            </div>
            <div className="min-w-0 flex-1 rounded-xl border border-danger-border bg-danger-soft p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-danger-foreground">
                  Отклонён
                </span>
                <Badge tone="danger">путь заказа прерван</Badge>
              </div>
              {rejectionEvent && (
                <p className="mt-1 text-xs tabular-nums text-danger-foreground">
                  {formatDateTime(rejectionEvent.at)} · {rejectionEvent.actor}
                </p>
              )}
              <p className="mt-1 text-xs text-danger-foreground">
                {order.rejectionReason ??
                  rejectionEvent?.comment ??
                  "Причина не указана"}
              </p>
            </div>
          </li>
        )}
      </ol>
    </div>
  );
}
