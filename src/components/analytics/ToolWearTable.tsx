import { Badge, Card, CardHeader, Table, type Column } from "@/components/ui";
import { OVERCONSUMPTION_RATIO, type ToolWearRow } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Ходимость инструмента: фактический интервал между перезаказами против
 * нормативного срока службы. Интервалы считаются по датам архива
 * перезаказов, не берутся готовыми.
 */
export function ToolWearTable({ rows }: { rows: ToolWearRow[] }) {
  const columns: Column<ToolWearRow>[] = [
    {
      key: "product",
      header: "Позиция",
      cell: (row) => (
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm",
              row.isOverconsumption
                ? "font-semibold text-danger-foreground"
                : "text-foreground"
            )}
          >
            {row.productName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            перезаказов: {row.reorderCount}
          </p>
        </div>
      ),
    },
    {
      key: "workshop",
      header: "Цех / участок",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{row.workshopName}</span>
      ),
    },
    {
      key: "interval",
      header: "Средний интервал",
      align: "right",
      cell: (row) => (
        <span
          className={cn(
            "whitespace-nowrap text-sm font-semibold tabular-nums",
            row.isOverconsumption ? "text-danger-foreground" : "text-foreground"
          )}
        >
          {row.avgIntervalDays} дн.
        </span>
      ),
    },
    {
      key: "norm",
      header: "Норматив",
      align: "right",
      cell: (row) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
          {row.serviceLifeDays} дн.
        </span>
      ),
    },
    {
      key: "deviation",
      header: "Отклонение",
      align: "right",
      cell: (row) => (
        <Badge tone={row.isOverconsumption ? "danger" : row.deviationDays < 0 ? "warning" : "success"}>
          {row.deviationDays > 0 ? "+" : ""}
          {row.deviationDays} дн. · {row.ratioPercent}% нормы
        </Badge>
      ),
    },
    {
      key: "signal",
      header: "Сигнал",
      cell: (row) =>
        row.isOverconsumption ? (
          <span className="text-xs font-semibold text-danger-foreground">
            Возможный перерасход
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">В пределах нормы</span>
        ),
    },
  ];

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="Срок жизни инструмента"
        description={`Красным выделены позиции, которые перезаказываются чаще ${Math.round(
          OVERCONSUMPTION_RATIO * 100
        )}% нормативного срока службы — сигнал возможного перерасхода.`}
      />
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Повторных заказов инструмента пока нет.
        </p>
      ) : (
        <Table
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          compact
          rowClassName={(row) =>
            row.isOverconsumption ? "bg-danger-soft/60" : undefined
          }
        />
      )}
    </Card>
  );
}
