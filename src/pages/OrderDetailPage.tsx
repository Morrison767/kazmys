import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  FlaskConical,
  PackageCheck,
  PlayCircle,
  ShieldAlert,
} from "lucide-react";

import { OrderLinesTable } from "@/components/orders/OrderLinesTable";
import { OrderStepper } from "@/components/orders/OrderStepper";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DefinitionList,
  EmptyState,
  OrderStatusBadge,
} from "@/components/ui";
import { ORDER_STATUS_META } from "@/config/order-status";
import {
  canConfirmReceipt,
  isShortPath,
  nextSimulatedStatus,
} from "@/config/order-stepper";
import {
  advanceOrder,
  confirmReceiptFromCurrentStep,
} from "@/lib/advance-order";
import { formatDate, formatDateTime, formatMoney } from "@/lib/utils";
import {
  useCatalogStore,
  useOrdersStore,
  useSessionStore,
  useToastsStore,
} from "@/store";
import { OrderStatus } from "@/types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const role = useSessionStore((s) => s.role);
  const user = useSessionStore((s) => s.currentUser);
  const order = useOrdersStore((s) => s.orders.find((o) => o.id === id));
  const updateOrder = useOrdersStore((s) => s.updateOrder);
  const workshops = useCatalogStore((s) => s.workshops);
  const enterprises = useCatalogStore((s) => s.enterprises);
  const warehouses = useCatalogStore((s) => s.warehouses);
  const categories = useCatalogStore((s) => s.categories);
  const pushToast = useToastsStore((s) => s.push);

  if (!order) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Заказ не найден"
          description="Заказ мог быть удалён или ссылка устарела."
        />
        <EmptyState
          icon={ClipboardList}
          title="Такого заказа нет"
          description="Вернитесь к списку заказов и выберите нужный."
          action={<Button onClick={() => navigate("/orders")}>К списку заказов</Button>}
        />
      </div>
    );
  }

  const workshop = workshops.find((w) => w.id === order.workshopId);
  const enterprise = enterprises.find((e) => e.id === order.enterpriseId);
  const warehouse = warehouses.find((w) => w.id === order.warehouseId);
  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? categoryId;

  const receiptAvailable = canConfirmReceipt(order);
  /**
   * Когда трекер дошёл до шага получения, симуляция скрывается: дальше ход
   * за человеком. Оставшийся ERP-подшаг (перемещение РЕСХ → предприятие)
   * фиксируется автоматически при подтверждении получения.
   */
  const nextStatus = receiptAvailable ? null : nextSimulatedStatus(order);
  // Получение подтверждает заказчик — это осознанное действие человека.
  const canUserConfirm = role === "customer" && receiptAvailable;

  // ДЕМО-ONLY: в реальной системе статус меняется автоматически через
  // интеграцию с D365 F&O, кнопка не для прод-версии.
  const simulateNextStep = () => {
    if (!nextStatus) return;
    updateOrder(order.id, (current) =>
      advanceOrder(current, new Date().toISOString())
    );
    pushToast({
      tone: "info",
      title: `Статус обновлён: ${ORDER_STATUS_META[nextStatus].label}`,
      description: ORDER_STATUS_META[nextStatus].hint,
    });
  };

  const confirmOrderReceipt = () => {
    if (!user) return;
    updateOrder(order.id, (current) =>
      confirmReceiptFromCurrentStep(current, {
        at: new Date().toISOString(),
        actorName: user.fullName,
        actorUserId: user.id,
      })
    );
    pushToast({
      tone: "success",
      title: `Получение по заказу ${order.number} подтверждено`,
      description:
        "Данные зафиксированы для аналитики ходимости инструмента.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Заказ ${order.number}`}
        description={
          <>
            {order.customerName} · {workshop?.name} · {enterprise?.shortName} ·
            создан {formatDate(order.createdAt)}
          </>
        }
        actions={
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate("/orders")}
          >
            К списку заказов
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* Трекер заказа */}
          <Card className="flex flex-col gap-2">
            <CardHeader
              title="Движение заказа"
              description={
                isShortPath(order)
                  ? "Предприятие вне контура D365 F&O: ERP-шагов нет, заказ уходит поставщику напрямую."
                  : "Шаги «Передан в ERP», «У поставщика» и «На РЕСХ / в пути» в реальной системе выполняет интеграция с MS Dynamics 365 F&O."
              }
            />
            <OrderStepper order={order} />
          </Card>

          {/* Причина отклонения */}
          {order.status === OrderStatus.Rejected && (
            <Card className="flex items-start gap-3 border-danger-border bg-danger-soft">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-danger-foreground">
                  Заказ отклонён согласующим
                </p>
                <p className="mt-1 text-sm text-danger-foreground">
                  {order.rejectionReason ?? "Причина не указана"}
                </p>
                {order.approvalRoute.find((s) => s.status === "rejected")
                  ?.approverName && (
                  <p className="mt-1 text-xs text-danger-foreground">
                    {
                      order.approvalRoute.find((s) => s.status === "rejected")!
                        .approverName
                    }
                    {order.updatedAt ? ` · ${formatDateTime(order.updatedAt)}` : ""}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Состав заказа */}
          <Card className="flex flex-col gap-4">
            <CardHeader
              title={`Состав заказа · ${order.lines.length}`}
              description={`Цены по рамочному договору на момент оформления${
                order.erp?.frameworkContractNumber
                  ? ` (${order.erp.frameworkContractNumber})`
                  : ""
              }`}
            />
            <OrderLinesTable lines={order.lines} categoryName={categoryName} />

            <div className="flex flex-col gap-1 rounded-xl border border-border bg-muted/30 p-4">
              <SumRow label="Сумма без НДС" value={formatMoney(order.totalAmount)} />
              <SumRow label="НДС 12%" value={formatMoney(order.vatAmount)} />
              <SumRow
                label="Итого с НДС"
                value={formatMoney(order.totalWithVat)}
                strong
              />
            </div>

            {order.status === OrderStatus.Received && (
              <p className="text-xs text-muted-foreground">
                Получение подтверждено{" "}
                {order.receivedAt ? formatDateTime(order.receivedAt) : ""}.
                Фактически полученные количества зафиксированы для аналитики
                ходимости.
              </p>
            )}
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          {/* Реквизиты заказа */}
          <Card className="flex flex-col gap-4">
            <CardHeader title="Реквизиты" />
            <DefinitionList
              rows={[
                { label: "Статус", value: <OrderStatusBadge status={order.status} /> },
                { label: "Заказчик", value: order.customerName },
                { label: "Цех / участок", value: workshop?.name ?? "—" },
                { label: "Предприятие", value: enterprise?.shortName ?? "—" },
                { label: "Место доставки", value: warehouse?.name ?? "—" },
                { label: "Создан", value: formatDateTime(order.createdAt) },
                { label: "Обновлён", value: formatDateTime(order.updatedAt) },
                ...(order.expectedDeliveryAt
                  ? [
                      {
                        label: "Ожидаемая поставка",
                        value: formatDate(order.expectedDeliveryAt),
                      },
                    ]
                  : []),
                ...(order.autoApproved
                  ? [
                      {
                        label: "Согласование",
                        value: <Badge tone="success">авто-одобрение</Badge>,
                      },
                    ]
                  : []),
              ]}
            />
            {order.comment && (
              <p className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Комментарий заказчика:
                </span>{" "}
                {order.comment}
              </p>
            )}
          </Card>

          {/* Документы ERP */}
          <Card className="flex flex-col gap-4">
            <CardHeader
              title="Документы"
              description={
                order.erp?.isOutsideErp
                  ? "Предприятие вне D365 F&O: документы ведутся в учётной системе предприятия."
                  : "Документы, созданные интеграцией с D365 F&O."
              }
            />
            <DefinitionList
              rows={[
                {
                  label: "Рамочный договор",
                  value: order.erp?.frameworkContractNumber ?? "—",
                },
                {
                  label: "Purchase Requisition",
                  value: order.erp?.purchaseRequisitionId ?? "—",
                },
                {
                  label: "Purchase Order",
                  value: order.erp?.purchaseOrderId ?? "—",
                },
                {
                  label: "Перемещение РЕСХ → предприятие",
                  value: order.erp?.transferOrderId ?? "—",
                },
              ]}
            />
          </Card>

          {/* Подтверждение получения — действие человека, не симуляция */}
          {receiptAvailable && (
            <Card className="flex flex-col gap-3 max-lg:hidden">
              <CardHeader
                title="Получение"
                description="Подтверждает сотрудник цеха при фактическом получении товара."
              />
              {canUserConfirm ? (
                <Button
                  size="lg"
                  fullWidth
                  icon={PackageCheck}
                  onClick={confirmOrderReceipt}
                >
                  Подтвердить получение
                </Button>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Подтверждение доступно в роли «Заказчик» — это осознанное
                  действие сотрудника, а не автоматический шаг конвейера.
                </p>
              )}
            </Card>
          )}

          {/*
            ДЕМО-ONLY: в реальной системе статус меняется автоматически через
            интеграцию с D365 F&O, кнопка не для прод-версии.
            Блок намеренно отделён от рабочего интерфейса: приглушённый фон,
            пунктирная рамка, заголовок «Демо-инструменты».
          */}
          {(nextStatus || order.status === OrderStatus.PendingApproval) && (
            <div className="rounded-2xl border border-dashed border-border bg-muted/50 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Демо-инструменты
                </p>
              </div>

              {nextStatus ? (
                <>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Только для демонстрации: в рабочей системе следующий шаг
                    придёт из D365 F&O по событию, без участия пользователя.
                  </p>
                  <p className="mt-2 text-xs text-foreground">
                    Следующий шаг:{" "}
                    <span className="font-semibold">
                      {ORDER_STATUS_META[nextStatus].label}
                    </span>
                  </p>
                  {/* На мобильном та же кнопка живёт в sticky-панели снизу */}
                  <Button
                    variant="secondary"
                    icon={PlayCircle}
                    fullWidth
                    className="mt-3 max-lg:hidden"
                    onClick={simulateNextStep}
                  >
                    Симулировать следующий шаг
                  </Button>
                </>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Заказ ожидает решения согласующего — оно принимается в разделе
                  «Согласования», с маршрутом, комментарием и проверкой лимитов.
                  Симуляция этот шаг не подменяет.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/*
        Мобильная панель основного действия: подтверждение получения или
        демо-шаг всегда под рукой, без прокрутки к правой колонке.
      */}
      {(canUserConfirm || nextStatus) && (
        <div className="sticky bottom-0 -mx-4 border-t border-border bg-card/95 px-4 pb-3 pt-3 backdrop-blur lg:hidden">
          {canUserConfirm ? (
            <>
              <Button
                size="lg"
                fullWidth
                icon={PackageCheck}
                onClick={confirmOrderReceipt}
              >
                Подтвердить получение
              </Button>
              <p className="mt-1.5 text-center text-xs text-muted-foreground">
                Подтверждает сотрудник цеха при фактическом получении товара
              </p>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                icon={PlayCircle}
                onClick={simulateNextStep}
              >
                Симулировать следующий шаг
              </Button>
              <p className="mt-1.5 text-center text-xs text-muted-foreground">
                Демо: следующий шаг —{" "}
                {nextStatus ? ORDER_STATUS_META[nextStatus].label : ""}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SumRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span
        className={
          strong
            ? "text-sm font-semibold text-foreground"
            : "text-sm text-muted-foreground"
        }
      >
        {label}
      </span>
      <span
        className={
          strong
            ? "text-base font-bold tabular-nums text-foreground"
            : "text-sm tabular-nums text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
