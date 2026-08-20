import type { User, UserRole } from "@/types";

/**
 * Демо-пользователи прототипа. В проде вход — по ИИН через HR API + SMS-код;
 * здесь роль и пользователь выбираются вручную в шапке.
 *
 * Заказчики привязаны к своим цехам в разных регионах, включая цех
 * предприятия вне D365 F&O (Казахсервис). У Согласующих заполнен список
 * подотчётных цехов — их заказы попадают в очередь согласований.
 * ИИН маскирован: для прототипа реальные идентификаторы не нужны.
 */
export const USERS: User[] = [
  // ——— Заказчики ———
  {
    id: "usr-cust-drill",
    fullName: "Сериков Айдос Муратович",
    initials: "СА",
    role: "customer",
    position: "Ведущий инженер бурового участка",
    iin: "8704••••1234",
    phone: "+7 (701) 234-56-78",
    email: "a.serikov@kazakhmys.kz",
    workshopId: "wsh-krg-drill",
    enterpriseId: "ent-krg-kpk",
    regionIds: ["reg-krg"],
  },
  {
    id: "usr-cust-acc",
    fullName: "Ибраева Динара Сериковна",
    initials: "ИД",
    role: "customer",
    position: "Специалист административно-хозяйственного отдела",
    iin: "9112••••5678",
    phone: "+7 (702) 345-67-89",
    email: "d.ibraeva@kazakhmys.kz",
    workshopId: "wsh-krg-acc",
    enterpriseId: "ent-krg-kpk",
    regionIds: ["reg-krg"],
  },
  {
    id: "usr-cust-rem",
    fullName: "Ковалёв Дмитрий Сергеевич",
    initials: "КД",
    role: "customer",
    position: "Механик ремонтно-механического цеха",
    iin: "8503••••9012",
    phone: "+7 (705) 456-78-90",
    email: "d.kovalev@kazakhmys.kz",
    workshopId: "wsh-blh-rem",
    enterpriseId: "ent-blh-gok",
    regionIds: ["reg-blh"],
  },
  {
    id: "usr-cust-chu",
    fullName: "Абдрахманова Гульнара Ержановна",
    initials: "АГ",
    role: "customer",
    position: "Специалист по снабжению участка обогащения",
    iin: "8909••••3456",
    phone: "+7 (707) 567-89-01",
    email: "g.abdrakhmanova@kazakhmys.kz",
    workshopId: "wsh-chu-fab",
    enterpriseId: "ent-chu-shatyrkul",
    regionIds: ["reg-chu"],
  },
  {
    id: "usr-cust-svc",
    fullName: "Тлеубаев Ерлан Кайратович",
    initials: "ТЕ",
    role: "customer",
    position: "Начальник смены сервисного участка",
    iin: "8801••••7890",
    phone: "+7 (708) 678-90-12",
    email: "e.tleubaev@kazservice.kz",
    /** Цех предприятия вне D365 F&O — путь заказа без ERP-шагов. */
    workshopId: "wsh-krg-svc",
    enterpriseId: "ent-krg-svc",
    regionIds: ["reg-krg"],
  },

  // ——— Согласующие ———
  {
    id: "usr-appr-krg",
    fullName: "Жумабеков Ержан Талгатович",
    initials: "ЖЕ",
    role: "approver",
    position: "Начальник горного участка, КПК Караганда",
    iin: "7906••••2345",
    phone: "+7 (701) 789-01-23",
    email: "e.zhumabekov@kazakhmys.kz",
    workshopId: "wsh-krg-drill",
    enterpriseId: "ent-krg-kpk",
    regionIds: ["reg-krg"],
    supervisedWorkshopIds: ["wsh-krg-drill", "wsh-krg-acc", "wsh-krg-svc"],
    approvalCeiling: 3000000,
  },
  {
    id: "usr-appr-blh",
    fullName: "Пак Сергей Владимирович",
    initials: "ПС",
    role: "approver",
    position: "Начальник ремонтно-механического цеха, Балхашский ГОК",
    iin: "8207••••6789",
    phone: "+7 (702) 890-12-34",
    email: "s.pak@kazakhmys.kz",
    workshopId: "wsh-blh-rem",
    enterpriseId: "ent-blh-gok",
    regionIds: ["reg-blh"],
    supervisedWorkshopIds: ["wsh-blh-rem", "wsh-blh-smelt"],
    approvalCeiling: 5000000,
  },
  {
    id: "usr-appr-zhz",
    fullName: "Оспанов Нурлан Аскарович",
    initials: "ОН",
    role: "approver",
    position: "Начальник обогатительного производства",
    iin: "8010••••1122",
    phone: "+7 (705) 901-23-45",
    email: "n.ospanov@kazakhmys.kz",
    workshopId: "wsh-zhz-conc",
    enterpriseId: "ent-zhz-gmk",
    regionIds: ["reg-zhz", "reg-chu"],
    supervisedWorkshopIds: ["wsh-zhz-conc", "wsh-chu-fab"],
    approvalCeiling: 4000000,
  },

  // ——— Администратор ТД ———
  {
    id: "usr-admin-td",
    fullName: "Байжанова Асель Кайратовна",
    initials: "БА",
    role: "admin",
    position: "Специалист Торгового Дома",
    iin: "8605••••3344",
    phone: "+7 (701) 012-34-56",
    email: "a.baizhanova@td.kazakhmys.kz",
    regionIds: ["reg-krg", "reg-blh", "reg-zhz", "reg-chu"],
  },

  // ——— Руководитель ———
  {
    id: "usr-manager-td",
    fullName: "Ахметов Данияр Болатович",
    initials: "АД",
    role: "manager",
    position: "Директор Торгового Дома",
    iin: "7503••••5566",
    phone: "+7 (701) 123-45-67",
    email: "d.akhmetov@td.kazakhmys.kz",
    regionIds: ["reg-krg", "reg-blh", "reg-zhz", "reg-chu"],
  },
];

export function userById(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}

export function usersByRole(role: UserRole): User[] {
  return USERS.filter((u) => u.role === role);
}

/** Пользователь по умолчанию для роли — при переключении роли в шапке. */
export function defaultUserForRole(role: UserRole): User | undefined {
  return USERS.find((u) => u.role === role);
}

/** Согласующий, к которому идут заказы цеха. */
export function approverOfWorkshop(workshopId: string): User | undefined {
  return USERS.find(
    (u) =>
      u.role === "approver" && u.supervisedWorkshopIds?.includes(workshopId)
  );
}
