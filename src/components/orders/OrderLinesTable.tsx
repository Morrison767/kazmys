import { Table, type Column } from "@/components/ui";
import { cn, formatMoney } from "@/lib/utils";
import type { OrderLine } from "@/types";

/**
 * Состав заказа: позиции с количеством, ценой на момент оформления и суммой.
 * Используется в карточке согласования и в карточке заказа.
 *
 * На узких экранах таблица заменяется списком карточек-строк: колонки
 * «Цена» и «Сумма» на 375px не читаются, а горизонтальный скролл внутри
 * карточки согласования мешает работе с телефона.
 */
export function OrderLinesTable({
  lines,
  categoryName,
  className,
}: {
  lines: OrderLine[];
  categoryName?: (categoryId: string) => string;
  className?: string;
}) {
  const columns: Column<OrderLine>[] = [
    {
      key: "product",
      header: "Позиция",
      cell: (line) => (
        <div className="min-w-0">
          <p className="text-sm text-foreground">{line.productName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-mono">{line.sku}</span>
            {categoryName ? ` · ${categoryName(line.categoryId)}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Кол-во",
      align: "right",
      cell: (line) => (
        <span className="whitespace-nowrap text-sm text-foreground">
          {line.quantity} {line.unit}
        </span>
      ),
    },
    {
      key: "price",
      header: "Цена",
      align: "right",
      hideOnMobile: true,
      cell: (line) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatMoney(line.price)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Сумма",
      align: "right",
      cell: (line) => (
        <span className="whitespace-nowrap text-sm font-semibold text-foreground">
          {formatMoney(line.lineTotal)}
        </span>
      ),
    },
  ];

  return (
    <>
      {/* Мобильный список */}
      <ul
        className={cn(
          "flex flex-col divide-y divide-border overflow-hidden rounded-xl border border-border sm:hidden",
          className
        )}
      >
        {lines.map((line) => (
          <li key={line.id} className="flex flex-col gap-1 p-3">
            <p className="text-sm text-foreground">{line.productName}</p>
            <p className="text-xs text-muted-foreground">
              <span className="font-mono">{line.sku}</span>
              {categoryName ? ` · ${categoryName(line.categoryId)}` : ""}
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-3">
              <span className="text-xs tabular-nums text-muted-foreground">
                {line.quantity} {line.unit} × {formatMoney(line.price)}
              </span>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {formatMoney(line.lineTotal)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Таблица от sm и шире */}
      <Table
        columns={columns}
        rows={lines}
        rowKey={(line) => line.id}
        compact
        className={cn("hidden sm:block", className)}
      />
    </>
  );
}
