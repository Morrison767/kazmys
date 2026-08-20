import { useEffect, useMemo, useRef } from "react";
import { ClipboardCheck } from "lucide-react";

import { ApprovalCard } from "@/components/orders/ApprovalCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, Card, EmptyState } from "@/components/ui";
import { applyApproval, applyErpTransfer, applyRejection } from "@/lib/approve-order";
import { pendingApprovalsFor } from "@/lib/order-scope";
import { formatMoney } from "@/lib/utils";
import {
  useCatalogStore,
  useLimitsStore,
  useOrdersStore,
  useSessionStore,
  useToastsStore,
} from "@/store";

/** Задержка эмуляции ответа D365 F&O при создании Purchase Requisition. */
const ERP_TRANSFER_DELAY_MS = 1500;

export default function ApprovalsPage() {
  const user = useSessionStore((s) => s.currentUser);
  const orders = useOrdersStore((s) => s.orders);
  const updateOrder = useOrdersStore((s) => s.updateOrder);
  const limits = useLimitsStore((s) => s.limits);
  const workshops = useCatalogStore((s) => s.workshops);
  const enterprises = useCatalogStore((s) => s.enterprises);
  const categories = useCatalogStore((s) => s.categories);
  const pushToast = useToastsStore((s) => s.push);

  // Отложенные переводы в ERP — снимаются при уходе со страницы.
  const timers = useRef<number[]>([]);
  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    []
  );

  const supervisedWorkshopIds = user?.supervisedWorkshopIds ?? [];

  // Очередь: только заказы подотчётных цехов, сначала самые давние.
  const pending = useMemo(
    () => pendingApprovalsFor(orders, user),
    [orders, user]
  );

  const workshopName = (id: string) =>
    workshops.find((w) => w.id === id)?.name ?? id;
  const enterpriseName = (id: string) =>
    enterprises.find((e) => e.id === id)?.shortName ?? id;
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const approve = (orderId: string, budgetControllerConfirmed: boolean) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !user) return;

    const at = new Date().toISOString();
    updateOrder(orderId, (current) =>
      applyApproval(current, {
        actorName: user.fullName,
        actorUserId: user.id,
        at,
        budgetControllerConfirmed,
      })
    );

    if (order.erp?.isOutsideErp) {
      // Предприятие вне D365 F&O: ERP-шага нет, «Согласован» — финал
      // упрощённого пути, заказ уходит поставщику напрямую.
      pushToast({
        tone: "success",
        title: `Заказ ${order.number} согласован`,
        description:
          "Предприятие вне D365 F&O — заказ передан поставщику напрямую, без Purchase Requisition.",
      });
      return;
    }

    pushToast({
      tone: "success",
      title: "Заказ передан в ERP — Purchase Requisition создан",
      description: `${order.number} · привязка к рамочному договору ${
        order.erp?.frameworkContractNumber ?? "категории"
      }`,
    });

    const timer = window.setTimeout(() => {
      updateOrder(orderId, (current) => applyErpTransfer(current, new Date().toISOString()));
    }, ERP_TRANSFER_DELAY_MS);
    timers.current.push(timer);
  };

  const reject = (orderId: string, comment: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || !user) return;

    updateOrder(orderId, (current) =>
      applyRejection(current, {
        actorName: user.fullName,
        actorUserId: user.id,
        at: new Date().toISOString(),
        comment,
      })
    );

    pushToast({
      tone: "danger",
      title: `Заказ ${order.number} отклонён`,
      description: comment,
    });
  };

  if (!user || user.role !== "approver") {
    return (
      <EmptyState
        icon={ClipboardCheck}
        title="Раздел доступен согласующему"
        description="Выберите роль «Согласующий» в шапке — очередь формируется по подотчётным цехам."
      />
    );
  }

  const pendingAmount = pending.reduce((sum, o) => sum + o.totalWithVat, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Согласования"
        description="Шаг 3 пути заказа: заказы подотчётных цехов, ожидающие вашего решения. После согласования заказ уходит в ERP."
      />

      <Card className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <Metric label="В очереди" value={`${pending.length}`} />
        <Metric label="Сумма к согласованию" value={formatMoney(pendingAmount)} />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Подотчётные цеха</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {supervisedWorkshopIds.map((id) => (
              <Badge key={id} tone="neutral">
                {workshopName(id)}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {pending.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Нет заказов на согласование"
          description="Заказов на согласовании по вашим цехам нет. Новые заявки появятся здесь сразу после оформления заказчиком."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {pending.map((order) => (
            <ApprovalCard
              key={order.id}
              order={order}
              workshopName={workshopName(order.workshopId)}
              enterpriseName={enterpriseName(order.enterpriseId)}
              categoryName={categoryName}
              limits={limits}
              onApprove={(budgetConfirmed) => approve(order.id, budgetConfirmed)}
              onReject={(comment) => reject(order.id, comment)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
