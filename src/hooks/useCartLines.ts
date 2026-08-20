import { useMemo } from "react";

import type { CartLine } from "@/lib/cart-limits";
import { useCartStore, useCatalogStore } from "@/store";

/**
 * Позиции корзины, разложенные до товаров и сумм. Корзина хранит только
 * productId и количество, поэтому цена и остатки подтягиваются из каталога
 * при каждом рендере — как и будет в проде при синхронизации цен из ERP.
 */
export function useCartLines(): {
  lines: CartLine[];
  totalAmount: number;
  vatAmount: number;
  totalWithVat: number;
  totalQuantity: number;
} {
  const items = useCartStore((s) => s.items);
  const products = useCatalogStore((s) => s.products);

  return useMemo(() => {
    const lines: CartLine[] = items.flatMap((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return [];
      return [
        {
          product,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        },
      ];
    });

    const totalAmount = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const vatAmount = lines.reduce(
      (sum, l) => sum + Math.round((l.lineTotal * l.product.vatRate) / 100),
      0
    );

    return {
      lines,
      totalAmount,
      vatAmount,
      totalWithVat: totalAmount + vatAmount,
      totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    };
  }, [items, products]);
}
