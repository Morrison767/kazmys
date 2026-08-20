import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { RoleRoute } from "@/components/layout/RoleRoute";
import { PageSkeleton } from "@/components/ui";
import { ROLE_META } from "@/config/roles";
import ApprovalsPage from "@/pages/ApprovalsPage";
import CartPage from "@/pages/CartPage";
import CatalogPage from "@/pages/CatalogPage";
import NotFoundPage from "@/pages/NotFoundPage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import OrdersPage from "@/pages/OrdersPage";
import { useSessionStore } from "@/store";

/**
 * Разделы Торгового Дома грузятся отдельным чанком: аналитика тянет
 * библиотеку графиков, а на телефоне (каталог, корзина, согласования)
 * она не нужна. Пока чанк загружается, показывается скелетон.
 */
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const AdminCatalogPage = lazy(() => import("@/pages/admin/AdminCatalogPage"));
const AdminLimitsPage = lazy(() => import("@/pages/admin/AdminLimitsPage"));
const AdminSuppliersPage = lazy(() => import("@/pages/admin/AdminSuppliersPage"));

/** Редирект с корня на стартовый экран текущей роли. */
function RoleHomeRedirect() {
  const role = useSessionStore((s) => s.role);
  return <Navigate to={ROLE_META[role].homePath} replace />;
}

/** Ленивый раздел под охраной роли, со скелетоном на время загрузки. */
function LazyRoleRoute({
  children,
  tiles = 0,
  blocks = 2,
}: {
  children: React.ReactNode;
  tiles?: number;
  blocks?: number;
}) {
  return (
    <RoleRoute>
      <Suspense fallback={<PageSkeleton tiles={tiles} blocks={blocks} />}>
        {children}
      </Suspense>
    </RoleRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<RoleHomeRedirect />} />

        {/* Заказчик */}
        <Route
          path="/catalog"
          element={
            <RoleRoute>
              <CatalogPage />
            </RoleRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <RoleRoute>
              <CartPage />
            </RoleRoute>
          }
        />

        {/* Заказчик («Мои заказы») и Согласующий («Все заказы») */}
        <Route
          path="/orders"
          element={
            <RoleRoute>
              <OrdersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <RoleRoute>
              <OrderDetailPage />
            </RoleRoute>
          }
        />

        {/* Согласующий */}
        <Route
          path="/approvals"
          element={
            <RoleRoute>
              <ApprovalsPage />
            </RoleRoute>
          }
        />

        {/* Администратор ТД */}
        <Route
          path="/admin/catalog"
          element={
            <LazyRoleRoute blocks={2}>
              <AdminCatalogPage />
            </LazyRoleRoute>
          }
        />
        <Route
          path="/admin/suppliers"
          element={
            <LazyRoleRoute blocks={1}>
              <AdminSuppliersPage />
            </LazyRoleRoute>
          }
        />
        <Route
          path="/admin/limits"
          element={
            <LazyRoleRoute blocks={1}>
              <AdminLimitsPage />
            </LazyRoleRoute>
          }
        />

        {/* Администратор ТД и Руководитель */}
        <Route
          path="/analytics"
          element={
            <LazyRoleRoute tiles={4} blocks={2}>
              <AnalyticsPage />
            </LazyRoleRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
