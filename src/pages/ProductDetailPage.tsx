import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Check,
  Package,
  PackageSearch,
  ShoppingCart,
} from "lucide-react";

import { OfferList } from "@/components/catalog/OfferList";
import { QuantityStepper } from "@/components/catalog/QuantityStepper";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DefinitionList,
  EmptyState,
} from "@/components/ui";
import { useCustomerScope } from "@/hooks/useCustomerScope";
import { deliveryCostLabel, deliveryDateLabel } from "@/lib/offers";
import { stockLabel } from "@/lib/stock-label";
import { assetUrl, formatDate, formatMoney } from "@/lib/utils";
import { categoryPath, offersOfProduct, rootCategoryId } from "@/mocks";
import { useCartStore, useCatalogStore, useLimitsStore } from "@/store";

/**
 * Страница товара: подробности по позиции каталога и добавление в корзину.
 * Логика та же, что у карточки в сетке, — отличается только объём информации.
 *
 * Фильтры каталога передаются в адресной строке, поэтому «Назад в каталог»
 * возвращает к тому же отбору, из которого пришёл пользователь.
 */
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { workshop, warehouse, allowedCategories, availableProducts } =
    useCustomerScope();
  const categories = useCatalogStore((s) => s.categories);
  const suppliers = useCatalogStore((s) => s.suppliers);
  const warehouses = useCatalogStore((s) => s.warehouses);
  const regions = useCatalogStore((s) => s.regions);
  const limits = useLimitsStore((s) => s.limits);
  const addToCart = useCartStore((s) => s.add);
  const inCart = useCartStore((s) => s.items.find((i) => i.productId === id));

  const [quantity, setQuantity] = useState(1);
  /** Выбранный продавец; пусто — предложение по рамочному договору. */
  const [pickedOfferId, setPickedOfferId] = useState<string>();

  const product = availableProducts.find((p) => p.id === id);
  const backTo = `/catalog${searchParams.toString() ? `?${searchParams}` : ""}`;

  const purchaseCategoryId = product ? rootCategoryId(product.categoryId) : "";
  const supplier = suppliers.find((s) => s.categoryId === purchaseCategoryId);
  const limit = useMemo(
    () =>
      limits.find(
        (l) =>
          l.workshopId === workshop?.id && l.categoryId === purchaseCategoryId
      ),
    [limits, workshop?.id, purchaseCategoryId]
  );

  if (!product) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Позиция недоступна"
          description="Товар снят с публикации, скрыт администратором ТД или относится к категории, закрытой вашему цеху."
        />
        <EmptyState
          icon={PackageSearch}
          title="Позиция не найдена в вашем каталоге"
          description={
            allowedCategories.length > 0
              ? "Вернитесь в каталог и выберите позицию из доступных категорий."
              : "Вашему цеху пока не открыта ни одна категория закупа."
          }
          action={<Button onClick={() => navigate(backTo)}>Назад в каталог</Button>}
        />
      </div>
    );
  }

  const primaryStock = product.stock.find(
    (s) => s.warehouseId === warehouse?.id
  );
  const available = primaryStock?.quantity ?? 0;
  const isOutOfStock = available <= 0;

  const warehouseName = (warehouseId: string) =>
    warehouses.find((w) => w.id === warehouseId)?.name ?? warehouseId;
  const regionName = (regionId: string) =>
    regions.find((r) => r.id === regionId)?.name ?? regionId;

  /*
    Предложения продавцов. У договорного остаток и склад берутся из области
    видимости заказчика (его РЕСХ), а не из строки данных: иначе список
    предложений расходился бы с блоком «Остатки на РЕСХ» на этой же странице.
  */
  const offers = offersOfProduct(product.id).map((offer) =>
    offer.isContract
      ? {
          ...offer,
          availableQuantity: available,
          deliveryLabel: `Поставка на ${warehouse?.name ?? "РЕСХ региона"}`,
        }
      : offer
  );
  const selectedOffer =
    offers.find((o) => o.id === pickedOfferId) ??
    offers.find((o) => o.isContract) ??
    offers[0];

  /** Доступное количество у выбранного продавца — им ограничен степпер. */
  const offerAvailable = selectedOffer?.availableQuantity ?? available;
  const offerPrice = selectedOffer?.price ?? product.price;
  const canOrder = offerAvailable > 0;

  const vat = Math.round((offerPrice * product.vatRate) / 100);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={product.name}
        description={categoryPath(product.categoryId)}
        actions={
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate(backTo)}
          >
            Назад в каталог
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
          {/* Фото и основное */}
          <Card padded={false} className="overflow-hidden">
            <div className="relative flex h-56 items-center justify-center border-b border-border bg-muted/40 sm:h-80">
              {product.imageUrl ? (
                <img
                  src={assetUrl(product.imageUrl)}
                  alt={product.name}
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <Package
                  className="h-16 w-16 text-muted-foreground"
                  strokeWidth={1.4}
                />
              )}
              {product.externalSource && (
                <span
                  className="absolute right-3 top-3 rounded-md border border-border bg-card/90 px-2 py-1 text-xs font-semibold text-muted-foreground backdrop-blur"
                  title={`Источник карточки: ${product.externalSource}`}
                >
                  {product.externalSource}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral" outline>
                  {categories.find((c) => c.id === purchaseCategoryId)?.name}
                </Badge>
                <Badge tone="neutral" outline>
                  {categories.find((c) => c.id === product.categoryId)?.name}
                </Badge>
                {product.serviceLifeDays !== undefined && (
                  <Badge tone="info">
                    срок службы {product.serviceLifeDays} дн.
                  </Badge>
                )}
              </div>

              {product.description && (
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              )}

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {formatMoney(offerPrice)}
                </span>
                <span className="text-sm text-muted-foreground">
                  за 1 {product.unit} без НДС · с НДС{" "}
                  {formatMoney(offerPrice + vat)}
                </span>
                {selectedOffer && !selectedOffer.isContract && (
                  <Badge tone="warning">цена продавца {selectedOffer.sellerName}</Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Где заказать */}
          <Card className="flex flex-col gap-4">
            <CardHeader
              title="Где заказать"
              description="Предложения продавцов по позиции: наличие, срок поставки и цена. Договор категории — основной канал; закупка у внешнего продавца оформляется через согласование ТД."
            />
            <OfferList
              offers={offers}
              quantity={quantity}
              unit={product.unit}
              selectedOfferId={selectedOffer?.id}
              onSelect={setPickedOfferId}
            />
          </Card>

          {/* Характеристики */}
          {product.specs && product.specs.length > 0 && (
            <Card className="flex flex-col gap-4">
              <CardHeader
                title="Характеристики"
                description="Из карточки номенклатуры и рамочного договора."
              />
              <DefinitionList
                rows={product.specs.map((spec) => ({
                  label: spec.label,
                  value: spec.value,
                }))}
              />
            </Card>
          )}

          {/* Остатки по РЕСХ */}
          {/*
            У позиций из внешнего маркетплейса нет складского потока через РЕСХ,
            поэтому показывается доступность у поставщика без склада и региона.
          */}
          {product.externalSource ? (
            <Card className="flex flex-col gap-4">
              <CardHeader
                title="Доступность у поставщика"
                description={`Позиция из каталога ${product.externalSource} — поставляется напрямую, минуя РЕСХ. Число используется для проверки нормы по количеству при оформлении.`}
              />
              <DefinitionList
                rows={[
                  {
                    label: "Источник",
                    value: product.externalSource,
                  },
                  {
                    label: "Доступно у поставщика",
                    value: `${available} ${product.unit}`,
                  },
                ]}
              />
            </Card>
          ) : (
            <Card className="flex flex-col gap-4">
              <CardHeader
                title="Остатки на РЕСХ"
                description="Свободный остаток по региональным складам хранения; в проде обновляется из D365 F&O каждые 15 минут."
              />
              <DefinitionList
                rows={product.stock.map((stock) => ({
                  label: (
                    <span className="flex items-center gap-1.5">
                      {warehouseName(stock.warehouseId)}
                      {stock.warehouseId === warehouse?.id && (
                        <Badge tone="primary">ваш РЕСХ</Badge>
                      )}
                    </span>
                  ),
                  value: `${stock.quantity} ${product.unit} · ${regionName(
                    stock.regionId
                  )}`,
                }))}
              />
            </Card>
          )}
        </div>

        {/* Заказ и поставщик */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
          <Card className="flex flex-col gap-4">
            <CardHeader
              title="Заказать"
              description={
                selectedOffer
                  ? `Продавец: ${selectedOffer.sellerName}`
                  : "Нет доступных предложений"
              }
            />

            {selectedOffer && !selectedOffer.isContract ? (
              <Badge tone={canOrder ? "success" : "danger"} dot>
                {canOrder
                  ? `Доступно у продавца: ${offerAvailable} ${product.unit}`
                  : "Нет в наличии у продавца"}
              </Badge>
            ) : (
              <Badge
                tone={isOutOfStock ? "danger" : available < 20 ? "warning" : "success"}
                dot
              >
                {stockLabel(product, available, warehouse?.name ?? null)}
                {isOutOfStock ? " — поставка под заказ" : ""}
              </Badge>
            )}

            {selectedOffer && (
              <p className="text-xs text-muted-foreground">
                {selectedOffer.deliveryLabel} · привезут{" "}
                {deliveryDateLabel(selectedOffer.deliveryDays)} ·{" "}
                {deliveryCostLabel(selectedOffer.deliveryCost)}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={canOrder ? offerAvailable : undefined}
                unit={product.unit}
              />
              <p className="text-xs text-muted-foreground">
                Сумма позиции: {formatMoney(offerPrice * quantity)} без НДС
              </p>
            </div>

            <Button
              size="lg"
              fullWidth
              icon={ShoppingCart}
              disabled={!canOrder}
              onClick={() => addToCart(product.id, quantity, selectedOffer?.id)}
            >
              В корзину
            </Button>

            {inCart && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-success" />
                Уже в корзине: {inCart.quantity} {product.unit}
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="font-semibold text-primary transition-colors hover:underline"
                >
                  перейти
                </button>
              </p>
            )}

            {limit && (
              <p className="text-xs text-muted-foreground">
                Лимит цеха по категории: остаток{" "}
                {formatMoney(Math.max(0, limit.amountLimit - limit.amountUsed))}
                , порог авто-одобрения{" "}
                {formatMoney(limit.autoApprovalThreshold)}.
              </p>
            )}
          </Card>

          <Card className="flex flex-col gap-4">
            <CardHeader
              title="Поставщик категории"
              description="Модель «один поставщик на категорию»: позиция поставляется по действующему рамочному договору."
            />
            {supplier ? (
              <>
                <p className="flex items-start gap-2 text-sm font-semibold text-foreground">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  {supplier.name}
                </p>
                <DefinitionList
                  rows={[
                    { label: "Рамочный договор", value: supplier.contractNumber },
                    {
                      label: "Действует до",
                      value: formatDate(supplier.contractDateTo),
                    },
                    {
                      label: "Нормативный срок поставки",
                      value:
                        supplier.normativeDeliveryDays !== undefined
                          ? `${supplier.normativeDeliveryDays} дн.`
                          : "—",
                    },
                    { label: "Код номенклатуры", value: product.erpItemId ?? "—" },
                    ...(product.externalSource
                      ? [
                          {
                            label: "Источник карточки",
                            value: product.externalSource,
                          },
                        ]
                      : []),
                  ]}
                />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                По категории нет действующего поставщика — заказ возможен после
                нового тендера.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
