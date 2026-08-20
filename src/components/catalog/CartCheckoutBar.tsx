import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui";
import { formatMoney } from "@/lib/utils";

/**
 * Мобильная панель оформления: итог и кнопка всегда под рукой, без прокрутки
 * до конца страницы. Прижата к низу области контента, над нижней навигацией.
 * На lg+ не показывается — там кнопка живёт в колонке оформления.
 */
export function CartCheckoutBar({
  lineCount,
  totalWithVat,
  label,
  hint,
  disabled,
  onSubmit,
}: {
  lineCount: number;
  totalWithVat: number;
  label: string;
  hint: string;
  disabled: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="sticky bottom-0 -mx-4 mt-2 border-t border-border bg-card/95 px-4 pb-3 pt-3 backdrop-blur lg:hidden">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          Итого с НДС · {lineCount} поз.
        </span>
        <span className="text-base font-bold tabular-nums text-foreground">
          {formatMoney(totalWithVat)}
        </span>
      </div>
      <Button
        size="lg"
        fullWidth
        className="mt-2"
        icon={CheckCircle2}
        disabled={disabled}
        onClick={onSubmit}
      >
        {label}
      </Button>
      <p className="mt-1.5 text-center text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
