import { Bell, Search, UserRound } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { RoleSwitcher } from "@/components/layout/RoleSwitcher";
import { IconButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ROLE_META } from "@/config/roles";
import { useSessionStore } from "@/store";

/**
 * Шапка приложения. Высота h-16 — как у донора.
 *
 * На узких экранах шапка компактная: знак продукта и короткое название,
 * справа — кнопка профиля, открывающая шит «Ещё» (там же смена роли).
 * Полный переключатель роли показывается с ширины lg, где есть место.
 */
export function TopHeader({
  onOpenMore,
  className,
}: {
  onOpenMore: () => void;
  className?: string;
}) {
  const role = useSessionStore((s) => s.role);
  const user = useSessionStore((s) => s.currentUser);

  return (
    <header
      className={cn(
        "flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Знак продукта нужен на мобильном: сайдбара с логотипом там нет. */}
        <span className="lg:hidden">
          <Logo compact />
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold tracking-tight text-foreground sm:text-base">
            МП Торгового Дома
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            Закупка неосновных материалов · ТОО «Корпорация Казахмыс»
          </p>
          <p className="truncate text-xs text-muted-foreground sm:hidden">
            {ROLE_META[role].label}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <IconButton
          icon={Search}
          label="Поиск по каталогу"
          className="hidden sm:flex"
        />
        <IconButton icon={Bell} label="Уведомления" className="hidden sm:flex" />

        {/* Мобильный вход в профиль и смену роли */}
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="Профиль и смена роли"
          className="flex h-10 items-center gap-2 rounded-md px-1.5 transition-colors hover:bg-muted lg:hidden"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0463b3] text-xs font-semibold text-primary-foreground">
            {user?.initials ?? <UserRound className="h-4 w-4" />}
          </span>
        </button>

        <span className="hidden lg:block">
          <RoleSwitcher />
        </span>
      </div>
    </header>
  );
}
