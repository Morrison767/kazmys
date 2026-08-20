import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  LayoutGrid,
  PackageSearch,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import { LimitWidget, type LimitRow } from "@/components/catalog/LimitWidget";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, Button, Card, EmptyState, Input } from "@/components/ui";
import { useCustomerScope } from "@/hooks/useCustomerScope";
import { rootCategoryId } from "@/mocks";
import { cn, formatDate } from "@/lib/utils";
import { useCartStore, useCatalogStore, useLimitsStore } from "@/store";

/** Псевдо-категория «все доступные». */
const ALL = "all";

export default function CatalogPage() {
  const navigate = useNavigate();
  const {
    user,
    workshop,
    enterprise,
    warehouse,
    allowedCategories,
    availableProducts,
  } = useCustomerScope();

  const categories = useCatalogStore((s) => s.categories);
  const suppliers = useCatalogStore((s) => s.suppliers);
  const limits = useLimitsStore((s) => s.limits);
  const addToCart = useCartStore((s) => s.add);
  const cartItems = useCartStore((s) => s.items);

  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [query, setQuery] = useState("");

  // Товары цеха с учётом выбранной категории и поиска по названию/артикулу.
  const visibleProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return availableProducts.filter((product) => {
      const inCategory =
        activeCategory === ALL ||
        rootCategoryId(product.categoryId) === activeCategory;
      if (!inCategory) return false;
      if (!normalized) return true;
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized)
      );
    });
  }, [availableProducts, activeCategory, query]);

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const product of availableProducts) {
      const categoryId = rootCategoryId(product.categoryId);
      counts.set(categoryId, (counts.get(categoryId) ?? 0) + 1);
    }
    return counts;
  }, [availableProducts]);

  // Виджет лимита: по выбранной категории, либо по всем доступным сразу.
  const limitRows: LimitRow[] = useMemo(() => {
    if (!workshop) return [];
    const target =
      activeCategory === ALL
        ? allowedCategories
        : allowedCategories.filter((c) => c.id === activeCategory);
    return target.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      limit: limits.find(
        (l) => l.workshopId === workshop.id && l.categoryId === category.id
      ),
    }));
  }, [workshop, activeCategory, allowedCategories, limits]);

  // Договоры категорий: истёкший или истекающий договор — риск для заказа.
  const contractWarnings = useMemo(
    () =>
      allowedCategories.flatMap((category) => {
        const supplier = suppliers.find((s) => s.categoryId === category.id);
        if (
          !supplier ||
          (supplier.contractStatus !== "expired" &&
            supplier.contractStatus !== "expiring")
        ) {
          return [];
        }
        return [{ category, supplier }];
      }),
    [allowedCategories, suppliers]
  );

  const cartCount = cartItems.length;

  if (!user || !workshop) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="Пользователь не привязан к цеху"
        description="Каталог доступен заказчикам, привязанным к цеху или участку. Выберите роль «Заказчик» в шапке."
      />
    );
  }

  if (allowedCategories.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Каталог"
          description={`${workshop.name} · ${enterprise?.shortName ?? ""}`}
        />
        <EmptyState
          icon={PackageSearch}
          title="Цеху не открыта ни одна категория"
          description="Категории закупа для цеха настраивает администратор Торгового Дома. Обратитесь в ТД, чтобы открыть доступ к нужной категории."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Каталог"
        description={
          <>
            {workshop.name} · {enterprise?.shortName} · доставка на{" "}
            {warehouse?.name ?? "РЕСХ региона"}. Показаны только категории,
            открытые вашему цеху.
          </>
        }
        actions={
          <Button
            variant={cartCount > 0 ? "primary" : "secondary"}
            icon={ShoppingCart}
            onClick={() => navigate("/cart")}
          >
            Корзина{cartCount > 0 ? ` · ${cartCount}` : ""}
          </Button>
        }
      />

      {contractWarnings.length > 0 && (
        <Card className="flex flex-col gap-2 border-warning-border bg-warning-soft p-4 sm:px-6">
          {contractWarnings.map(({ category, supplier }) => (
            <div key={category.id} className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              <p className="text-sm text-warning-foreground">
                {supplier.contractStatus === "expired" ? (
                  <>
                    Рамочный договор по категории «{category.name}» истёк{" "}
                    {formatDate(supplier.contractDateTo)} — до нового тендера
                    заказы по ней могут быть отклонены Торговым Домом.
                  </>
                ) : (
                  <>
                    Рамочный договор по категории «{category.name}» истекает{" "}
                    {formatDate(supplier.contractDateTo)} — планируйте
                    потребность заранее.
                  </>
                )}
              </p>
            </div>
          ))}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Лимит цеха: на мобильном — компактно сверху, на lg+ — колонка справа */}
        <div className="order-first flex min-w-0 flex-col gap-4 lg:order-last lg:sticky lg:top-0 lg:self-start">
          <LimitWidget
            rows={limitRows}
            title={
              activeCategory === ALL
                ? "Лимиты цеха по категориям"
                : "Лимит цеха по категории"
            }
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {/* Поиск и категории */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск по названию или артикулу"
                aria-label="Поиск по каталогу"
                className="h-11 pl-9 pr-9"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Сбросить поиск"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <CategoryTab
                label="Все категории"
                count={availableProducts.length}
                active={activeCategory === ALL}
                onClick={() => setActiveCategory(ALL)}
              />
              {allowedCategories.map((category) => (
                <CategoryTab
                  key={category.id}
                  label={category.name}
                  count={countByCategory.get(category.id) ?? 0}
                  active={activeCategory === category.id}
                  onClick={() => setActiveCategory(category.id)}
                />
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Найдено позиций: {visibleProducts.length}
            {activeCategory !== ALL && (
              <>
                {" "}
                · подгруппы:{" "}
                {categories
                  .filter((c) => c.parentId === activeCategory)
                  .map((c) => c.name)
                  .join(", ")}
              </>
            )}
          </p>

          {visibleProducts.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="Позиции не найдены"
              description={
                query
                  ? `По запросу «${query}» в доступных цеху категориях ничего нет. Уточните название или артикул.`
                  : "В этой категории пока нет позиций каталога."
              }
              action={
                query ? (
                  <Button variant="secondary" onClick={() => setQuery("")}>
                    Сбросить поиск
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  warehouseId={warehouse?.id ?? null}
                  warehouseName={warehouse?.name ?? null}
                  inCartQuantity={
                    cartItems.find((i) => i.productId === product.id)
                      ?.quantity ?? 0
                  }
                  onAdd={(quantity) => addToCart(product.id, quantity)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function CategoryTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
        active
          ? "border-primary/30 bg-accent font-semibold text-foreground"
          : "border-border bg-card text-foreground hover:bg-muted"
      )}
    >
      {label}
      <Badge tone={active ? "primary" : "neutral"}>{count}</Badge>
    </button>
  );
}
