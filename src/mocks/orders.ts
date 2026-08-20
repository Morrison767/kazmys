import { rootCategoryId } from "@/mocks/categories";
import { limitOf } from "@/mocks/limits";
import { productById } from "@/mocks/products";
import { enterpriseById, isOutsideErp } from "@/mocks/regions";
import { supplierOfCategory } from "@/mocks/suppliers";
import { approverOfWorkshop, userById } from "@/mocks/users";
import { workshopById } from "@/mocks/workshops";
import {
  OrderStatus,
  type ApprovalStep,
  type ErpLinks,
  type Order,
  type OrderLine,
  type OrderStatusEvent,
} from "@/types";

/**
 * Заказы за последние три месяца (июнь — август 2026, «сегодня» — 20.08.2026).
 * Каждый статус жизненного цикла встречается хотя бы раз.
 *
 * Суммы, история статусов, маршрут согласования и ссылки на документы ERP
 * не проставляются вручную, а собираются фабрикой из позиций и цепочки
 * статусов — так данные не расходятся между собой.
 *
 * Заказы цеха предприятия вне D365 F&O (ТОО «Казахсервис», wsh-krg-svc)
 * идут по упрощённому пути без ERP-шагов:
 * Черновик → На согласовании → Согласован → У поставщика → Получен.
 *
 * Упрощение прототипа: пороги согласования берутся по категории закупа
 * первой позиции заказа. На следующих этапах проверка лимитов будет
 * выполняться по каждой категории заказа отдельно (заказ может содержать
 * позиции нескольких категорий — см. ЗК-2026-000087).
 */

/** [товар, количество, получено (если отличается от заказанного)]. */
type LineRow = [productId: string, quantity: number, received?: number];

/** [статус, дата ISO, кто инициировал, комментарий]. */
type HistoryRow = [
  status: OrderStatus,
  at: string,
  actor?: string,
  comment?: string,
];

interface OrderRow {
  id: string;
  number: string;
  customerId: string;
  lines: LineRow[];
  history: HistoryRow[];
  expectedDeliveryAt?: string;
  comment?: string;
  rejectionReason?: string;
}

function buildLines(orderId: string, rows: LineRow[]): OrderLine[] {
  return rows.map(([productId, quantity, received], index) => {
    const product = productById(productId);
    if (!product) {
      throw new Error(`Позиция ${productId} не найдена (заказ ${orderId})`);
    }
    const workshopWarehouse = product.primaryWarehouseId;
    return {
      id: `${orderId}-l${index + 1}`,
      productId,
      productName: product.name,
      sku: product.sku,
      unit: product.unit,
      quantity,
      /** Цена по рамочному договору на момент оформления. */
      price: product.price,
      vatRate: product.vatRate,
      lineTotal: product.price * quantity,
      /** Категория закупа — по ней проверяется лимит цеха. */
      categoryId: rootCategoryId(product.categoryId),
      supplierId: product.supplierId,
      warehouseId: workshopWarehouse,
      ...(received === undefined ? {} : { receivedQuantity: received }),
    };
  });
}

function buildHistory(rows: HistoryRow[]): OrderStatusEvent[] {
  return rows.map(([status, at, actor, comment]) => ({
    status,
    at,
    actor: actor ?? "Система",
    ...(comment === undefined ? {} : { comment }),
  }));
}

/** Маршрут согласования — по сумме заказа и порогам лимита цеха. */
function buildApprovalRoute(
  workshopId: string,
  purchaseCategoryId: string,
  totalAmount: number,
  history: OrderStatusEvent[]
): { route: ApprovalStep[]; autoApproved: boolean } {
  const limit = limitOf(workshopId, purchaseCategoryId);
  const approver = approverOfWorkshop(workshopId);
  const pendingEvent = history.find(
    (e) => e.status === OrderStatus.PendingApproval
  );
  const approvedEvent = history.find((e) => e.status === OrderStatus.Approved);
  const rejectedEvent = history.find((e) => e.status === OrderStatus.Rejected);

  // Заказ ниже порога авто-одобрения — согласование не требовалось.
  if (!pendingEvent && !rejectedEvent) {
    return {
      route: [],
      autoApproved: Boolean(
        limit && totalAmount <= limit.autoApprovalThreshold && approvedEvent
      ),
    };
  }

  const headStatus: ApprovalStep["status"] = rejectedEvent
    ? "rejected"
    : approvedEvent
      ? "approved"
      : "pending";

  const head: ApprovalStep = {
    role: "workshop_head",
    approverUserId: approver?.id,
    approverName: approver?.fullName,
    status: headStatus,
    ...(rejectedEvent
      ? { at: rejectedEvent.at, comment: rejectedEvent.comment }
      : approvedEvent
        ? { at: approvedEvent.at }
        : {}),
  };

  const route: ApprovalStep[] = [head];

  // Превышен порог эскалации — подключаются руководитель подразделения
  // и бюджетный контролёр.
  if (limit?.escalationThreshold && totalAmount > limit.escalationThreshold) {
    const escalationStatus: ApprovalStep["status"] =
      headStatus === "approved" ? "approved" : "pending";
    route.push(
      {
        role: "division_head",
        approverName: "Тұрсынов Қайрат Серікұлы",
        status: escalationStatus,
        ...(approvedEvent && escalationStatus === "approved"
          ? { at: approvedEvent.at }
          : {}),
      },
      {
        role: "budget_controller",
        approverName: "Сагинтаева Жанар Ерболовна",
        status: escalationStatus,
        ...(approvedEvent && escalationStatus === "approved"
          ? { at: approvedEvent.at }
          : {}),
      }
    );
  }

  return { route, autoApproved: false };
}

/** Ссылки на документы ERP — только для предприятий в контуре D365 F&O. */
function buildErpLinks(
  orderNumber: string,
  enterpriseId: string,
  purchaseCategoryId: string,
  history: OrderStatusEvent[]
): ErpLinks {
  const contractNumber = supplierOfCategory(purchaseCategoryId)?.contractNumber;
  const seq = orderNumber.slice(-6);
  const reached = (status: OrderStatus) =>
    history.some((e) => e.status === status);

  if (isOutsideErp(enterpriseId)) {
    return {
      isOutsideErp: true,
      ...(contractNumber ? { frameworkContractNumber: contractNumber } : {}),
    };
  }

  return {
    ...(contractNumber ? { frameworkContractNumber: contractNumber } : {}),
    ...(reached(OrderStatus.SentToErp)
      ? { purchaseRequisitionId: `PR-2026-${seq}` }
      : {}),
    ...(reached(OrderStatus.AtSupplier)
      ? { purchaseOrderId: `PO-2026-${seq}` }
      : {}),
    ...(reached(OrderStatus.InTransit)
      ? { transferOrderId: `TO-2026-${seq}` }
      : {}),
  };
}

function buildOrder(row: OrderRow): Order {
  const customer = userById(row.customerId);
  if (!customer?.workshopId) {
    throw new Error(`Заказчик ${row.customerId} без привязки к цеху`);
  }
  const workshop = workshopById(customer.workshopId);
  if (!workshop) {
    throw new Error(`Цех ${customer.workshopId} не найден`);
  }
  const enterprise = enterpriseById(workshop.enterpriseId);
  if (!enterprise) {
    throw new Error(`Предприятие ${workshop.enterpriseId} не найдено`);
  }

  const lines = buildLines(row.id, row.lines);
  const history = buildHistory(row.history);
  const totalAmount = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const vatAmount = lines.reduce(
    (sum, l) => sum + Math.round((l.lineTotal * l.vatRate) / 100),
    0
  );
  const purchaseCategoryId = lines[0].categoryId;
  const status = history[history.length - 1].status;
  const receivedEvent = history.find((e) => e.status === OrderStatus.Received);
  const { route, autoApproved } = buildApprovalRoute(
    workshop.id,
    purchaseCategoryId,
    totalAmount,
    history
  );

  return {
    id: row.id,
    number: row.number,
    customerId: customer.id,
    customerName: customer.fullName,
    workshopId: workshop.id,
    enterpriseId: workshop.enterpriseId,
    regionId: workshop.regionId,
    warehouseId: workshop.defaultWarehouseId,
    createdAt: history[0].at,
    updatedAt: history[history.length - 1].at,
    status,
    lines,
    totalAmount,
    vatAmount,
    totalWithVat: totalAmount + vatAmount,
    approvalRoute: route,
    statusHistory: history,
    erp: buildErpLinks(
      row.number,
      workshop.enterpriseId,
      purchaseCategoryId,
      history
    ),
    ...(autoApproved ? { autoApproved: true } : {}),
    ...(row.expectedDeliveryAt
      ? { expectedDeliveryAt: row.expectedDeliveryAt }
      : {}),
    ...(receivedEvent ? { receivedAt: receivedEvent.at } : {}),
    ...(row.comment ? { comment: row.comment } : {}),
    ...(row.rejectionReason ? { rejectionReason: row.rejectionReason } : {}),
  };
}

const ORDER_ROWS: OrderRow[] = [
  // ——————————————————————— Черновики ———————————————————————
  {
    id: "ord-001",
    number: "ЗК-2026-000141",
    customerId: "usr-cust-drill",
    lines: [
      ["prd-tls-013", 8],
      ["prd-tls-014", 24],
    ],
    history: [
      [
        OrderStatus.Draft,
        "2026-08-19T05:20:00.000Z",
        "Сериков А.М.",
        "Заявка на бурильную оснастку на сентябрь",
      ],
    ],
    comment: "Уточнить потребность у сменных мастеров до отправки",
  },
  {
    id: "ord-002",
    number: "ЗК-2026-000142",
    customerId: "usr-cust-acc",
    lines: [
      ["prd-off-001", 40],
      ["prd-off-010", 30],
      ["prd-off-004", 100],
    ],
    history: [[OrderStatus.Draft, "2026-08-18T09:05:00.000Z", "Ибраева Д.С."]],
  },

  // ————————————————————— На согласовании —————————————————————
  {
    id: "ord-003",
    number: "ЗК-2026-000138",
    customerId: "usr-cust-rem",
    /** Сумма выше порога эскалации — подключены доп. согласующие. */
    lines: [
      ["prd-tls-002", 20],
      ["prd-tls-005", 5],
    ],
    history: [
      [OrderStatus.Draft, "2026-08-17T04:40:00.000Z", "Ковалёв Д.С."],
      [
        OrderStatus.PendingApproval,
        "2026-08-17T06:15:00.000Z",
        "Ковалёв Д.С.",
        "Плановая замена инструмента по программе ремонтов",
      ],
    ],
    expectedDeliveryAt: "2026-09-10",
  },
  {
    id: "ord-004",
    number: "ЗК-2026-000140",
    customerId: "usr-cust-chu",
    lines: [
      ["prd-tls-017", 9],
      ["prd-tls-015", 6],
      ["prd-tls-004", 2],
    ],
    history: [
      [OrderStatus.Draft, "2026-08-18T03:30:00.000Z", "Абдрахманова Г.Е."],
      [
        OrderStatus.PendingApproval,
        "2026-08-18T05:10:00.000Z",
        "Абдрахманова Г.Е.",
      ],
    ],
    expectedDeliveryAt: "2026-09-05",
  },

  // ——————————————————————— Согласован ———————————————————————
  {
    id: "ord-005",
    number: "ЗК-2026-000135",
    customerId: "usr-cust-drill",
    lines: [
      ["prd-oth-001", 600],
      ["prd-oth-003", 40],
    ],
    history: [
      [OrderStatus.Draft, "2026-08-14T04:15:00.000Z", "Сериков А.М."],
      [OrderStatus.PendingApproval, "2026-08-14T05:00:00.000Z", "Сериков А.М."],
      [
        OrderStatus.Approved,
        "2026-08-16T03:45:00.000Z",
        "Жумабеков Е.Т.",
        "Согласовано в пределах месячного лимита участка",
      ],
    ],
    expectedDeliveryAt: "2026-09-01",
  },

  // ————————————————————— Передан в ERP —————————————————————
  {
    id: "ord-006",
    number: "ЗК-2026-000131",
    customerId: "usr-cust-acc",
    lines: [
      ["prd-hhd-005", 120],
      ["prd-hhd-010", 80],
      ["prd-hhd-011", 60],
    ],
    history: [
      [OrderStatus.Draft, "2026-08-11T06:00:00.000Z", "Ибраева Д.С."],
      [OrderStatus.PendingApproval, "2026-08-11T07:20:00.000Z", "Ибраева Д.С."],
      [OrderStatus.Approved, "2026-08-12T04:10:00.000Z", "Жумабеков Е.Т."],
      [
        OrderStatus.SentToErp,
        "2026-08-13T02:30:00.000Z",
        "D365 F&O",
        "Создан Purchase Requisition, привязан к договору ТД-2026-Х-027",
      ],
    ],
    expectedDeliveryAt: "2026-08-28",
  },

  // ————————————————————— У поставщика —————————————————————
  {
    id: "ord-007",
    number: "ЗК-2026-000126",
    customerId: "usr-cust-rem",
    lines: [
      ["prd-tls-018", 19],
      ["prd-tls-009", 25],
      ["prd-tls-003", 2],
    ],
    history: [
      [OrderStatus.Draft, "2026-08-05T05:30:00.000Z", "Ковалёв Д.С."],
      [OrderStatus.PendingApproval, "2026-08-05T06:45:00.000Z", "Ковалёв Д.С."],
      [OrderStatus.Approved, "2026-08-06T03:20:00.000Z", "Пак С.В."],
      [OrderStatus.SentToErp, "2026-08-06T09:05:00.000Z", "D365 F&O"],
      [
        OrderStatus.AtSupplier,
        "2026-08-08T04:00:00.000Z",
        "D365 F&O",
        "Заказ на поставку передан ТОО «Промснаб Инструмент»",
      ],
    ],
    expectedDeliveryAt: "2026-08-25",
  },

  // ——————————————————————— На РЕСХ ———————————————————————
  {
    id: "ord-008",
    number: "ЗК-2026-000119",
    customerId: "usr-cust-drill",
    lines: [
      ["prd-tls-016", 4],
      ["prd-tls-013", 11],
      ["prd-tls-002", 1],
    ],
    history: [
      [OrderStatus.Draft, "2026-07-28T04:10:00.000Z", "Сериков А.М."],
      [OrderStatus.PendingApproval, "2026-07-28T05:25:00.000Z", "Сериков А.М."],
      [OrderStatus.Approved, "2026-07-30T03:40:00.000Z", "Жумабеков Е.Т."],
      [OrderStatus.SentToErp, "2026-07-30T08:15:00.000Z", "D365 F&O"],
      [OrderStatus.AtSupplier, "2026-08-03T06:30:00.000Z", "D365 F&O"],
      [
        OrderStatus.AtWarehouse,
        "2026-08-12T07:45:00.000Z",
        "РЕСХ Караганда",
        "Принято на склад по накладной №4471",
      ],
    ],
    expectedDeliveryAt: "2026-08-22",
  },
  {
    id: "ord-009",
    number: "ЗК-2026-000122",
    customerId: "usr-cust-rem",
    lines: [
      ["prd-oth-013", 400],
      ["prd-oth-014", 120],
    ],
    history: [
      [OrderStatus.Draft, "2026-08-01T05:00:00.000Z", "Ковалёв Д.С."],
      [OrderStatus.PendingApproval, "2026-08-01T06:10:00.000Z", "Ковалёв Д.С."],
      [OrderStatus.Approved, "2026-08-03T04:20:00.000Z", "Пак С.В."],
      [OrderStatus.SentToErp, "2026-08-03T09:30:00.000Z", "D365 F&O"],
      [OrderStatus.AtSupplier, "2026-08-07T05:15:00.000Z", "D365 F&O"],
      [OrderStatus.AtWarehouse, "2026-08-16T08:00:00.000Z", "РЕСХ Балхаш"],
    ],
    expectedDeliveryAt: "2026-08-24",
  },

  // ————————————————— В пути на предприятие —————————————————
  {
    id: "ord-010",
    number: "ЗК-2026-000114",
    customerId: "usr-cust-chu",
    lines: [
      ["prd-oth-006", 45],
      ["prd-oth-002", 60],
    ],
    history: [
      [OrderStatus.Draft, "2026-07-22T03:20:00.000Z", "Абдрахманова Г.Е."],
      [
        OrderStatus.PendingApproval,
        "2026-07-22T04:35:00.000Z",
        "Абдрахманова Г.Е.",
      ],
      [OrderStatus.Approved, "2026-07-24T05:00:00.000Z", "Оспанов Н.А."],
      [OrderStatus.SentToErp, "2026-07-24T10:10:00.000Z", "D365 F&O"],
      [OrderStatus.AtSupplier, "2026-07-29T06:20:00.000Z", "D365 F&O"],
      [OrderStatus.AtWarehouse, "2026-08-10T07:30:00.000Z", "РЕСХ Шатыркуль"],
      [
        OrderStatus.InTransit,
        "2026-08-15T04:45:00.000Z",
        "D365 F&O",
        "Перемещение РЕСХ → ОФ Шатыркуль, документ перемещения проведён",
      ],
    ],
    expectedDeliveryAt: "2026-08-21",
  },

  // ———————————————————————— Получен ————————————————————————
  {
    id: "ord-011",
    number: "ЗК-2026-000087",
    customerId: "usr-cust-drill",
    /** Заказ на две категории закупа — инструмент и СИЗ. */
    lines: [
      ["prd-tls-014", 60],
      ["prd-oth-001", 700],
    ],
    history: [
      [OrderStatus.Draft, "2026-06-15T04:00:00.000Z", "Сериков А.М."],
      [OrderStatus.PendingApproval, "2026-06-15T05:15:00.000Z", "Сериков А.М."],
      [OrderStatus.Approved, "2026-06-16T03:30:00.000Z", "Жумабеков Е.Т."],
      [OrderStatus.SentToErp, "2026-06-16T08:40:00.000Z", "D365 F&O"],
      [OrderStatus.AtSupplier, "2026-06-19T06:00:00.000Z", "D365 F&O"],
      [OrderStatus.AtWarehouse, "2026-06-30T07:10:00.000Z", "РЕСХ Караганда"],
      [OrderStatus.InTransit, "2026-07-03T05:20:00.000Z", "D365 F&O"],
      [
        OrderStatus.Received,
        "2026-07-06T06:35:00.000Z",
        "Сериков А.М.",
        "Получено полностью, расхождений нет",
      ],
    ],
    expectedDeliveryAt: "2026-07-05",
  },
  {
    id: "ord-012",
    number: "ЗК-2026-000092",
    customerId: "usr-cust-rem",
    /** Частичная поставка: по одной позиции получено меньше заказанного. */
    lines: [
      ["prd-tls-015", 8],
      ["prd-tls-012", 30, 26],
      ["prd-tls-008", 10],
    ],
    history: [
      [OrderStatus.Draft, "2026-06-22T04:25:00.000Z", "Ковалёв Д.С."],
      [OrderStatus.PendingApproval, "2026-06-22T05:40:00.000Z", "Ковалёв Д.С."],
      [OrderStatus.Approved, "2026-06-24T03:50:00.000Z", "Пак С.В."],
      [OrderStatus.SentToErp, "2026-06-24T09:00:00.000Z", "D365 F&O"],
      [OrderStatus.AtSupplier, "2026-06-27T06:15:00.000Z", "D365 F&O"],
      [OrderStatus.AtWarehouse, "2026-07-08T07:25:00.000Z", "РЕСХ Балхаш"],
      [OrderStatus.InTransit, "2026-07-11T05:35:00.000Z", "D365 F&O"],
      [
        OrderStatus.Received,
        "2026-07-14T06:50:00.000Z",
        "Ковалёв Д.С.",
        "Недопоставка 4 шт по позиции «Молоток слесарный 800 г»",
      ],
    ],
    expectedDeliveryAt: "2026-07-12",
  },
  {
    id: "ord-013",
    number: "ЗК-2026-000098",
    customerId: "usr-cust-acc",
    /** Сумма ниже порога авто-одобрения — согласование не требовалось. */
    lines: [
      ["prd-off-001", 20],
      ["prd-off-004", 50],
    ],
    history: [
      [OrderStatus.Draft, "2026-07-02T05:10:00.000Z", "Ибраева Д.С."],
      [
        OrderStatus.Approved,
        "2026-07-02T05:12:00.000Z",
        "Система",
        "Автоматическое одобрение: сумма ниже порога 150 000 ₸",
      ],
      [OrderStatus.SentToErp, "2026-07-02T05:30:00.000Z", "D365 F&O"],
      [OrderStatus.AtSupplier, "2026-07-06T04:20:00.000Z", "D365 F&O"],
      [OrderStatus.AtWarehouse, "2026-07-15T07:00:00.000Z", "РЕСХ Караганда"],
      [OrderStatus.InTransit, "2026-07-18T05:15:00.000Z", "D365 F&O"],
      [OrderStatus.Received, "2026-07-21T06:40:00.000Z", "Ибраева Д.С."],
    ],
    expectedDeliveryAt: "2026-07-20",
  },
  {
    id: "ord-014",
    number: "ЗК-2026-000079",
    customerId: "usr-cust-chu",
    lines: [
      ["prd-hhd-003", 24],
      ["prd-hhd-005", 60],
      ["prd-hhd-008", 30],
    ],
    history: [
      [OrderStatus.Draft, "2026-06-08T03:40:00.000Z", "Абдрахманова Г.Е."],
      [
        OrderStatus.PendingApproval,
        "2026-06-08T04:55:00.000Z",
        "Абдрахманова Г.Е.",
      ],
      [OrderStatus.Approved, "2026-06-10T05:05:00.000Z", "Оспанов Н.А."],
      [OrderStatus.SentToErp, "2026-06-10T09:20:00.000Z", "D365 F&O"],
      [OrderStatus.AtSupplier, "2026-06-14T06:30:00.000Z", "D365 F&O"],
      [OrderStatus.AtWarehouse, "2026-06-25T07:40:00.000Z", "РЕСХ Шатыркуль"],
      [OrderStatus.InTransit, "2026-06-27T05:50:00.000Z", "D365 F&O"],
      [OrderStatus.Received, "2026-06-30T07:05:00.000Z", "Абдрахманова Г.Е."],
    ],
    expectedDeliveryAt: "2026-06-29",
  },
  {
    id: "ord-015",
    number: "ЗК-2026-000104",
    customerId: "usr-cust-drill",
    lines: [
      ["prd-tls-006", 3],
      ["prd-tls-007", 20],
    ],
    history: [
      [OrderStatus.Draft, "2026-07-10T04:05:00.000Z", "Сериков А.М."],
      [OrderStatus.PendingApproval, "2026-07-10T05:20:00.000Z", "Сериков А.М."],
      [OrderStatus.Approved, "2026-07-13T03:35:00.000Z", "Жумабеков Е.Т."],
      [OrderStatus.SentToErp, "2026-07-13T08:50:00.000Z", "D365 F&O"],
      [OrderStatus.AtSupplier, "2026-07-17T06:10:00.000Z", "D365 F&O"],
      [OrderStatus.AtWarehouse, "2026-07-24T07:20:00.000Z", "РЕСХ Караганда"],
      [OrderStatus.InTransit, "2026-07-27T05:30:00.000Z", "D365 F&O"],
      [OrderStatus.Received, "2026-07-29T06:45:00.000Z", "Сериков А.М."],
    ],
    expectedDeliveryAt: "2026-07-28",
  },

  // ———————————————————————— Отклонён ————————————————————————
  {
    id: "ord-016",
    number: "ЗК-2026-000117",
    customerId: "usr-cust-rem",
    /**
     * Сумма ниже порога авто-одобрения, но проверка лимитов выявила
     * превышение нормы расхода — заказ принудительно ушёл на согласование
     * и был отклонён.
     */
    lines: [["prd-tls-018", 24]],
    history: [
      [OrderStatus.Draft, "2026-07-30T04:30:00.000Z", "Ковалёв Д.С."],
      [OrderStatus.PendingApproval, "2026-07-30T05:45:00.000Z", "Ковалёв Д.С."],
      [
        OrderStatus.Rejected,
        "2026-07-31T04:00:00.000Z",
        "Пак С.В.",
        "Превышена норма расхода по позиции: 24 упак против нормы 15 упак в месяц",
      ],
    ],
    rejectionReason:
      "Превышена месячная норма расхода по позиции «Сверло по металлу HSS-Co 10 мм»",
  },

  // ————————— ТОО «Казахсервис»: путь без ERP-шагов —————————
  {
    id: "ord-017",
    number: "ЗК-2026-000128",
    customerId: "usr-cust-svc",
    lines: [
      ["prd-tls-003", 6],
      ["prd-tls-011", 10],
    ],
    history: [
      [OrderStatus.Draft, "2026-08-06T05:05:00.000Z", "Тлеубаев Е.К."],
      [OrderStatus.PendingApproval, "2026-08-06T06:20:00.000Z", "Тлеубаев Е.К."],
      [
        OrderStatus.Rejected,
        "2026-08-07T04:15:00.000Z",
        "Жумабеков Е.Т.",
        "Месячный лимит участка по категории «Инструменты» уже превышен",
      ],
    ],
    rejectionReason:
      "Месячный лимит участка по категории «Инструменты» исчерпан (116%)",
  },
  {
    id: "ord-018",
    number: "ЗК-2026-000133",
    customerId: "usr-cust-svc",
    lines: [
      ["prd-hhd-001", 40],
      ["prd-hhd-004", 30],
    ],
    history: [
      [OrderStatus.Draft, "2026-08-12T04:50:00.000Z", "Тлеубаев Е.К."],
      [OrderStatus.PendingApproval, "2026-08-12T06:05:00.000Z", "Тлеубаев Е.К."],
      [OrderStatus.Approved, "2026-08-13T03:25:00.000Z", "Жумабеков Е.Т."],
      [
        OrderStatus.AtSupplier,
        "2026-08-14T05:40:00.000Z",
        "Система",
        "Заказ передан поставщику напрямую: предприятие вне контура D365 F&O",
      ],
    ],
    expectedDeliveryAt: "2026-08-27",
    comment: "Доставка силами поставщика на сервисный участок",
  },
  {
    id: "ord-019",
    number: "ЗК-2026-000096",
    customerId: "usr-cust-svc",
    lines: [
      ["prd-off-001", 25],
      ["prd-off-011", 20],
      ["prd-off-014", 30],
    ],
    history: [
      [OrderStatus.Draft, "2026-07-03T05:15:00.000Z", "Тлеубаев Е.К."],
      [OrderStatus.PendingApproval, "2026-07-03T06:30:00.000Z", "Тлеубаев Е.К."],
      [OrderStatus.Approved, "2026-07-06T04:10:00.000Z", "Жумабеков Е.Т."],
      [OrderStatus.AtSupplier, "2026-07-07T05:25:00.000Z", "Система"],
      [
        OrderStatus.Received,
        "2026-07-18T07:00:00.000Z",
        "Тлеубаев Е.К.",
        "Получено на сервисном участке, данные переданы в учётную систему предприятия",
      ],
    ],
    expectedDeliveryAt: "2026-07-17",
  },
];

export const ORDERS: Order[] = ORDER_ROWS.map(buildOrder);

export function orderById(id: string): Order | undefined {
  return ORDERS.find((o) => o.id === id);
}

export function ordersByCustomer(customerId: string): Order[] {
  return ORDERS.filter((o) => o.customerId === customerId);
}

export function ordersByWorkshop(workshopId: string): Order[] {
  return ORDERS.filter((o) => o.workshopId === workshopId);
}

/** Очередь согласований: заказы подотчётных цехов на статусе «На согласовании». */
export function ordersPendingApproval(workshopIds?: string[]): Order[] {
  return ORDERS.filter(
    (o) =>
      o.status === OrderStatus.PendingApproval &&
      (!workshopIds || workshopIds.includes(o.workshopId))
  );
}

/** Заказы предприятий вне D365 F&O — упрощённый путь без ERP-шагов. */
export const ORDERS_OUTSIDE_ERP = ORDERS.filter((o) => o.erp?.isOutsideErp);
