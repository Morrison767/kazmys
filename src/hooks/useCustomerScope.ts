import { useMemo } from "react";

import { computeCustomerScope, type CustomerScope } from "@/lib/customer-scope";
import { useCatalogStore, useSessionStore } from "@/store";

/**
 * Область видимости текущего заказчика (цех, РЕСХ, доступные категории
 * и номенклатура). Вся логика — в чистой computeCustomerScope; хук лишь
 * подписывается на справочники и текущего пользователя.
 */
export function useCustomerScope(): CustomerScope {
  const user = useSessionStore((s) => s.currentUser);
  const workshops = useCatalogStore((s) => s.workshops);
  const enterprises = useCatalogStore((s) => s.enterprises);
  const regions = useCatalogStore((s) => s.regions);
  const warehouses = useCatalogStore((s) => s.warehouses);
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);

  return useMemo(
    () =>
      computeCustomerScope({
        user,
        workshops,
        enterprises,
        regions,
        warehouses,
        categories,
        products,
      }),
    [user, workshops, enterprises, regions, warehouses, categories, products]
  );
}

export type { CustomerScope };
