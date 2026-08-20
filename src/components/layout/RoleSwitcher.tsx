import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, UserRound } from "lucide-react";

import { ROLES } from "@/config/roles";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/store";
import type { UserRole } from "@/types";

/**
 * Переключатель роли. В прототипе — ручной выбор без авторизации;
 * в проде роль приходит из HR-системы после входа по ИИН + SMS-код.
 */
export function RoleSwitcher({ onSwitched }: { onSwitched?: () => void }) {
  const role = useSessionStore((s) => s.role);
  const setRole = useSessionStore((s) => s.setRole);
  const currentUser = useSessionStore((s) => s.currentUser);

  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = ROLES.find((r) => r.role === role)!;

  const pick = (next: UserRole) => {
    setRole(next);
    setOpen(false);
    onSwitched?.();
  };

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-10 items-center gap-2 rounded-md px-2 text-sm transition-colors hover:bg-muted",
          open && "bg-muted"
        )}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0463b3] text-xs font-semibold text-primary-foreground">
          {currentUser?.initials ?? <UserRound className="h-4 w-4" />}
        </span>
        <span className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
          <span className="truncate text-sm font-semibold text-foreground">
            {active.label}
          </span>
          <span className="max-w-[180px] truncate text-xs text-muted-foreground">
            {currentUser?.fullName ?? active.description}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-fade-in absolute right-0 top-full z-40 mt-2 w-[300px] overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          <div className="border-b border-border px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Роль в прототипе
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              В проде — авторизация по ИИН через HR API + SMS-код
            </p>
          </div>
          {ROLES.map((r) => {
            const selected = r.role === role;
            return (
              <button
                key={r.role}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => pick(r.role)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors",
                  selected ? "bg-accent" : "hover:bg-muted"
                )}
              >
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-sm",
                      selected
                        ? "font-semibold text-foreground"
                        : "font-medium text-foreground/90"
                    )}
                  >
                    {r.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {r.description}
                  </span>
                </span>
                {selected && (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
