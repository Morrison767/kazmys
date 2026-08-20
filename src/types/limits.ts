/**
 * Лимиты и контроль потребления — многоуровневая система ограничений
 * на основе утверждённых норм потребления из заявочной кампании.
 * Настраиваются администратором ТД, корректируются в течение года.
 */

/** Период действия лимита. */
export type LimitPeriod = "month" | "quarter" | "year";

/** Тип нарушения лимита — результат проверки при оформлении заказа. */
export type LimitViolationType =
  | "category_not_allowed" /** Цех не имеет права заказывать категорию */
  | "amount_exceeded" /** Превышен лимит по сумме */
  | "quantity_exceeded" /** Превышен лимит по количеству позиции */
  | "product_not_allowed"; /** Позиция недоступна участку (по типу товара) */

/**
 * Лимит цеха по категории: сколько и на какую сумму цех может заказать
 * за период, и с какой суммы включается согласование.
 */
export interface Limit {
  id: string;
  workshopId: string;
  categoryId: string;
  period: LimitPeriod;
  /** Начало текущего периода (ISO) — для расчёта факта. */
  periodStart: string;
  /** Конец текущего периода (ISO). */
  periodEnd: string;
  /** Лимит по сумме за период, ₸. */
  amountLimit: number;
  /** Факт использования суммы за текущий период, ₸. */
  amountUsed: number;
  /** Лимит по количеству единиц за период (нормы расхода); null — без лимита. */
  quantityLimit: number | null;
  /** Факт использования количества за текущий период. */
  quantityUsed: number;
  /**
   * Порог автоматического одобрения, ₸: до порога заказ уходит в ERP сразу,
   * выше — требуется согласование начальником цеха / участка.
   */
  autoApprovalThreshold: number;
  /**
   * Порог доп. согласования, ₸: выше этой суммы к согласованию подключаются
   * руководитель подразделения и бюджетный контролёр.
   */
  escalationThreshold?: number;
  /** Кто и когда последним менял лимит (администратор ТД). */
  updatedBy?: string;
  updatedAt?: string;
  isActive: boolean;
}

/**
 * Норма расхода по конкретной позиции для цеха — ограничение «по количеству»
 * на уровне номенклатуры, поверх суммового лимита категории.
 */
export interface ProductQuota {
  id: string;
  workshopId: string;
  productId: string;
  period: LimitPeriod;
  /** Максимальное количество единиц позиции на период. */
  quantityLimit: number;
  quantityUsed: number;
}

/** Результат проверки лимитов при оформлении заказа. */
export interface LimitCheckResult {
  passed: boolean;
  violations: Array<{
    type: LimitViolationType;
    /** Человекочитаемое сообщение для пользователя. */
    message: string;
    limitId?: string;
    productId?: string;
    categoryId?: string;
  }>;
  /** Требуется ли согласование (сумма выше порога авто-одобрения). */
  requiresApproval: boolean;
  /** Требуется ли доп. согласование (сумма выше порога эскалации). */
  requiresEscalation: boolean;
}
