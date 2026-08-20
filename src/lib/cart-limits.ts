import { rootCategoryId } from "@/mocks";
import type { Limit, Product } from "@/types";

/**
 * Проверка корзины по лимитам цеха (шаг 2 пути заказа).
 *
 * Заказ может содержать позиции нескольких категорий закупа, а лимит
 * настраивается на пару «цех × категория». Поэтому корзина разбивается
 * по категориям, каждая проверяется своим лимитом, а итоговый статус
 * заказа — самый строгий из полученных.
 */

export type LimitVerdict =
  | "auto" /** Сумма в пределах порога авто-одобрения */
  | "approval" /** Нужно согласование руководителя подразделения */
  | "exceeded" /** Превышен лимит цеха на период */
  | "not_allowed"; /** Цех не имеет права заказывать категорию */

export interface CartLine {
  product: Product;
  quantity: number;
  /** quantity × цена договора, ₸ без НДС. */
  lineTotal: number;
}

/** Результат проверки по одной категории закупа. */
export interface CategoryLimitCheck {
  categoryId: string;
  categoryName: string;
  verdict: LimitVerdict;
  /** Сумма позиций этой категории в корзине, ₸. */
  cartAmount: number;
  /** Количество единиц этой категории в корзине. */
  cartQuantity: number;
  limit?: Limit;
  /** Факт использования до оформления заказа, ₸. */
  usedBefore: number;
  /** Факт после оформления, ₸. */
  usedAfter: number;
  amountLimit: number;
  autoApprovalThreshold: number;
  /** Превышение лимита, ₸ (0, если лимит не превышен). */
  overBy: number;
  /** Превышение лимита по количеству, ед. (0, если нет). */
  quantityOverBy: number;
  lines: CartLine[];
}

export interface CartLimitCheck {
  categories: CategoryLimitCheck[];
  /** Самый строгий вердикт по корзине. */
  verdict: LimitVerdict;
  totalAmount: number;
  totalQuantity: number;
  /** Заказ можно оформить: ни одна категория не выходит за лимит цеха. */
  canSubmit: boolean;
}

const SEVERITY: Record<LimitVerdict, number> = {
  auto: 0,
  approval: 1,
  exceeded: 2,
  not_allowed: 3,
};

/**
 * Вердикт по одной категории.
 *
 * Порядок проверок соответствует концепции:
 * 1) лимит цеха на период (сумма и норма количества) — жёсткое ограничение,
 *    считается накопительно: факт за период + корзина;
 * 2) порог автоматического одобрения — сравнивается с СУММОЙ ЗАКАЗА
 *    («до порога — заказ уходит сразу, выше — требуется согласование»),
 *    а не с накопленным фактом: иначе к середине периода порог перестаёт
 *    работать и любой, даже мелкий, заказ уходил бы на согласование.
 */
function verdictFor(
  limit: Limit | undefined,
  isCategoryAllowed: boolean,
  cartAmount: number,
  usedAfter: number,
  cartQuantity: number
): LimitVerdict {
  if (!isCategoryAllowed) return "not_allowed";
  // Лимит на пару «цех × категория» не настроен — заказ идёт на согласование.
  if (!limit) return "approval";

  const quantityExceeded =
    limit.quantityLimit !== null &&
    limit.quantityUsed + cartQuantity > limit.quantityLimit;

  if (usedAfter > limit.amountLimit || quantityExceeded) return "exceeded";
  if (cartAmount > limit.autoApprovalThreshold) return "approval";
  return "auto";
}

export function checkCartLimits({
  lines,
  workshopId,
  allowedCategoryIds,
  limits,
  categoryName,
}: {
  lines: CartLine[];
  workshopId: string;
  allowedCategoryIds: string[];
  limits: Limit[];
  /** Название категории закупа — для текстов в интерфейсе. */
  categoryName: (categoryId: string) => string;
}): CartLimitCheck {
  const byCategory = new Map<string, CartLine[]>();
  for (const line of lines) {
    const categoryId = rootCategoryId(line.product.categoryId);
    byCategory.set(categoryId, [...(byCategory.get(categoryId) ?? []), line]);
  }

  const categories: CategoryLimitCheck[] = [...byCategory.entries()].map(
    ([categoryId, categoryLines]) => {
      const cartAmount = categoryLines.reduce((sum, l) => sum + l.lineTotal, 0);
      const cartQuantity = categoryLines.reduce((sum, l) => sum + l.quantity, 0);
      const limit = limits.find(
        (l) => l.workshopId === workshopId && l.categoryId === categoryId
      );
      const usedBefore = limit?.amountUsed ?? 0;
      const usedAfter = usedBefore + cartAmount;
      const amountLimit = limit?.amountLimit ?? 0;
      const isAllowed = allowedCategoryIds.includes(categoryId);

      return {
        categoryId,
        categoryName: categoryName(categoryId),
        verdict: verdictFor(
          limit,
          isAllowed,
          cartAmount,
          usedAfter,
          cartQuantity
        ),
        cartAmount,
        cartQuantity,
        limit,
        usedBefore,
        usedAfter,
        amountLimit,
        autoApprovalThreshold: limit?.autoApprovalThreshold ?? 0,
        overBy: limit ? Math.max(0, usedAfter - limit.amountLimit) : 0,
        quantityOverBy:
          limit?.quantityLimit != null
            ? Math.max(
                0,
                limit.quantityUsed + cartQuantity - limit.quantityLimit
              )
            : 0,
        lines: categoryLines,
      };
    }
  );

  const verdict = categories.reduce<LimitVerdict>(
    (worst, c) => (SEVERITY[c.verdict] > SEVERITY[worst] ? c.verdict : worst),
    "auto"
  );

  return {
    categories,
    verdict,
    totalAmount: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    /**
     * Оформление блокируется при превышении лимита. Согласующий не может
     * пропустить заказ сверх лимита — лимит меняет только администратор ТД,
     * поэтому отправка такого заказа гарантированно закончится отклонением
     * и лишь засорит очередь согласований. Заказчику предлагается уменьшить
     * количество или запросить корректировку лимита у администратора ТД.
     */
    canSubmit: lines.length > 0 && SEVERITY[verdict] < SEVERITY.exceeded,
  };
}

/** Доля использования лимита с учётом корзины, % (может быть > 100). */
export function usedPercent(used: number, limit: number): number {
  return limit > 0 ? Math.round((used / limit) * 100) : 0;
}

/**
 * Тон индикатора лимита: зелёный < 60%, жёлтый 60–90%, красный > 90%.
 */
export function limitTone(percent: number): "success" | "warning" | "danger" {
  if (percent > 90) return "danger";
  if (percent >= 60) return "warning";
  return "success";
}
