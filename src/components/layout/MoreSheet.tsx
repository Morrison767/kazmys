import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Check, LogIn, X } from "lucide-react";

import { Badge, IconButton } from "@/components/ui";
import { NAV_BY_ROLE } from "@/config/navigation";
import { ROLES, ROLE_META } from "@/config/roles";
import { cn } from "@/lib/utils";
import { useCatalogStore, useSessionStore } from "@/store";

/**
 * Мобильное меню «Ещё»: карточка пользователя, переключатель роли и все
 * разделы текущей роли. Заменяет боковое меню на узких экранах — на них
 * шапка компактная, а переключатель роли живёт здесь.
 */
export function MoreSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const role = useSessionStore((s) => s.role);
  const user = useSessionStore((s) => s.currentUser);
  const setRole = useSessionStore((s) => s.setRole);
  const workshops = useCatalogStore((s) => s.workshops);
  const enterprises = useCatalogStore((s) => s.enterprises);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const workshop = workshops.find((w) => w.id === user?.workshopId);
  const enterprise = enterprises.find((e) => e.id === user?.enterpriseId);
  const items = NAV_BY_ROLE[role];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-foreground/40 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Меню и профиль"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Профиль */}
        <div className="flex items-start gap-3 border-b border-border p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0463b3] text-sm font-semibold text-primary-foreground">
            {user?.initials ?? <LogIn className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-foreground">
              {user?.fullName ?? "Пользователь не выбран"}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {user?.position ?? ROLE_META[role].description}
            </p>
            {workshop && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {workshop.name}
                {enterprise ? ` · ${enterprise.shortName}` : ""}
              </p>
            )}
          </div>
          <IconButton icon={X} label="Закрыть меню" onClick={onClose} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Разделы текущей роли */}
          <div className="border-b border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Разделы · {ROLE_META[role].label}
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "flex h-12 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                          isActive
                            ? "bg-accent font-semibold text-foreground"
                            : "text-foreground hover:bg-muted"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={cn(
                              "h-[18px] w-[18px] shrink-0",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                          <span className="flex-1 truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Переключатель роли */}
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Роль в прототипе
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              В проде — авторизация по ИИН через HR API + SMS-код
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              {ROLES.map((meta) => {
                const selected = meta.role === role;
                return (
                  <li key={meta.role}>
                    <button
                      type="button"
                      onClick={() => {
                        setRole(meta.role);
                        onClose();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                        selected ? "bg-accent" : "hover:bg-muted"
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-sm",
                            selected
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground"
                          )}
                        >
                          {meta.label}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {meta.description}
                        </span>
                      </span>
                      {selected ? (
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <Badge tone="neutral" outline>
                          выбрать
                        </Badge>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
