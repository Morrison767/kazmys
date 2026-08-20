import { create } from "zustand";

import { ROLE_META } from "@/config/roles";
import { USERS, defaultUserForRole } from "@/mocks";
import type { User, UserRole } from "@/types";

/**
 * Текущая роль и пользователь. В прототипе роль переключается вручную,
 * пользователи берутся из демо-данных; в проде — HR API по ИИН + SMS-код.
 */
interface SessionState {
  role: UserRole;
  currentUser: User | null;
  /** Доступные в прототипе пользователи — по одному-двум на роль. */
  users: User[];
  setRole: (role: UserRole) => void;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
  /** Стартовый маршрут роли — для редиректов и охраны роутов. */
  homePath: () => string;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  role: "customer",
  currentUser: defaultUserForRole("customer") ?? null,
  users: USERS,

  setRole: (role) =>
    set((state) => ({
      role,
      // Пользователь переключается на первого доступного с этой ролью.
      currentUser:
        state.users.find((u) => u.role === role) ??
        (state.currentUser?.role === role ? state.currentUser : null),
    })),

  setUsers: (users) =>
    set((state) => ({
      users,
      currentUser:
        state.currentUser ?? users.find((u) => u.role === state.role) ?? null,
    })),

  setCurrentUser: (currentUser) =>
    set(() => ({
      currentUser,
      ...(currentUser ? { role: currentUser.role } : {}),
    })),

  homePath: () => ROLE_META[get().role].homePath,
}));
