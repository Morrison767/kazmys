import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

import { Badge, ProgressBar } from "@/components/ui";
import {
  limitTone,
  usedPercent,
  type CartLimitCheck,
  type LimitVerdict,
} from "@/lib/cart-limits";
import { cn, formatMoney } from "@/lib/utils";

interface VerdictStyle {
  icon: LucideIcon;
  title: string;
  description: string;
  box: string;
  text: string;
}

/**
 * Статусы проверки лимитов при оформлении (шаг 2 пути заказа).
 * Тексты соответствуют логике концепции: до порога — авто-одобрение,
 * выше порога — согласование, выше лимита — отклонение.
 */
const VERDICT: Record<LimitVerdict, VerdictStyle> = {
  auto: {
    icon: CheckCircle2,
    title: "Будет одобрен автоматически",
    description:
      "Сумма заказа не превышает порог автоматического одобрения, а лимит цеха на период не исчерпан — заказ уйдёт в исполнение без согласующего.",
    box: "border-success-border bg-success-soft",
    text: "text-success-foreground",
  },
  approval: {
    icon: UserCheck,
    title: "Потребуется согласование руководителя подразделения",
    description:
      "Сумма превышает порог автоматического одобрения, но остаётся в пределах лимита цеха. Заказ уйдёт начальнику цеха / участка.",
    box: "border-warning-border bg-warning-soft",
    text: "text-warning-foreground",
  },
  exceeded: {
    icon: ShieldAlert,
    title: "Превышение лимита цеха — заказ будет отклонён",
    description:
      "Согласующий не может пропустить заказ сверх лимита: лимит корректирует только администратор Торгового Дома. Уменьшите количество или запросите увеличение лимита.",
    box: "border-danger-border bg-danger-soft",
    text: "text-danger-foreground",
  },
  not_allowed: {
    icon: AlertTriangle,
    title: "Категория недоступна цеху",
    description:
      "Цех не имеет права заказывать эту категорию. Уберите позиции из корзины или обратитесь в Торговый Дом за открытием доступа.",
    box: "border-danger-border bg-danger-soft",
    text: "text-danger-foreground",
  },
};

/** Итоговый статус корзины и разбор по каждой категории закупа. */
export function LimitVerdictPanel({ check }: { check: CartLimitCheck }) {
  const style = VERDICT[check.verdict];
  const Icon = style.icon;

  return (
    <div className="flex flex-col gap-3">
      <div className={cn("flex items-start gap-3 rounded-xl border p-4", style.box)}>
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.text)} />
        <div className="min-w-0">
          <p className={cn("text-sm font-bold", style.text)}>{style.title}</p>
          <p className={cn("mt-1 text-xs", style.text)}>{style.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {check.categories.map((category) => {
          const percent = usedPercent(category.usedAfter, category.amountLimit);
          // Порог авто-одобрения сравнивается с суммой заказа по категории.
          const overThreshold =
            category.cartAmount > category.autoApprovalThreshold;

          return (
            <div
              key={category.categoryId}
              className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-sm font-semibold text-foreground">
                  {category.categoryName}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  в заказе {formatMoney(category.cartAmount)} ·{" "}
                  {category.cartQuantity} ед.
                </span>
              </div>

              {category.limit ? (
                <>
                  <ProgressBar
                    value={category.usedAfter}
                    max={category.amountLimit}
                    tone={limitTone(percent)}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
                    <span className="text-muted-foreground tabular-nums">
                      После оформления: {formatMoney(category.usedAfter)} из{" "}
                      {formatMoney(category.amountLimit)} ({percent}%)
                    </span>
                    {category.overBy > 0 ? (
                      <Badge tone="danger">
                        Превышение на {formatMoney(category.overBy)}
                      </Badge>
                    ) : overThreshold ? (
                      <Badge tone="warning">
                        Выше порога {formatMoney(category.autoApprovalThreshold)}
                      </Badge>
                    ) : (
                      <Badge tone="success">В пределах авто-одобрения</Badge>
                    )}
                  </div>
                  {category.quantityOverBy > 0 && (
                    <p className="text-xs font-semibold text-danger-foreground">
                      Превышена норма количества на {category.quantityOverBy} ед.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Лимит по категории не настроен — заказ пойдёт на согласование.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
