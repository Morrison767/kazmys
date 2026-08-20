import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { MobileNav } from "@/components/layout/MobileNav";
import { MoreSheet } from "@/components/layout/MoreSheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { ToastViewport } from "@/components/ui";

/**
 * Каркас приложения (паттерн донора): сайдбар слева на всю высоту,
 * справа колонка «шапка + прокручиваемый main».
 *
 * На ширинах < lg сайдбар и переключатель роли в шапке скрываются:
 * навигация переходит в нижнюю панель, а профиль, смена роли и остальные
 * разделы — в шит «Ещё».
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  // Переход по маршруту закрывает мобильное меню.
  useEffect(() => setMoreOpen(false), [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onOpenMore={() => setMoreOpen(true)} />

        <main className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-content">
            <Outlet />
          </div>
        </main>

        <MobileNav onOpenMore={() => setMoreOpen(true)} />
      </div>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
      <ToastViewport />
    </div>
  );
}
