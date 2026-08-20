import { NavLink } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";

import { NAV_BY_ROLE } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useCartStore, useOrdersStore, useSessionStore } from "@/store";
import { OrderStatus } from "@/types";

/** Сколько разделов помещается на панели; последний слот — «Ещё». */
const PRIMARY_SLOTS = 3;

/**
 * Нижняя навигация для узких экранов. Структура единая для всех ролей:
 * до трёх основных разделов роли плюс «Ещё» (профиль, смена роли и все
 * остальные разделы). У Заказчика это ровно Каталог · Корзина · Заказы · Ещё.
 *
 * Показываются только разделы, доступные текущей роли, — иначе тап уводил бы
 * на редирект охраны маршрутов (см. config/navigation.ts).
 */
export function MobileNav({ onOpenMore }: { onOpenMore: () => void }) {
  const role = useSessionStore((s) => s.role);
  const items = NAV_BY_ROLE[role].slice(0, PRIMARY_SLOTS);
  const cartCount = useCartStore((s) => s.items.length);
  const pendingCount = useOrdersStore(
    (s) => s.orders.filter((o) => o.status === OrderStatus.PendingApproval).length
  );

  return (
    <nav
      aria-label="Основная навигация"
      className="shrink-0 border-t border-border bg-card lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul
        className="grid"
        style={{ gridTemplateColumns: `repeat(${items.length + 1}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const count =
            item.badge === "cart"
              ? cartCount
              : item.badge === "approvals"
                ? pendingCount
                : 0;
          return (
            <li key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex h-16 flex-col items-center justify-center gap-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      <Icon
                        className="h-[22px] w-[22px]"
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      {count > 0 && (
                        <span className="absolute -right-2.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                          {count}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "max-w-full truncate px-1 text-xs leading-none",
                        isActive && "font-semibold"
                      )}
                    >
                      {item.shortLabel}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            onClick={onOpenMore}
            aria-label="Меню и профиль"
            className="flex h-16 w-full flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <MoreHorizontal className="h-[22px] w-[22px]" strokeWidth={1.8} />
            <span className="text-xs leading-none">Ещё</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
