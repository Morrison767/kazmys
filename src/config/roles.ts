import type { RoleMeta, UserRole } from "@/types";

/**
 * Роли из концепции. В прототипе роль переключается вручную в шапке —
 * в проде она приходит из HR-системы после авторизации по ИИН + SMS.
 */
export const ROLES: RoleMeta[] = [
  {
    role: "customer",
    label: "Заказчик",
    description: "Ответственный на участке / в цехе",
    homePath: "/catalog",
  },
  {
    role: "approver",
    label: "Согласующий",
    description: "Начальник цеха / участка",
    homePath: "/approvals",
  },
  {
    role: "admin",
    label: "Администратор ТД",
    description: "Специалист Торгового Дома",
    homePath: "/admin/catalog",
  },
  {
    role: "manager",
    label: "Руководитель",
    description: "Руководство ТД / Группы",
    homePath: "/analytics",
  },
];

export const ROLE_META: Record<UserRole, RoleMeta> = ROLES.reduce(
  (acc, r) => ({ ...acc, [r.role]: r }),
  {} as Record<UserRole, RoleMeta>
);
