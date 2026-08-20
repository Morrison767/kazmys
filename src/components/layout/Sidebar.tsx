import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { IconButton } from "@/components/ui";
import { NAV_BY_ROLE, type NavItem } from "@/config/navigation";
import { ROLE_META } from "@/config/roles";
import { cn } from "@/lib/utils";
import { useCartStore, useOrdersStore, useSessionStore } from "@/store";
import { OrderStatus } from "@/types";

/** Счётчик в бейдже пункта меню: корзина и очередь согласований. */
function useBadgeCount(badge: NavItem["badge"]): number {
  const cartCount = useCartStore((s) => s.items.length);
  const pendingCount = useOrdersStore(
    (s) => s.orders.filter((o) => o.status === OrderStatus.PendingApproval).length
  );
  if (badge === "cart") return cartCount;
  if (badge === "approvals") return pendingCount;
  return 0;
}

function SidebarLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  const count = useBadgeCount(item.badge);

  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "flex h-11 items-center rounded-md text-sm transition-colors",
          collapsed ? "mx-auto w-12 justify-center" : "w-full gap-3 px-3",
          isActive
            ? "bg-accent font-semibold text-foreground"
            : "text-foreground hover:bg-muted"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative shrink-0">
            <Icon
              className={cn(
                "h-[18px] w-[18px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              strokeWidth={isActive ? 2 : 1.7}
            />
            {collapsed && count > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-left">{item.label}</span>
              {count > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  );
}

/**
 * Боковое меню для широких экранов (lg+). Состав пунктов зависит от роли
 * (см. config/navigation). Поведение как у донора: сворачивается
 * в icon-rail (284px ↔ 80px). На узких экранах его заменяют нижняя
 * навигация и шит «Ещё».
 */
export function Sidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const role = useSessionStore((s) => s.role);
  const items = NAV_BY_ROLE[role];
  const isCollapsed = collapsed;

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200",
        collapsed ? "w-20" : "w-[284px]"
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-border",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        <Logo compact={isCollapsed} />
        {!collapsed && (
          <IconButton
            icon={ChevronLeft}
            label="Свернуть меню"
            onClick={onToggleCollapsed}
          />
        )}
      </div>

      <div
        className={cn(
          "shrink-0 border-b border-border py-3",
          isCollapsed ? "px-2 text-center" : "px-4"
        )}
      >
        {isCollapsed ? (
          <span className="text-xs font-semibold text-muted-foreground">
            {ROLE_META[role].label.slice(0, 4)}.
          </span>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Режим работы
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
              {ROLE_META[role].label}
            </p>
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <SidebarLink item={item} collapsed={isCollapsed} />
            </li>
          ))}
        </ul>
      </nav>

      {collapsed && (
        <div className="flex h-14 shrink-0 items-center justify-center border-t border-border">
          <IconButton
            icon={ChevronRight}
            label="Развернуть меню"
            onClick={onToggleCollapsed}
          />
        </div>
      )}

      {!isCollapsed && (
        <div className="shrink-0 border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Прототип · Этап 0 · каркас
          </p>
        </div>
      )}
    </aside>
  );
}
