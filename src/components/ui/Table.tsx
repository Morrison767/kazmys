import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** Значение ячейки. */
  cell: (row: T, index: number) => ReactNode;
  /** Выравнивание: числовые колонки — вправо. */
  align?: "left" | "right" | "center";
  /** Скрыть колонку на узких экранах (второстепенные данные). */
  hideOnMobile?: boolean;
  width?: string;
  className?: string;
}

/**
 * Таблица в визуальном языке донора: тонкие разделители divide-border,
 * шапка text-xs uppercase text-muted-foreground, скругление на контейнере,
 * горизонтальный скролл внутри своей рамки.
 */
export function Table<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = "Нет данных",
  className,
  compact = false,
  rowClassName,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: ReactNode;
  className?: string;
  compact?: boolean;
  /** Подсветка строки — например, сигнал перерасхода в аналитике. */
  rowClassName?: (row: T, index: number) => string | undefined;
}) {
  const pad = compact ? "px-3 py-2" : "px-4 py-3";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={cn(
                    pad,
                    "whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    c.align === "right"
                      ? "text-right"
                      : c.align === "center"
                        ? "text-center"
                        : "text-left",
                    c.hideOnMobile && "hidden md:table-cell"
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={cn(pad, "text-center text-sm text-muted-foreground")}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/40",
                    rowClassName?.(row, i)
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        pad,
                        "align-middle text-foreground",
                        c.align === "right"
                          ? "text-right tabular-nums"
                          : c.align === "center"
                            ? "text-center"
                            : "text-left",
                        c.hideOnMobile && "hidden md:table-cell",
                        c.className
                      )}
                    >
                      {c.cell(row, i)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Список «ключ — значение» (паттерн донора вместо мелких таблиц):
 * dl с divide-y внутри скруглённой рамки. Для карточек заказа, поставщика.
 */
export function DefinitionList({
  rows,
  className,
}: {
  rows: Array<{ label: ReactNode; value: ReactNode }>;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "flex flex-col divide-y divide-border rounded-xl border border-border",
        className
      )}
    >
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-3 px-3 py-2.5"
        >
          <dt className="text-xs text-muted-foreground">{r.label}</dt>
          <dd className="max-w-[60%] text-right text-xs font-medium text-foreground">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
