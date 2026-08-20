import { create } from "zustand";

import { LIMITS, PRODUCT_QUOTAS } from "@/mocks";
import type { Limit, LimitPeriod, ProductQuota } from "@/types";

/**
 * Лимиты цехов по категориям и нормы расхода по позициям.
 * Настраиваются администратором ТД (экран «Лимиты»).
 */
interface LimitsState {
  limits: Limit[];
  quotas: ProductQuota[];
  setLimits: (limits: Limit[]) => void;
  setQuotas: (quotas: ProductQuota[]) => void;
  upsertLimit: (limit: Limit) => void;
  /**
   * Правка лимита администратором ТД. Меняется тот же объект Limit, который
   * проверяется при оформлении заказа (Этап 2) и показывается согласующему
   * (Этап 3), поэтому изменения видны сразу во всём приложении.
   */
  updateLimit: (
    limitId: string,
    patch: Partial<
      Pick<
        Limit,
        | "amountLimit"
        | "autoApprovalThreshold"
        | "escalationThreshold"
        | "quantityLimit"
        | "isActive"
      >
    >,
    meta?: { updatedBy?: string; updatedAt?: string }
  ) => void;
  /**
   * Зачесть оформленный заказ в факт использования лимита.
   * Заказ на согласовании уже резервирует лимит цеха — иначе за время
   * согласования можно оформить ещё несколько заказов на ту же сумму.
   */
  registerUsage: (
    entries: Array<{
      workshopId: string;
      categoryId: string;
      amount: number;
      quantity: number;
    }>
  ) => void;
  /** Лимит цеха по категории на период. */
  find: (
    workshopId: string,
    categoryId: string,
    period?: LimitPeriod
  ) => Limit | undefined;
  byWorkshop: (workshopId: string) => Limit[];
  /** Доля использования лимита, % — для ProgressBar на экранах лимитов. */
  usedPercent: (limitId: string) => number;
}

export const useLimitsStore = create<LimitsState>((set, get) => ({
  limits: LIMITS,
  quotas: PRODUCT_QUOTAS,

  setLimits: (limits) => set(() => ({ limits })),
  setQuotas: (quotas) => set(() => ({ quotas })),

  upsertLimit: (limit) =>
    set((state) => ({
      limits: state.limits.some((l) => l.id === limit.id)
        ? state.limits.map((l) => (l.id === limit.id ? limit : l))
        : [...state.limits, limit],
    })),

  updateLimit: (limitId, patch, meta) =>
    set((state) => ({
      limits: state.limits.map((limit) =>
        limit.id === limitId
          ? {
              ...limit,
              ...patch,
              updatedAt: meta?.updatedAt ?? new Date().toISOString(),
              ...(meta?.updatedBy ? { updatedBy: meta.updatedBy } : {}),
            }
          : limit
      ),
    })),

  registerUsage: (entries) =>
    set((state) => ({
      limits: state.limits.map((limit) => {
        const entry = entries.find(
          (e) =>
            e.workshopId === limit.workshopId && e.categoryId === limit.categoryId
        );
        if (!entry) return limit;
        return {
          ...limit,
          amountUsed: limit.amountUsed + entry.amount,
          quantityUsed: limit.quantityUsed + entry.quantity,
        };
      }),
    })),

  find: (workshopId, categoryId, period) =>
    get().limits.find(
      (l) =>
        l.workshopId === workshopId &&
        l.categoryId === categoryId &&
        (!period || l.period === period)
    ),

  byWorkshop: (workshopId) =>
    get().limits.filter((l) => l.workshopId === workshopId),

  usedPercent: (limitId) => {
    const limit = get().limits.find((l) => l.id === limitId);
    if (!limit || limit.amountLimit <= 0) return 0;
    return Math.round((limit.amountUsed / limit.amountLimit) * 100);
  },
}));
