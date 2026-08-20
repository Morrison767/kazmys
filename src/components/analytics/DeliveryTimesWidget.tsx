import { useState } from "react";

import { Badge, Card, CardHeader, Table, type Column } from "@/components/ui";
import type { DeliveryRow } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Сроки поставки: среднее время «Согласован» → «Получен» с отклонением
 * от нормативного срока по рамочному договору поставщика.
 */
export function DeliveryTimesWidget({
  byCategory,
  bySupplier,
}: {
  byCategory: DeliveryRow[];
  bySupplier: DeliveryRow[];
}) {
  const [mode, setMode] = useState<"category" | "supplier">("category");
  const rows = mode === "category" ? byCategory : bySupplier;

  const columns: Column<DeliveryRow>[] = [
    {
      key: "label",
      header: mode === "category" ? "Категория" : "Поставщик",
      cell: (row) => <span className="text-sm text-foreground">{row.label}</span>,
    },
    {
      key: "avg",
      header: "Факт, дней",
      align: "right",
      cell: (row) => (
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {row.avgDays}
        </span>
      ),
    },
    {
      key: "target",
      header: "Норматив, дней",
      align: "right",
      cell: (row) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {row.targetDays ?? "—"}
        </span>
      ),
    },
    {
      key: "deviation",
      header: "Отклонение",
      align: "right",
      cell: (row) =>
        row.deviationDays === null ? (
          <span className="text-sm text-muted-foreground">—</span>
        ) : (
          <Badge tone={row.deviationDays > 0 ? "danger" : "success"}>
            {row.deviationDays > 0 ? "+" : ""}
            {row.deviationDays} дн.
          </Badge>
        ),
    },
    {
      key: "count",
      header: "Поставок",
      align: "right",
      cell: (row) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {row.ordersCount}
        </span>
      ),
    },
  ];

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="Сроки поставки"
        description="Считается по заказам, дошедшим до получения: от согласования до подтверждения получения на предприятии."
        actions={
          <div className="flex rounded-md border border-border p-0.5">
            {(
              [
                ["category", "По категориям"],
                ["supplier", "По поставщикам"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={cn(
                  "h-8 rounded px-3 text-xs font-semibold transition-colors",
                  mode === value
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Завершённых поставок пока нет — срок рассчитать не по чему.
        </p>
      ) : (
        <Table
          columns={columns}
          rows={rows}
          rowKey={(row) => row.key}
          compact
        />
      )}
    </Card>
  );
}
