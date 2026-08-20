import { useMemo, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Search, X } from "lucide-react";

import { AccessMatrix } from "@/components/admin/AccessMatrix";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Badge,
  Button,
  Card,
  Field,
  IconButton,
  Input,
  Select,
  Table,
  type Column,
} from "@/components/ui";
import { formatMoney } from "@/lib/utils";
import { rootCategoryId } from "@/mocks";
import { useCatalogStore, useToastsStore } from "@/store";
import type { Product } from "@/types";

const ANY = "any";

export default function AdminCatalogPage() {
  const products = useCatalogStore((s) => s.products);
  const categories = useCatalogStore((s) => s.categories);
  const suppliers = useCatalogStore((s) => s.suppliers);
  const warehouses = useCatalogStore((s) => s.warehouses);
  const workshops = useCatalogStore((s) => s.workshops);
  const setProductArchived = useCatalogStore((s) => s.setProductArchived);
  const pushToast = useToastsStore((s) => s.push);

  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>(ANY);
  const [supplierId, setSupplierId] = useState<string>(ANY);
  const [visibility, setVisibility] = useState<string>(ANY);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>(undefined);

  const rootCategories = useMemo(
    () => categories.filter((c) => c.parentId === null && c.isActive),
    [categories]
  );

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;
  const supplierName = (id: string) =>
    suppliers.find((s) => s.id === id)?.name ?? id;
  const warehouseName = (id: string) =>
    warehouses.find((w) => w.id === id)?.name ?? id;

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      if (
        categoryId !== ANY &&
        rootCategoryId(product.categoryId) !== categoryId
      ) {
        return false;
      }
      if (supplierId !== ANY && product.supplierId !== supplierId) return false;
      if (visibility === "visible" && product.isArchived) return false;
      if (visibility === "hidden" && !product.isArchived) return false;
      if (!normalized) return true;
      return (
        product.name.toLowerCase().includes(normalized) ||
        product.sku.toLowerCase().includes(normalized) ||
        (product.erpItemId ?? "").toLowerCase().includes(normalized)
      );
    });
  }, [products, query, categoryId, supplierId, visibility]);

  const hiddenCount = products.filter((p) => p.isArchived).length;
  const hasFilters =
    query !== "" || categoryId !== ANY || supplierId !== ANY || visibility !== ANY;

  const resetFilters = () => {
    setQuery("");
    setCategoryId(ANY);
    setSupplierId(ANY);
    setVisibility(ANY);
  };

  const toggleVisibility = (product: Product) => {
    const next = !product.isArchived;
    setProductArchived(product.id, next);
    pushToast({
      tone: next ? "warning" : "success",
      title: next ? "Позиция скрыта" : "Позиция снова доступна",
      description: next
        ? `${product.name} больше не показывается в каталоге заказчиков`
        : `${product.name} вернулась в каталог цехов с доступом к категории`,
    });
  };

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Позиция",
      cell: (product) => (
        <div className="min-w-0">
          <p
            className={
              product.isArchived
                ? "text-sm text-muted-foreground line-through"
                : "text-sm font-medium text-foreground"
            }
          >
            {product.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-mono">{product.sku}</span>
            {product.erpItemId ? ` · ${product.erpItemId}` : ""}
          </p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Категория",
      hideOnMobile: true,
      cell: (product) => (
        <div className="min-w-0">
          <p className="text-sm text-foreground">
            {categoryName(rootCategoryId(product.categoryId))}
          </p>
          <p className="text-xs text-muted-foreground">
            {categoryName(product.categoryId)}
          </p>
        </div>
      ),
    },
    {
      key: "supplier",
      header: "Поставщик",
      hideOnMobile: true,
      cell: (product) => (
        <span className="text-sm text-muted-foreground">
          {supplierName(product.supplierId)}
        </span>
      ),
    },
    {
      key: "price",
      header: "Цена",
      align: "right",
      cell: (product) => (
        <div className="whitespace-nowrap">
          <p className="text-sm font-semibold text-foreground">
            {formatMoney(product.price)}
          </p>
          <p className="text-xs text-muted-foreground">за {product.unit}</p>
        </div>
      ),
    },
    {
      key: "stock",
      header: "Остаток",
      align: "right",
      hideOnMobile: true,
      cell: (product) => {
        const total = product.stock.reduce((sum, s) => sum + s.quantity, 0);
        const primary = product.stock.find(
          (s) => s.warehouseId === product.primaryWarehouseId
        );
        return (
          <div className="whitespace-nowrap">
            <p className="text-sm text-foreground">
              {total} {product.unit}
            </p>
            <p className="text-xs text-muted-foreground">
              {primary ? `${primary.quantity} · ${warehouseName(primary.warehouseId)}` : "—"}
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Статус",
      cell: (product) =>
        product.isArchived ? (
          <Badge tone="neutral" dot>
            Скрыт
          </Badge>
        ) : (
          <Badge tone="success" dot>
            Активен
          </Badge>
        ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (product) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton
            icon={Pencil}
            label="Редактировать позицию"
            onClick={() => {
              setEditing(product);
              setFormOpen(true);
            }}
          />
          <IconButton
            icon={product.isArchived ? Eye : EyeOff}
            label={product.isArchived ? "Показать в каталоге" : "Скрыть из каталога"}
            onClick={() => toggleVisibility(product)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Каталог (админ)"
        description="Номенклатура маркетплейса и доступ цехов к категориям. Изменения сразу действуют в каталоге заказчиков."
        actions={
          <Button
            icon={Plus}
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            Добавить позицию
          </Button>
        }
      />

      <Card className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Поиск" htmlFor="ac-search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="ac-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Название, артикул, код"
                className="pl-9"
              />
            </div>
          </Field>

          <Field label="Категория закупа" htmlFor="ac-category">
            <Select
              id="ac-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value={ANY}>Все категории</option>
              {rootCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Поставщик" htmlFor="ac-supplier">
            <Select
              id="ac-supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              <option value={ANY}>Все поставщики</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Видимость" htmlFor="ac-visibility">
            <Select
              id="ac-visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value={ANY}>Все позиции</option>
              <option value="visible">Только активные</option>
              <option value="hidden">Только скрытые</option>
            </Select>
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground tabular-nums">
            Показано позиций: {filtered.length} из {products.length} · скрыто{" "}
            {hiddenCount}
          </p>
          {hasFilters && (
            <Button variant="ghost" size="sm" icon={X} onClick={resetFilters}>
              Сбросить фильтры
            </Button>
          )}
        </div>
      </Card>

      <Table
        columns={columns}
        rows={filtered}
        rowKey={(product) => product.id}
        compact
        emptyMessage="Позиции не найдены — измените фильтры или добавьте новую позицию"
      />

      <AccessMatrix
        workshops={workshops}
        categories={rootCategories}
        onToggled={(workshop, category, allowed) =>
          pushToast({
            tone: allowed ? "success" : "warning",
            title: allowed
              ? `«${category.name}» открыта цеху`
              : `«${category.name}» закрыта цеху`,
            description: `${workshop.name}: изменение уже действует в каталоге заказчика`,
            duration: 3500,
          })
        }
      />

      {formOpen && (
        <ProductFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          product={editing}
          onSaved={(product, mode) =>
            pushToast({
              tone: "success",
              title:
                mode === "created" ? "Позиция добавлена" : "Позиция обновлена",
              description: product.name,
            })
          }
        />
      )}
    </div>
  );
}
