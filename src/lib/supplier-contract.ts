import type { ContractStatus, Supplier } from "@/types";

/**
 * Состояние рамочного договора поставщика. Статус считается от срока
 * действия, а не берётся из данных как есть: договор мог истечь просто
 * потому, что прошло время. Черновик и приостановленный договор
 * не переопределяются — это решения Торгового Дома, а не срок.
 */

/** Договор считается истекающим за столько дней до окончания. */
export const EXPIRING_WINDOW_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface ContractState {
  status: ContractStatus;
  /** Дней до окончания (отрицательное — договор истёк). */
  daysLeft: number;
  /** Порядок сортировки: истёкшие и истекающие — наверх. */
  sortWeight: number;
}

export function contractStateOf(supplier: Supplier, today: Date): ContractState {
  const end = new Date(supplier.contractDateTo).getTime();
  const start = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  ).getTime();
  const daysLeft = Math.ceil((end - start) / DAY_MS);

  // Проект и приостановка — управленческие статусы, срок их не меняет.
  if (supplier.contractStatus === "draft" || supplier.contractStatus === "suspended") {
    return {
      status: supplier.contractStatus,
      daysLeft,
      sortWeight: supplier.contractStatus === "suspended" ? 1 : 3,
    };
  }

  if (daysLeft < 0) return { status: "expired", daysLeft, sortWeight: 0 };
  if (daysLeft <= EXPIRING_WINDOW_DAYS) {
    return { status: "expiring", daysLeft, sortWeight: 1 };
  }
  return { status: "active", daysLeft, sortWeight: 2 };
}

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  active: "Действует",
  expiring: "Истекает",
  expired: "Истёк",
  suspended: "Приостановлен",
  draft: "Проект",
};

export const CONTRACT_STATUS_TONE: Record<
  ContractStatus,
  "success" | "warning" | "danger" | "neutral" | "info"
> = {
  active: "success",
  expiring: "warning",
  expired: "danger",
  suspended: "neutral",
  draft: "info",
};

/** Поставщики с истекающими и истёкшими договорами — наверх списка. */
export function sortSuppliersByRisk(
  suppliers: Supplier[],
  today: Date
): Array<{ supplier: Supplier; state: ContractState }> {
  return suppliers
    .map((supplier) => ({ supplier, state: contractStateOf(supplier, today) }))
    .sort(
      (a, b) =>
        a.state.sortWeight - b.state.sortWeight ||
        a.state.daysLeft - b.state.daysLeft
    );
}
