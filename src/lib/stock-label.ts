import type { Product } from "@/types";

/**
 * Подпись к остатку позиции.
 *
 * Позиции с внешним источником (Garwin / Lamed / TSSP) физически не проходят
 * через РЕСХ основного поставщика категории, поэтому для них формулировка
 * без упоминания склада и региона. Само число остатка используется так же —
 * в том числе при проверке нормы по количеству при оформлении заказа.
 */
export function stockLabel(
  product: Product,
  quantity: number,
  warehouseName: string | null
): string {
  const warehouse = warehouseName ?? "РЕСХ";

  if (product.externalSource) {
    return quantity > 0
      ? `Доступно у поставщика: ${quantity} ${product.unit}`
      : "Нет в наличии у поставщика";
  }

  return quantity > 0
    ? `${quantity} ${product.unit} на ${warehouse}`
    : `Нет на ${warehouse}`;
}

/** Позиция поставляется мимо РЕСХ — из каталога внешнего маркетплейса. */
export function isExternalSupply(product: Product): boolean {
  return Boolean(product.externalSource);
}
