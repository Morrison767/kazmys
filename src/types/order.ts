/**
 * Заказ и его жизненный цикл. Статусы повторяют путь заказа из концепции
 * (7 шагов: выбор товара → оформление → согласование → передача в ERP →
 * исполнение → перемещение → получение) плюс терминальное «Отклонён».
 */

export enum OrderStatus {
  /** Шаг 1–2: корзина оформляется, заказ ещё не отправлен. */
  Draft = "draft",
  /** Шаг 3: на согласовании у начальника цеха / участка. */
  PendingApproval = "pending_approval",
  /** Шаг 3 завершён: согласован, готов к передаче в ERP. */
  Approved = "approved",
  /** Шаг 4: создан Purchase Requisition в D365 F&O, привязан к договору. */
  SentToErp = "sent_to_erp",
  /** Шаг 5: Purchase Order у поставщика, идёт отгрузка. */
  AtSupplier = "at_supplier",
  /** Шаг 5 завершён: товар принят на РЕСХ. */
  AtWarehouse = "at_warehouse",
  /** Шаг 6: перемещение РЕСХ → предприятие-заказчик. */
  InTransit = "in_transit",
  /** Шаг 7: получение подтверждено сотрудником в маркетплейсе. */
  Received = "received",
  /** Отклонён согласующим или заблокирован проверкой лимитов. */
  Rejected = "rejected",
}

/** Позиция заказа. Цена фиксируется на момент оформления (цена договора). */
export interface OrderLine {
  id: string;
  productId: string;
  /** Снимок названия — заказ должен читаться, даже если позиция ушла из каталога. */
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  /** Цена за единицу на момент оформления, ₸ без НДС. */
  price: number;
  vatRate: number;
  /** quantity * price. */
  lineTotal: number;
  categoryId: string;
  supplierId: string;
  /** РЕСХ отгрузки позиции. */
  warehouseId: string;
  /** Фактически получено на шаге 7 (может отличаться от заказанного). */
  receivedQuantity?: number;
}

/** Запись истории изменения статуса — основа аудита и аналитики сроков. */
export interface OrderStatusEvent {
  status: OrderStatus;
  /** Момент перехода (ISO). */
  at: string;
  /** Кто инициировал: пользователь, «Система» или «D365 F&O». */
  actor: string;
  actorUserId?: string;
  /** Комментарий: причина отклонения, номер PR/PO, номер накладной. */
  comment?: string;
}

/** Роль согласующего в маршруте заказа. */
export type ApprovalRole =
  | "workshop_head" /** Начальник цеха / участка */
  | "division_head" /** Руководитель подразделения (при превышении порога) */
  | "budget_controller"; /** Бюджетный контролёр (при превышении порога) */

/** Шаг маршрута согласования. */
export interface ApprovalStep {
  role: ApprovalRole;
  approverUserId?: string;
  approverName?: string;
  status: "pending" | "approved" | "rejected";
  at?: string;
  comment?: string;
}

/** Ссылки на объекты ERP, созданные по заказу. */
export interface ErpLinks {
  /** Номер Purchase Requisition в D365 F&O. */
  purchaseRequisitionId?: string;
  /** Номер Purchase Order, ушедшего поставщику. */
  purchaseOrderId?: string;
  /** Рамочный договор, к которому привязана заявка. */
  frameworkContractNumber?: string;
  /** Документ перемещения РЕСХ → предприятие. */
  transferOrderId?: string;
  /** Синхронизация не выполняется — предприятие вне D365 F&O. */
  isOutsideErp?: boolean;
}

export interface Order {
  id: string;
  /** Человекочитаемый номер: ЗК-2026-000123. */
  number: string;
  /** Заказчик — ответственный сотрудник цеха. */
  customerId: string;
  customerName: string;
  workshopId: string;
  enterpriseId: string;
  regionId: string;
  /** РЕСХ — место доставки, указывается на шаге «Оформление». */
  warehouseId: string;
  /** Дата создания (ISO). */
  createdAt: string;
  /** Дата последнего изменения (ISO). */
  updatedAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  /** Сумма без НДС, ₸. */
  totalAmount: number;
  /** Сумма НДС, ₸. */
  vatAmount: number;
  /** Сумма с НДС, ₸. */
  totalWithVat: number;
  /** Маршрут согласования — заполняется на шаге 3. */
  approvalRoute: ApprovalStep[];
  /** История переходов статусов с датами. */
  statusHistory: OrderStatusEvent[];
  erp?: ErpLinks;
  /** Заказ прошёл по порогу авто-одобрения без согласования. */
  autoApproved?: boolean;
  /** Ожидаемая дата поставки на РЕСХ (ISO). */
  expectedDeliveryAt?: string;
  /** Фактическая дата получения на предприятии (ISO) — шаг 7. */
  receivedAt?: string;
  /** Комментарий заказчика к заказу. */
  comment?: string;
  /** Причина отклонения — заполняется при статусе Rejected. */
  rejectionReason?: string;
}

/** Позиция корзины — до оформления в заказ. */
export interface CartItem {
  productId: string;
  quantity: number;
  /** Момент добавления (ISO) — для сортировки корзины. */
  addedAt: string;
}
