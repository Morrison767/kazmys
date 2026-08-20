import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Редактируемое числовое поле лимита: сохранение по Enter и по потере
 * фокуса, Escape — откат к исходному значению. Отдельный компонент, чтобы
 * правки в таблице не перерисовывали её целиком на каждый ввод.
 */
export function LimitAmountInput({
  value,
  onSave,
  ariaLabel,
  disabled = false,
}: {
  value: number;
  onSave: (next: number) => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState(String(value));
  const [dirty, setDirty] = useState(false);

  // Значение могло измениться извне (например, другим администратором).
  useEffect(() => {
    if (!dirty) setDraft(String(value));
  }, [value, dirty]);

  const commit = () => {
    const parsed = Number.parseInt(draft.replace(/\s/g, ""), 10);
    setDirty(false);
    if (Number.isNaN(parsed) || parsed < 0) {
      setDraft(String(value));
      return;
    }
    setDraft(String(parsed));
    if (parsed !== value) onSave(parsed);
  };

  return (
    <input
      type="number"
      min={0}
      step={10000}
      inputMode="numeric"
      aria-label={ariaLabel}
      value={draft}
      disabled={disabled}
      onChange={(e) => {
        setDraft(e.target.value);
        setDirty(true);
      }}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          setDraft(String(value));
          setDirty(false);
          e.currentTarget.blur();
        }
      }}
      className={cn(
        "h-9 w-full min-w-[120px] rounded-md border bg-card px-2 text-right text-sm tabular-nums text-foreground outline-none transition-colors",
        "focus:border-primary focus:ring-2 focus:ring-primary/20",
        dirty ? "border-primary" : "border-border",
        disabled && "cursor-not-allowed bg-muted text-muted-foreground"
      )}
    />
  );
}
