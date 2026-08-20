import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Package,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { CartCheckoutBar } from "@/components/catalog/CartCheckoutBar";
import { LimitVerdictPanel } from "@/components/catalog/LimitVerdictPanel";
import { QuantityStepper } from "@/components/catalog/QuantityStepper";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DefinitionList,
  EmptyState,
  IconButton,
  Modal,
  OrderStatusBadge,
} from "@/components/ui";
import { useCartLines } from "@/hooks/useCartLines";
import { useCustomerScope } from "@/hooks/useCustomerScope";
import { checkCartLimits } from "@/lib/cart-limits";
import { createOrderFromCart } from "@/lib/create-order";
import { formatMoney } from "@/lib/utils";
import { rootCategoryId } from "@/mocks";
import {
  useCartStore,
  useCatalogStore,
  useLimitsStore,
  useOrdersStore,
} from "@/store";
import type { Order } from "@/types";

export default function CartPage() {
  const navigate = useNavigate();
  const { user, workshop, enterprise, region, warehouse, allowedCategoryIds, isOutsideErp } =
    useCustomerScope();

  const categories = useCatalogStore((s) => s.categories);
  const limits = useLimitsStore((s) => s.limits);
  const registerUsage = useLimitsStore((s) => s.registerUsage);
  const orders = useOrdersStore((s) => s.orders);
  const addOrder = useOrdersStore((s) => s.addOrder);

  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.remove);
  const clearCart = useCartStore((s) => s.clear);
  const comment = useCartStore((s) => s.comment);
  const setComment = useCartStore((s) => s.setComment);

  const { lines, totalAmount, vatAmount, totalWithVat, totalQuantity } =
    useCartLines();

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? categoryId;

  // Проверка лимитов пересчитывается на каждое изменение корзины —
  // «в реальном времени», без отдельной кнопки проверки.
  const check = useMemo(
    () =>
      checkCartLimits({
        lines,
        workshopId: workshop?.id ?? "",
        allowedCategoryIds,
        limits,
        categoryName,
      }),
    [lines, workshop?.id, allowedCategoryIds, limits, categories]
  );

  const submitLabel =
    check.verdict === "auto"
      ? "Оформить заказ"
      : check.canSubmit
        ? "Отправить на согласование"
        : "Оформление заблокировано";

  const verdictHint =
    check.verdict === "auto"
      ? "Будет одобрен автоматически"
      : "Уйдёт на согласование начальнику цеха";

  const submit = () => {
    if (!user || !workshop || !warehouse || !check.canSubmit) return;

    const order = createOrderFromCart({
      lines,
      check,
      customer: user,
      workshop,
      warehouseId: warehouse.id,
      existingOrders: orders,
      comment: comment.trim() || undefined,
    });

    addOrder(order);
    // Оформленный заказ сразу уменьшает доступный лимит цеха.
    registerUsage(
      check.categories.map((c) => ({
        workshopId: workshop.id,
        categoryId: c.categoryId,
        amount: c.cartAmount,
        quantity: c.cartQuantity,
      }))
    );
    clearCart();
    setPlacedOrder(order);
  };

  if (!user || !workshop) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Корзина доступна заказчику"
        description="Выберите роль «Заказчик» в шапке — корзина привязана к цеху сотрудника."
      />
    );
  }

  if (lines.length === 0 && !placedOrder) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Корзина"
          description={`${workshop.name} · ${enterprise?.shortName ?? ""}`}
        />
        <EmptyState
          icon={ShoppingCart}
          title="Корзина пуста"
          description="Добавьте позиции из каталога — доступны категории, открытые вашему цеху."
          action={<Button onClick={() => navigate("/catalog")}>В каталог</Button>}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Корзина"
        description="Шаг 2 пути заказа: проверьте состав, место доставки и лимиты цеха, затем отправьте заказ."
        actions={
          <Button
            variant="secondary"
            icon={Package}
            onClick={() => navigate("/catalog")}
          >
            Продолжить выбор
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Состав заказа */}
        <div className="flex min-w-0 flex-col gap-4">
          <Card padded={false}>
            <div className="border-b border-border px-5 py-4">
              <CardHeader
                title={`Позиции · ${lines.length}`}
                description={`Всего ${totalQuantity} ед. по ценам рамочных договоров`}
              />
            </div>

            <ul className="divide-y divide-border">
              {lines.map(({ product, quantity, lineTotal }) => {
                const stock =
                  product.stock.find((s) => s.warehouseId === warehouse?.id)
                    ?.quantity ?? 0;
                const overStock = quantity > stock;

                return (
                  <li
                    key={product.id}
                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40">
                      <Package
                        className="h-6 w-6 text-muted-foreground"
                        strokeWidth={1.5}
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        <span className="font-mono">{product.sku}</span> ·{" "}
                        {categoryName(rootCategoryId(product.categoryId))} ·{" "}
                        {formatMoney(product.price)} за {product.unit}
                      </p>
                      {overStock && (
                        <Badge tone="warning" className="mt-1.5">
                          На {warehouse?.name} свободно {stock} {product.unit} —
                          поставка займёт больше времени
                        </Badge>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <QuantityStepper
                        value={quantity}
                        onChange={(next) => setQuantity(product.id, next)}
                        unit={product.unit}
                        size="sm"
                      />
                      <span className="w-28 text-right text-sm font-bold tabular-nums text-foreground">
                        {formatMoney(lineTotal)}
                      </span>
                      <IconButton
                        icon={Trash2}
                        label="Удалить позицию"
                        onClick={() => removeItem(product.id)}
                        className="hover:text-destructive"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-1 border-t border-border bg-muted/30 px-5 py-4 text-sm">
              <Row label="Сумма без НДС" value={formatMoney(totalAmount)} />
              <Row label="НДС 12%" value={formatMoney(vatAmount)} />
              <Row
                label="Итого с НДС"
                value={formatMoney(totalWithVat)}
                strong
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-3">
            <CardHeader
              title="Комментарий к заказу"
              description="Необязательно: уточнение для согласующего и Торгового Дома."
            />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Например: потребность на плановый ремонт в сентябре"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Card>
        </div>

        {/* Оформление */}
        <div className="flex min-w-0 flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <CardHeader
              title="Оформление"
              description="Цех и место доставки определяются привязкой сотрудника."
            />
            <DefinitionList
              rows={[
                { label: "Цех / участок", value: workshop.name },
                {
                  label: "Предприятие",
                  value: enterprise?.shortName ?? "—",
                },
                { label: "Регион", value: region?.name ?? "—" },
                {
                  label: "Место доставки (РЕСХ)",
                  value: warehouse?.name ?? "—",
                },
                {
                  label: "Учётный контур",
                  value: isOutsideErp ? (
                    <Badge tone="neutral">вне D365 F&O</Badge>
                  ) : (
                    <Badge tone="info">D365 F&O</Badge>
                  ),
                },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              {isOutsideErp
                ? "Предприятие работает вне D365 F&O: заказ передаётся поставщику напрямую, без Purchase Requisition."
                : "После согласования заказ создаст Purchase Requisition в D365 F&O и привяжется к рамочному договору."}
            </p>
          </Card>

          <Card className="flex flex-col gap-4">
            <CardHeader
              title="Проверка лимитов"
              description="Пересчитывается при каждом изменении корзины."
            />
            <LimitVerdictPanel check={check} />
          </Card>

          {/* На lg+ кнопка живёт в колонке оформления, на мобильном — в sticky-панели ниже */}
          <div className="hidden flex-col gap-2 lg:flex">
            <Button
              size="lg"
              fullWidth
              icon={CheckCircle2}
              disabled={!check.canSubmit}
              onClick={submit}
            >
              {submitLabel}
            </Button>
            {!check.canSubmit && (
              <p className="text-center text-xs text-muted-foreground">
                Уменьшите количество или удалите позиции, чтобы уложиться в лимит
                цеха.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Мобильная панель оформления — итог и кнопка всегда на экране */}
      <CartCheckoutBar
        lineCount={lines.length}
        totalWithVat={totalWithVat}
        label={submitLabel}
        hint={
          check.canSubmit
            ? verdictHint
            : "Уменьшите количество, чтобы уложиться в лимит цеха"
        }
        disabled={!check.canSubmit}
        onSubmit={submit}
      />

      {/* Подтверждение оформления */}
      <Modal
        open={Boolean(placedOrder)}
        onClose={() => setPlacedOrder(null)}
        title="Заказ оформлен"
        description="Отслеживайте движение заказа в разделе «Мои заказы»."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPlacedOrder(null)}>
              Остаться в корзине
            </Button>
            <Button
              icon={ClipboardList}
              iconRight={ArrowRight}
              onClick={() => navigate("/orders")}
            >
              Перейти к моим заказам
            </Button>
          </>
        }
      >
        {placedOrder && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-success-border bg-success-soft p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <p className="text-lg font-bold tracking-tight text-foreground">
                {placedOrder.number}
              </p>
              <OrderStatusBadge status={placedOrder.status} showStep />
            </div>

            <DefinitionList
              rows={[
                { label: "Цех / участок", value: workshop.name },
                {
                  label: "Место доставки",
                  value: warehouse?.name ?? "—",
                },
                { label: "Позиций", value: `${placedOrder.lines.length}` },
                {
                  label: "Сумма с НДС",
                  value: formatMoney(placedOrder.totalWithVat),
                },
                {
                  label: "Согласование",
                  value:
                    placedOrder.approvalRoute.length === 0
                      ? "Не требуется (авто-одобрение)"
                      : placedOrder.approvalRoute
                          .map((s) =>
                            s.role === "workshop_head"
                              ? "начальник цеха"
                              : s.role === "division_head"
                                ? "руководитель подразделения"
                                : "бюджетный контролёр"
                          )
                          .join(", "),
                },
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({
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
