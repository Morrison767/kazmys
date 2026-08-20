import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardHeader, Table, type Column } from "@/components/ui";
import { CHART_COLORS, GRID_COLOR } from "@/config/chart-theme";
import type { TopProductRow } from "@/lib/analytics";
import { formatMoney } from "@/lib/utils";
import type { Category } from "@/types";

/** Спарклайн количества по месяцам — тренд без осей и подписей. */
function Sparkline({ row }: { row: TopProductRow }) {
  const hasVariation = row.trend.some((point) => point.quantity > 0);
  if (!hasVariation) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <div className="h-9 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={row.trend}
          margin={{ top: 6, right: 4, bottom: 6, left: 4 }}
        >
          <Tooltip
            formatter={(value) => [`${Number(value ?? 0)} ${row.unit}`, "Заказано"]}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.monthLabel ?? ""
            }
            contentStyle={{
              borderRadius: 12,
              border: `1px solid ${GRID_COLOR}`,
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            dot={{ r: 2.5, strokeWidth: 0, fill: CHART_COLORS[0] }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Топ популярных позиций: по числу заказов, с суммарным количеством,
 * суммой и трендом по месяцам. Считается по заказам общего состояния.
 */
export function TopProductsWidget({
  rows,
  categories,
}: {
  rows: TopProductRow[];
  categories: Category[];
}) {
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const columns: Column<TopProductRow>[] = [
    {
      key: "rank",
      header: "№",
      align: "right",
      width: "48px",
      cell: (_row, index) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {index + 1}
        </span>
      ),
    },
    {
      key: "product",
      header: "Позиция",
      cell: (row) => (
        <div className="min-w-0">
          <p className="text-sm text-foreground">{row.productName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-mono">{row.sku}</span> ·{" "}
            {categoryName(row.categoryId)}
          </p>
        </div>
      ),
    },
    {
      key: "orders",
      header: "Заказов",
      align: "right",
      cell: (row) => (
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {row.ordersCount}
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Количество",
      align: "right",
      cell: (row) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-foreground">
          {row.quantity} {row.unit}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Сумма",
      align: "right",
      hideOnMobile: true,
      cell: (row) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-foreground">
          {formatMoney(row.amount)}
        </span>
      ),
    },
    {
      key: "trend",
      header: "Тренд по месяцам",
      align: "right",
      cell: (row) => (
        <div className="flex justify-end">
          <Sparkline row={row} />
        </div>
      ),
    },
  ];

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="Топ популярных позиций"
        description="Ранжирование по числу заказов за период; тренд — количество единиц по месяцам."
      />
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Заказов за период нет.
        </p>
      ) : (
        <Table columns={columns} rows={rows} rowKey={(row) => row.productId} compact />
      )}
    </Card>
  );
}
