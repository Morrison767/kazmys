import { Badge, Card, CardHeader } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCatalogStore } from "@/store";
import type { Category, Workshop } from "@/types";

/**
 * Матрица доступа цехов к категориям закупа — ограничение «по типу товара»
 * из концепции. Чекбокс меняет Workshop.allowedCategoryIds в общем состоянии,
 * то есть тот же источник, по которому строится каталог заказчика (Этап 2)
 * и проверка лимитов в корзине.
 */
export function AccessMatrix({
  workshops,
  categories,
  onToggled,
}: {
  workshops: Workshop[];
  /** Категории закупа верхнего уровня. */
  categories: Category[];
  onToggled?: (workshop: Workshop, category: Category, allowed: boolean) => void;
}) {
  const toggleWorkshopCategory = useCatalogStore((s) => s.toggleWorkshopCategory);
  const enterprises = useCatalogStore((s) => s.enterprises);

  const enterpriseName = (id: string) =>
    enterprises.find((e) => e.id === id)?.shortName ?? id;

  return (
    <Card padded={false}>
      <div className="border-b border-border px-5 py-4">
        <CardHeader
          title="Матрица доступа цехов к категориям"
          description="Какие категории видит цех в каталоге. Например, буровой участок видит инструмент и СИЗ, но не канцелярию."
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th
                scope="col"
                className="sticky left-0 z-10 bg-muted/40 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Цех / участок
              </th>
              {categories.map((category) => (
                <th
                  key={category.id}
                  scope="col"
                  className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {category.name}
                </th>
              ))}
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Открыто
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {workshops.map((workshop) => {
              const openCount = categories.filter((c) =>
                workshop.allowedCategoryIds.includes(c.id)
              ).length;

              return (
                <tr key={workshop.id} className="transition-colors hover:bg-muted/30">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 min-w-[220px] bg-card px-4 py-3 text-left align-middle font-normal"
                  >
                    <span className="block text-sm font-semibold text-foreground">
                      {workshop.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {enterpriseName(workshop.enterpriseId)}
                      {workshop.costCenter ? ` · ${workshop.costCenter}` : ""}
                    </span>
                  </th>

                  {categories.map((category) => {
                    const allowed = workshop.allowedCategoryIds.includes(category.id);
                    return (
                      <td key={category.id} className="px-3 py-3 text-center">
                        <label
                          className="inline-flex cursor-pointer items-center justify-center"
                          title={`${workshop.name} · ${category.name}`}
                        >
                          <input
                            type="checkbox"
                            checked={allowed}
                            onChange={() => {
                              toggleWorkshopCategory(workshop.id, category.id);
                              onToggled?.(workshop, category, !allowed);
                            }}
                            aria-label={`${category.name} для ${workshop.name}`}
                            className="h-4 w-4 cursor-pointer accent-primary"
                          />
                        </label>
                      </td>
                    );
                  })}

                  <td className="px-4 py-3 text-right">
                    <Badge
                      tone={openCount === 0 ? "danger" : "neutral"}
                      className={cn(openCount === 0 && "whitespace-nowrap")}
                    >
                      {openCount} из {categories.length}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="border-t border-border bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
        Снятие галочки скрывает категорию в каталоге цеха и блокирует оформление
        заказа по ней; лимиты по закрытой категории остаются настроенными.
      </p>
    </Card>
  );
}
