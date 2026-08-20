import {
  BarChart3,
  ClipboardCheck,
  ClipboardList,
  LayoutGrid,
  Package,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/types";

export interface NavItem {
  id: string;
  label: string;
  /** Короткий заголовок для нижней навигации на мобильных. */
  shortLabel: string;
  path: string;
  icon: LucideIcon;
  /** Показывать бейдж со счётчиком (корзина, очередь согласований). */
  badge?: "cart" | "approvals";
}

/** Пункты бокового меню по роли (см. раздел «Роли» концепции). */
export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  customer: [
    {
      id: "catalog",
      label: "Каталог",
      shortLabel: "Каталог",
      path: "/catalog",
      icon: LayoutGrid,
    },
    {
      id: "cart",
      label: "Корзина",
      shortLabel: "Корзина",
      path: "/cart",
      icon: ShoppingCart,
      badge: "cart",
    },
    {
      id: "orders",
      label: "Мои заказы",
      shortLabel: "Заказы",
      path: "/orders",
      icon: ClipboardList,
    },
  ],
  approver: [
    {
      id: "approvals",
      label: "Согласования",
      shortLabel: "Согласования",
      path: "/approvals",
      icon: ClipboardCheck,
      badge: "approvals",
    },
    {
      id: "orders",
      label: "Все заказы",
      shortLabel: "Заказы",
      path: "/orders",
      icon: ClipboardList,
    },
  ],
  admin: [
    {
      id: "admin-catalog",
      label: "Каталог (админ)",
      shortLabel: "Каталог",
      path: "/admin/catalog",
      icon: Package,
    },
    {
      id: "admin-suppliers",
      label: "Поставщики",
      shortLabel: "Поставщики",
      path: "/admin/suppliers",
      icon: Truck,
    },
    {
      id: "admin-limits",
      label: "Лимиты",
      shortLabel: "Лимиты",
      path: "/admin/limits",
      icon: SlidersHorizontal,
    },
    {
      id: "analytics",
      label: "Аналитика",
      shortLabel: "Аналитика",
      path: "/analytics",
      icon: BarChart3,
    },
  ],
  manager: [
    {
      id: "analytics",
      label: "Аналитика",
      shortLabel: "Аналитика",
      path: "/analytics",
      icon: BarChart3,
    },
  ],
};

/**
 * Маршруты, доступные роли без пункта в меню. Администратор ТД
 * и Руководитель проваливаются в список заказов из аналитики
 * («Проверить» в блоке аномалий), но своим разделом он для них не является.
 */
const EXTRA_ALLOWED_PATHS: Record<UserRole, string[]> = {
  customer: [],
  approver: [],
  admin: ["/orders"],
  manager: ["/orders"],
};

/** Доступен ли маршрут текущей роли — используется охраной роутов. */
export function isPathAllowed(role: UserRole, pathname: string): boolean {
  const paths = [
    ...NAV_BY_ROLE[role].map((i) => i.path),
    ...EXTRA_ALLOWED_PATHS[role],
  ];
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
