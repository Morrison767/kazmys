import { useMemo, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";

import { LimitAmountInput } from "@/components/admin/LimitAmountInput";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ProgressBar,
  Table,
  type Column,
} from "@/components/ui";
import { buildLimitDraft } from "@/lib/admin-drafts";
import { limitTone, usedPercent } from "@/lib/cart-limits";
import { formatDateTime, formatMoney } from "@/lib/utils";
import {
  useCatalogStore,
  useLimitsStore,
  useSessionStore,
  useToastsStore,
} from "@/store";
import type { Category, Limit, LimitPeriod, Workshop } from "@/types";

/** Порог «близко к исчерпанию» — тот же, что и в каталоге заказчика. */
const AT_RISK_PERCENT = 80;

const PERIOD_LABEL: Record<LimitPeriod, string> = {
  month: "месяц",
  quarter: "квартал",
  year: "год",
};

interface LimitRow {
  workshop: Workshop;
  category: Category;
  limit?: Limit;
  percent: number;
}

export default function AdminLimitsPage() {
  const workshops = useCatalogStore((s) => s.workshops);
  const categories = useCatalogStore((s) => s.categories);
  const enterprises = useCatalogStore((s) => s.enterprises);
  const limits = useLimitsStore((s) => s.limits);
  const updateLimit = useLimitsStore((s) => s.updateLimit);
  const upsertLimit = useLimitsStore((s) => s.upsertLimit);
  const admin = useSessionStore((s) => s.currentUser);
  const pushToast = useToastsStore((s) => s.push);

  const [onlyAtRisk, setOnlyAtRisk] = useState(false);

  const enterpriseName = (id: string) =>
    enterprises.find((e) => e.id === id)?.shortName ?? id;

  /**
   * Строки таблицы — пары «цех × доступная категория» строго по матрице
   * доступа: закрыли категорию цеху в /admin/catalog — пара исчезает отсюда.
   */
  const rows = useMemo<LimitRow[]>(() => {
    const result: LimitRow[] = [];
    for (const workshop of workshops) {
      for (const categoryId of workshop.allowedCategoryIds) {
        const category = categories.find((c) => c.id === categoryId);
        if (!category || !category.isActive) continue;
        const limit = limits.find(
          (l) => l.workshopId === workshop.id && l.categoryId === categoryId
        );
        result.push({
          workshop,
          category,
          limit,
          percent: limit ? usedPercent(limit.amountUsed, limit.amountLimit) : 0,
        });
      }
    }
    return result.sort(
      (a, b) =>
        b.percent - a.percent ||
        a.workshop.name.localeCompare(b.workshop.name)
    );
  }, [workshops, categories, limits]);

  const visibleRows = onlyAtRisk
    ? rows.filter((r) => r.limit && r.percent > AT_RISK_PERCENT)
    : rows;

  const atRiskCount = rows.filter(
    (r) => r.limit && r.percent > AT_RISK_PERCENT
  ).length;
  const missingCount = rows.filter((r) => !r.limit).length;

  const saveField = (
    row: LimitRow,
    field: "amountLimit" | "autoApprovalThreshold",
    next: number
  ) => {
    if (!row.limit) return;
    updateLimit(
      row.limit.id,
      { [field]: next },
      { updatedBy: admin?.fullName }
    );
    pushToast({
      tone: "success",
      title:
        field === "amountLimit"
          ? "Лимит по сумме обновлён"
          : "Порог авто-одобрения обновлён",
      description: `${row.workshop.name} · ${row.category.name}: ${formatMoney(next)}. Действует при оформлении и согласовании заказов.`,
      duration: 4000,
    });
  };

  /** Категория открыта цеху, но лимит не настроен — создаём заготовку. */
  const createLimit = (row: LimitRow) => {
    const draft = buildLimitDraft({
      workshopId: row.workshop.id,
      categoryId: row.category.id,
      amountLimit: 1000000,
      autoApprovalThreshold: 150000,
      updatedBy: admin?.fullName,
      today: new Date(),
    });
    upsertLimit(draft);
    pushToast({
      tone: "success",
      title: "Лимит создан",
      description: `${row.workshop.name} · ${row.category.name}: ${formatMoney(
        draft.amountLimit
      )} на месяц, порог ${formatMoney(draft.autoApprovalThreshold)}. Отредактируйте значения в таблице.`,
    });
  };

  const columns: Column<LimitRow>[] = [
    {
      key: "workshop",
      header: "Цех / участок",
      cell: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {row.workshop.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {enterpriseName(row.workshop.enterpriseId)}
            {row.workshop.costCenter ? ` · ${row.workshop.costCenter}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Категория",
      cell: (row) => (
        <div className="min-w-0">
          <Badge tone="neutral" outline>
            {row.category.name}
          </Badge>
          {row.limit && (
            <p className="mt-1 text-xs text-muted-foreground">
              период: {PERIOD_LABEL[row.limit.period]}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "amountLimit",
      header: "Лимит по сумме",
      align: "right",
      cell: (row) =>
        row.limit ? (
          <LimitAmountInput
            value={row.limit.amountLimit}
            ariaLabel={`Лимит по сумме: ${row.workshop.name}, ${row.category.name}`}
            onSave={(next) => saveField(row, "amountLimit", next)}
          />
        ) : (
          <span className="text-xs text-muted-foreground">не настроен</span>
        ),
    },
    {
      key: "threshold",
      header: "Порог авто-одобрения",
      align: "right",
      cell: (row) =>
        row.limit ? (
          <LimitAmountInput
            value={row.limit.autoApprovalThreshold}
            ariaLabel={`Порог авто-одобрения: ${row.workshop.name}, ${row.category.name}`}
            onSave={(next) => saveField(row, "autoApprovalThreshold", next)}
          />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "used",
      header: "Факт использования",
      cell: (row) => {
        if (!row.limit) {
          return (
            <Button size="sm" variant="secondary" icon={Plus} onClick={() => createLimit(row)}>
              Настроить лимит
            </Button>
          );
        }
        const tone = limitTone(row.percent);
        return (
          <div className="flex min-w-[200px] flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatMoney(row.limit.amountUsed)} из{" "}
                {formatMoney(row.limit.amountLimit)}
              </span>
              <Badge
                tone={
                  tone === "success" ? "success" : tone === "warning" ? "warning" : "danger"
                }
              >
                {row.percent}%
              </Badge>
            </div>
            <ProgressBar
              value={row.limit.amountUsed}
              max={row.limit.amountLimit}
              tone={tone}
              size="sm"
            />
          </div>
        );
      },
    },
    {
      key: "updated",
      header: "Изменён",
      align: "right",
      hideOnMobile: true,
      cell: (row) =>
        row.limit?.updatedAt ? (
          <div className="whitespace-nowrap">
            <p className="text-xs text-muted-foreground">
              {formatDateTime(row.limit.updatedAt)}
            </p>
            {row.limit.updatedBy && (
              <p className="text-xs text-muted-foreground">{row.limit.updatedBy}</p>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Лимиты"
        description="Лимиты цехов по категориям и пороги автоматического одобрения. Значения применяются сразу при оформлении заказа и при согласовании."
      />

      <Card className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Пар «цех × категория»</p>
          <p className="mt-0.5 text-lg font-bold tabular-nums tracking-tight text-foreground">
            {rows.length}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            Близко к исчерпанию (&gt;{AT_RISK_PERCENT}%)
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums tracking-tight text-warning-foreground">
            {atRiskCount}
          </p>
        </div>
        {missingCount > 0 && (
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Без настроенного лимита</p>
            <p className="mt-0.5 text-lg font-bold tabular-nums tracking-tight text-foreground">
              {missingCount}
            </p>
          </div>
        )}

        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={onlyAtRisk}
            onChange={(e) => setOnlyAtRisk(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Только близкие к исчерпанию (&gt;{AT_RISK_PERCENT}%)
        </label>
      </Card>

      {visibleRows.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title={
            onlyAtRisk
              ? "Цехов у границы лимита нет"
              : "Пары «цех × категория» не найдены"
          }
          description={
            onlyAtRisk
              ? "Ни один цех не израсходовал больше 80% лимита за текущий период."
              : "Откройте цехам категории в матрице доступа на странице «Каталог (админ)» — пары появятся здесь."
          }
          action={
            onlyAtRisk ? (
              <Button variant="secondary" onClick={() => setOnlyAtRisk(false)}>
                Показать все лимиты
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Table
          columns={columns}
          rows={visibleRows}
          rowKey={(row) => `${row.workshop.id}-${row.category.id}`}
          compact
        />
      )}

      <p className="text-xs text-muted-foreground">
        Сохранение — по Enter или при потере фокуса, Escape отменяет правку.
        Факт использования пересчитывается по оформленным заказам и не
        редактируется вручную.
      </p>
    </div>
  );
}
