import { useState } from "react";
import { Check, Package, ShoppingCart } from "lucide-react";

import { QuantityStepper } from "@/components/catalog/QuantityStepper";
import { Badge, Button, Card } from "@/components/ui";
import { assetUrl, formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

/**
 * Карточка товара каталога: фото или плейсхолдер, название, путь по дереву
 * категорий, артикул, цена по договору, остаток на РЕСХ доставки, степпер
 * и «В корзину».
 *
 * Фото есть лишь у части позиций (public/products), у остальных — иконка:
 * в источнике номенклатуры изображений нет, в проде они придут из каталога
 * поставщика.
 */
export function ProductCard({
  product,
  categoryPath,
  purchaseCategoryName,
  warehouseId,
  warehouseName,
  inCartQuantity,
  onAdd,
}: {
  product: Product;
  /** «Группа / Вид» — второй и третий уровни дерева. */
  categoryPath?: string;
  /** Раздел (категория закупа) — показывается бейджем. */
  purchaseCategoryName?: string;
  /** РЕСХ цеха — остаток показывается именно по нему. */
  warehouseId: string | null;
  warehouseName: string | null;
  inCartQuantity: number;
  onAdd: (quantity: number) => void;
}) {
  const [quantity, setQuantity] = useState(1);

  const stock = warehouseId
    ? product.stock.find((s) => s.warehouseId === warehouseId)
    : undefined;
  const available = stock?.quantity ?? 0;
  const isOutOfStock = available <= 0;

  return (
    <Card padded={false} className="flex flex-col overflow-hidden">
      <div className="relative flex h-24 shrink-0 items-center justify-center overflow-hidden border-b border-border bg-muted/40 sm:h-32">
        {/*
          Источник карточки — внешний маркетплейс ТД. Метка только визуальная:
          договор и поставщик категории от неё не зависят.
        */}
        {product.externalSource && (
          <span
            className="absolute right-2 top-2 rounded-md border border-border bg-card/90 px-1.5 py-0.5 text-xs font-semibold text-muted-foreground backdrop-blur"
            title={`Источник карточки: ${product.externalSource}`}
          >
            {product.externalSource}
          </span>
        )}
        {product.imageUrl ? (
          <img
            src={assetUrl(product.imageUrl)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <Package
            className="h-8 w-8 text-muted-foreground sm:h-10 sm:w-10"
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="min-w-0">
          <p
            className="line-clamp-2 text-sm font-semibold text-foreground"
            title={product.name}
          >
            {product.name}
          </p>
          {categoryPath && (
            <p
              className="mt-1 line-clamp-1 text-xs text-muted-foreground"
              title={
                purchaseCategoryName
                  ? `${purchaseCategoryName} / ${categoryPath}`
                  : categoryPath
              }
            >
              {categoryPath}
            </p>
          )}
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {product.sku}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-base font-bold tracking-tight text-foreground">
            {formatMoney(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            за 1 {product.unit} · без НДС
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isOutOfStock ? (
            <Badge tone="danger" dot>
              Нет на {warehouseName ?? "РЕСХ"}
            </Badge>
          ) : (
            <Badge tone={available < 20 ? "warning" : "success"} dot>
              {available} {product.unit} на {warehouseName ?? "РЕСХ"}
            </Badge>
          )}
          {product.serviceLifeDays !== undefined && (
            <Badge tone="neutral" outline>
              срок службы {product.serviceLifeDays} дн.
            </Badge>
          )}
          {inCartQuantity > 0 && (
            <Badge tone="primary">
              <Check className="h-3 w-3" />В корзине: {inCartQuantity}
            </Badge>
          )}
        </div>

        {/* На узкой карточке степпер и кнопка встают друг под друга */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            max={isOutOfStock ? 1 : available}
            unit={product.unit}
            size="sm"
          />
          <Button
            size="sm"
            icon={ShoppingCart}
            disabled={isOutOfStock}
            onClick={() => onAdd(quantity)}
            className="h-9 w-full sm:flex-1"
          >
            В корзину
          </Button>
        </div>
      </div>
    </Card>
  );
}
