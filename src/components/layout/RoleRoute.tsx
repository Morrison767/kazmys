import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { isPathAllowed } from "@/config/navigation";
import { ROLE_META } from "@/config/roles";
import { useSessionStore } from "@/store";

/**
 * Охрана маршрута по роли. В прототипе роль переключается вручную, поэтому
 * при смене роли пользователь мягко переносится на стартовый экран новой роли,
 * если текущий раздел ей недоступен. В проде роль придёт из HR-системы.
 */
export function RoleRoute({ children }: { children: ReactNode }) {
  const role = useSessionStore((s) => s.role);
  const { pathname } = useLocation();

  if (!isPathAllowed(role, pathname)) {
    return <Navigate to={ROLE_META[role].homePath} replace />;
  }

  return <>{children}</>;
}
