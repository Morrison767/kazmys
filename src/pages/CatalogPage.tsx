import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  LayoutGrid,
  PackageSearch,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import {
  CategoryTreeDropdown,
  EMPTY_SELECTION,
  type CategorySelection,
} from "@/components/catalog/CategoryTreeDropdown";
import { LimitWidget, type LimitRow } from "@/components/catalog/LimitWidget";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, Card, EmptyState, Input } from "@/components/ui";
import { useCustomerScope } from "@/hooks/useCustomerScope";
import { categoryWithDescendantIds, rootCategoryId } from "@/mocks";
import { formatDate } from "@/lib/utils";
import { useCartStore, useCatalogStore, useLimitsStore } from "@/store";

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

  /**
   * Отбор каталога живёт в адресной строке: так он сохраняется при переходе
   * на страницу товара и обратно, а ссылку можно передать коллеге.
   */
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const selection: CategorySelection = useMemo(
    () => ({
      rootId: searchParams.get("root"),
      groupId: searchParams.get("group"),
      kindId: searchParams.get("kind"),
    }),
    [searchParams]
  );

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const setQuery = (value: string) => updateParams({ q: value || null });
  const setSelection = (next: CategorySelection) =>
    updateParams({
      root: next.rootId,
      group: next.groupId,
      kind: next.kindId,
    });

  /** Число групп и видов в выбранной ветке — для подписи под поиском. */
  const groups = useMemo(
    () =>
      selection.rootId
        ? categories.filter((c) => c.parentId === selection.rootId)
        : [],
    [categories, selection.rootId]
  );
  const kinds = useMemo(
    () =>
      selection.groupId
        ? categories.filter((c) => c.parentId === selection.groupId)
        : [],
    [categories, selection.groupId]
  );

  /** Сколько доступных цеху позиций в категории с учётом вложенных. */
  const countOf = useMemo(() => {
    const cache = new Map<string, number>();
    return (categoryId: string) => {
      const cached = cache.get(categoryId);
      if (cached !== undefined) return cached;
      const ids = new Set(categoryWithDescendantIds(categoryId));
      const count = availableProducts.filter((p) => ids.has(p.categoryId)).length;
      cache.set(categoryId, count);
      return count;
    };
  }, [availableProducts]);

  // Товары цеха с учётом выбранного узла дерева и поиска.
  const visibleProducts = useMemo(() => {
    const node = selection.kindId ?? selection.groupId ?? selection.rootId;
    const scopeIds = node ? new Set(categoryWithDescendantIds(node)) : null;
    const normalized = query.trim().toLowerCase();

    return availableProducts.filter((product) => {
      if (scopeIds && !scopeIds.has(product.categoryId)) return false;
      if (!normalized) return true;
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized)
      );
    });
  }, [availableProducts, selection, query]);

  // Виджет лимита: по выбранному разделу, либо по всем доступным сразу.
  const limitRows: LimitRow[] = useMemo(() => {
    if (!workshop) return [];
    const target = selection.rootId
      ? allowedCategories.filter((c) => c.id === selection.rootId)
      : allowedCategories;
    return target.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      limit: limits.find(
        (l) => l.workshopId === workshop.id && l.categoryId === category.id
      ),
    }));
  }, [workshop, selection.rootId, allowedCategories, limits]);

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

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? categoryId;

  /** Подпись позиции в карточке: «Группа / Вид». */
  const pathOf = (categoryId: string) => {
    const kind = categories.find((c) => c.id === categoryId);
    const group = kind?.parentId
      ? categories.find((c) => c.id === kind.parentId)
      : undefined;
    return [group?.name, kind?.name].filter(Boolean).join(" / ");
  };

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
              selection.rootId
                ? "Лимит цеха по категории"
                : "Лимиты цеха по категориям"
            }
          />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          {/* Поиск и трёхуровневая навигация */}
          <div className="flex flex-col gap-3">
            <div className="relative sm:max-w-md">
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

            <CategoryTreeDropdown
              roots={allowedCategories}
              categories={categories}
              selection={selection}
              onSelect={setSelection}
              countOf={countOf}
              totalCount={availableProducts.length}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Найдено позиций: {visibleProducts.length}
            {selection.rootId && !selection.groupId && groups.length > 0 && (
              <> · групп в разделе: {groups.length}</>
            )}
            {selection.groupId && kinds.length > 0 && (
              <> · видов в группе: {kinds.length}</>
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
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => setSelection(EMPTY_SELECTION)}
                  >
                    Показать все категории
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={`/catalog/${product.id}${
                    searchParams.toString() ? `?${searchParams}` : ""
                  }`}
                  categoryPath={pathOf(product.categoryId)}
                  purchaseCategoryName={categoryName(
                    rootCategoryId(product.categoryId)
                  )}
                  warehouseId={warehouse?.id ?? null}
                  warehouseName={warehouse?.name ?? null}
                  inCartQuantity={
                    cartItems.find((i) => i.productId === product.id)
                      ?.quantity ?? 0
                  }
                  onAdd={(quantity, offerId) =>
                    addToCart(product.id, quantity, offerId)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
