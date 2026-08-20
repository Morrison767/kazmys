import { create } from "zustand";

/**
 * Тосты — короткие уведомления о результате действия (согласование заказа,
 * передача в ERP). Живут в общем состоянии, чтобы уведомление не пропадало
 * при переходе между страницами.
 */
export type ToastTone = "success" | "info" | "warning" | "danger";

export interface Toast {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
  /** Время автоматического закрытия, мс; 0 — не закрывать. */
  duration: number;
}

interface ToastsState {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id" | "duration"> & { duration?: number }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

let sequence = 0;

export const useToastsStore = create<ToastsState>((set) => ({
  toasts: [],

  push: ({ duration = 5000, ...toast }) => {
    sequence += 1;
    const id = `toast-${sequence}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id, duration }] }));
    if (duration > 0) {
      setTimeout(
        () =>
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          })),
        duration
      );
    }
    return id;
  },

  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  clear: () => set(() => ({ toasts: [] })),
}));
