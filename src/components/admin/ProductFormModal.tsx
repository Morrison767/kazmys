import { useMemo, useState } from "react";
import { Save } from "lucide-react";

import { Button, Field, Input, Modal, Select } from "@/components/ui";
import {
  UNITS,
  buildProductFromForm,
  selectableCategories,
  validateProductForm,
  type ProductFormValues,
} from "@/lib/admin-drafts";
import { formatMoney } from "@/lib/utils";
import { rootCategoryId } from "@/mocks";
import { useCatalogStore } from "@/store";
import type { Product } from "@/types";

/**
 * Форма позиции каталога. Поставщик не выбирается: он выводится от категории
 * закупа (модель «один поставщик на категорию») и показывается справочно.
 */
export function ProductFormModal({
  open,
  onClose,
  product,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  /** Редактируемая позиция; undefined — создание новой. */
  product?: Product;
  onSaved: (product: Product, mode: "created" | "updated") => void;
}) {
  const categories = useCatalogStore((s) => s.categories);
  const suppliers = useCatalogStore((s) => s.suppliers);
  const warehouses = useCatalogStore((s) => s.warehouses);
  const products = useCatalogStore((s) => s.products);
  const upsertProduct = useCatalogStore((s) => s.upsertProduct);

  const options = useMemo(() => selectableCategories(categories), [categories]);

  const [values, setValues] = useState<ProductFormValues>(() => ({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    categoryId: product?.categoryId ?? options[0]?.id ?? "",
    unit: product?.unit ?? "шт",
    price: product?.price ?? 0,
    warehouseId: product?.primaryWarehouseId ?? warehouses[0]?.id ?? "",
    stockQuantity:
      product?.stock.find((s) => s.warehouseId === product.primaryWarehouseId)
        ?.quantity ?? 0,
    serviceLifeDays: product?.serviceLifeDays,
    description: product?.description,
  }));
  const [touched, setTouched] = useState(false);

  const patch = (next: Partial<ProductFormValues>) =>
    setValues((prev) => ({ ...prev, ...next }));

  const purchaseCategoryId = values.categoryId
    ? rootCategoryId(values.categoryId)
    : "";
  const supplier = suppliers.find((s) => s.categoryId === purchaseCategoryId);
  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  const errors = validateProductForm(values, {
    suppliers,
    // При редактировании собственный артикул не считается дублем.
    existing: products.filter((p) => p.id !== product?.id),
  });
  const hasErrors = Object.keys(errors).length > 0;

  const save = () => {
    setTouched(true);
    if (hasErrors) return;
    const built = buildProductFromForm({
      values,
      suppliers,
      warehouses,
      existing: products,
      base: product,
    });
    upsertProduct(built);
    onSaved(built, product ? "updated" : "created");
    onClose();
  };

  const showError = (message?: string) => (touched ? message : undefined);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? `Позиция ${product.sku}` : "Новая позиция каталога"}
      description={
        product
          ? "Изменения сразу видны в каталоге заказчика и в новых заказах."
          : "Позиция появится в каталоге цехов, которым открыта её категория."
      }
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button icon={Save} onClick={save} disabled={touched && hasErrors}>
            {product ? "Сохранить" : "Добавить позицию"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Название"
          htmlFor="pf-name"
          required
          error={showError(errors.name)}
          className="sm:col-span-2"
        >
          <Input
            id="pf-name"
            value={values.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Например: Круг зачистной 180×6×22,2 мм"
          />
        </Field>

        <Field
          label="Артикул поставщика"
          htmlFor="pf-sku"
          required
          error={showError(errors.sku)}
        >
          <Input
            id="pf-sku"
            value={values.sku}
            onChange={(e) => patch({ sku: e.target.value })}
            placeholder="PS-CNS-XXX"
          />
        </Field>

        <Field
          label="Категория"
          htmlFor="pf-category"
          required
          error={showError(errors.categoryId ?? errors.supplier)}
          hint={
            supplier
              ? `Поставщик категории «${categoryName(purchaseCategoryId)}»: ${supplier.name}`
              : undefined
          }
        >
          <Select
            id="pf-category"
            value={values.categoryId}
            onChange={(e) => patch({ categoryId: e.target.value })}
          >
            {options.map((category) => (
              <option key={category.id} value={category.id}>
                {categoryName(rootCategoryId(category.id))} · {category.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Единица измерения" htmlFor="pf-unit">
          <Select
            id="pf-unit"
            value={values.unit}
            onChange={(e) =>
              patch({ unit: e.target.value as ProductFormValues["unit"] })
            }
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Цена по договору, ₸ без НДС"
          htmlFor="pf-price"
          required
          error={showError(errors.price)}
          hint={values.price > 0 ? formatMoney(values.price) : undefined}
        >
          <Input
            id="pf-price"
            type="number"
            min={0}
            step={10}
            value={values.price || ""}
            onChange={(e) => patch({ price: Number(e.target.value) })}
          />
        </Field>

        <Field label="РЕСХ основного хранения" htmlFor="pf-warehouse">
          <Select
            id="pf-warehouse"
            value={values.warehouseId}
            onChange={(e) => patch({ warehouseId: e.target.value })}
          >
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Остаток на РЕСХ" htmlFor="pf-stock">
          <Input
            id="pf-stock"
            type="number"
            min={0}
            value={values.stockQuantity}
            onChange={(e) => patch({ stockQuantity: Number(e.target.value) })}
          />
        </Field>

        <Field
          label="Нормативный срок службы, дней"
          htmlFor="pf-life"
          hint="Для инструмента — основа аналитики ходимости"
        >
          <Input
            id="pf-life"
            type="number"
            min={0}
            value={values.serviceLifeDays ?? ""}
            onChange={(e) =>
              patch({
                serviceLifeDays: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          />
        </Field>

        <Field label="Описание" htmlFor="pf-description" className="sm:col-span-2">
          <Input
            id="pf-description"
            value={values.description ?? ""}
            onChange={(e) => patch({ description: e.target.value })}
            placeholder="Необязательно"
          />
        </Field>
      </div>
    </Modal>
  );
}
