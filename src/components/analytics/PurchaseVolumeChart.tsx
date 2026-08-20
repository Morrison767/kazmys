import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardHeader, Table, type Column } from "@/components/ui";
import {
  AXIS_TICK,
  GRID_COLOR,
  SURFACE_COLOR,
  chartColorAt,
} from "@/config/chart-theme";
import type { MonthlyCategoryVolume } from "@/lib/analytics";
import { formatMoney } from "@/lib/utils";
import type { Category } from "@/types";

/** Компактная подпись оси сумм: 2,4 млн ₸. */
function formatAxisAmount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(".", ",")} млн`;
  }
  if (value >= 1_000) return `${Math.round(value / 1_000)} тыс`;
  return String(value);
}

/**
 * Объём закупок по месяцам с накоплением по категориям.
 * Данные считаются из заказов общего состояния (см. lib/analytics.ts),
 * поэтому новый заказ сразу меняет диаграмму.
 */
export function PurchaseVolumeChart({
  rows,
  categoryIds,
  categories,
}: {
  rows: MonthlyCategoryVolume[];
  categoryIds: string[];
  categories: Category[];
}) {
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;
  const colorOf = (categoryId: string) =>
    chartColorAt(categories.findIndex((c) => c.id === categoryId));

  const hasData = rows.some((row) =>
    categoryIds.some((id) => Number(row[id] ?? 0) > 0)
  );

  // Табличное представление тех же чисел — для точного чтения и доступности.
  const tableColumns: Column<MonthlyCategoryVolume>[] = [
    {
      key: "month",
      header: "Месяц",
      cell: (row) => (
        <span className="text-sm text-foreground">{row.monthLabel}</span>
      ),
    },
    ...categoryIds.map<Column<MonthlyCategoryVolume>>((id) => ({
      key: id,
      header: (
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: colorOf(id) }}
          />
          {categoryName(id)}
        </span>
      ),
      align: "right",
      cell: (row) => (
        <span className="text-sm tabular-nums text-foreground">
          {Number(row[id] ?? 0) > 0 ? formatMoney(Number(row[id])) : "—"}
        </span>
      ),
    })),
    {
      key: "total",
      header: "Итого",
      align: "right",
      cell: (row) => (
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatMoney(
            categoryIds.reduce((sum, id) => sum + Number(row[id] ?? 0), 0)
          )}
        </span>
      ),
    },
  ];

  return (
    <Card className="flex flex-col gap-4">
      <CardHeader
        title="Объём закупок по категориям"
        description="Суммы заказов без НДС по месяцам. Отклонённые заказы и черновики не учитываются."
      />

      {hasData ? (
        <>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rows}
                margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                barCategoryGap="28%"
              >
                <CartesianGrid
                  vertical={false}
                  stroke={GRID_COLOR}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="monthLabel"
                  tick={AXIS_TICK}
                  stroke={GRID_COLOR}
                  tickLine={false}
                />
                <YAxis
                  tick={AXIS_TICK}
                  stroke={GRID_COLOR}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatAxisAmount}
                  width={64}
                />
                <Tooltip
                  cursor={{ fill: GRID_COLOR, fillOpacity: 0.35 }}
                  formatter={(value, name) => [
                    formatMoney(Number(value ?? 0)),
                    String(name ?? ""),
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: `1px solid ${GRID_COLOR}`,
                    fontSize: 12,
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                />
                {categoryIds.map((categoryId, index) => (
                  <Bar
                    key={categoryId}
                    dataKey={categoryId}
                    name={categoryName(categoryId)}
                    stackId="volume"
                    fill={colorOf(categoryId)}
                    /* Зазор в цвет поверхности разделяет сегменты стека. */
                    stroke={SURFACE_COLOR}
                    strokeWidth={2}
                    radius={
                      index === categoryIds.length - 1 ? [4, 4, 0, 0] : undefined
                    }
                    maxBarSize={72}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Table
            columns={tableColumns}
            rows={rows}
            rowKey={(row) => String(row.monthKey)}
            compact
          />
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          За выбранные месяцы закупок нет.
        </p>
      )}
    </Card>
  );
}
