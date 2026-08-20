import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useToastsStore, type ToastTone } from "@/store/toasts";

const TONE: Record<ToastTone, { icon: LucideIcon; box: string; text: string }> = {
  success: {
    icon: CheckCircle2,
    box: "border-success-border bg-success-soft",
    text: "text-success-foreground",
  },
  info: {
    icon: Info,
    box: "border-info-border bg-info-soft",
    text: "text-info-foreground",
  },
  warning: {
    icon: AlertTriangle,
    box: "border-warning-border bg-warning-soft",
    text: "text-warning-foreground",
  },
  danger: {
    icon: ShieldAlert,
    box: "border-danger-border bg-danger-soft",
    text: "text-danger-foreground",
  },
};

/**
 * Область показа уведомлений. Снизу справа на десктопе, сверху на мобильных
 * (снизу мешала бы нижней навигации).
 */
export function ToastViewport() {
  const toasts = useToastsStore((s) => s.toasts);
  const dismiss = useToastsStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed z-50 flex flex-col gap-2",
        "left-4 right-4 top-4 sm:left-auto sm:right-6 sm:top-auto sm:bottom-6 sm:w-[380px]"
      )}
    >
      {toasts.map((toast) => {
        const tone = TONE[toast.tone];
        const Icon = tone.icon;
        return (
          <div
            key={toast.id}
            className={cn(
              "animate-fade-in pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg",
              tone.box
            )}
          >
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", tone.text)} />
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-bold", tone.text)}>{toast.title}</p>
              {toast.description && (
                <p className={cn("mt-0.5 text-xs", tone.text)}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Закрыть уведомление"
              onClick={() => dismiss(toast.id)}
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors hover:bg-foreground/5",
                tone.text
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
