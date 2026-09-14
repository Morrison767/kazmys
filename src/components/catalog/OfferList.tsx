import { useMemo, useState } from "react";
import { Check, ShieldCheck, Star, Truck } from "lucide-react";

import { Badge, Button } from "@/components/ui";
import {
  DELIVERY_FILTERS,
  buildOfferViews,
  countByDelivery,
  deliveryCostLabel,
  deliveryDateLabel,
  deliveryDaysLabel,
  filterByDelivery,
  sortOffers,
  type OfferSort,
  type OfferView,
} from "@/lib/offers";
import { cn, formatMoney } from "@/lib/utils";
import type { ProductOffer } from "@/types";

/**
 * Список предложений продавцов: у кого есть позиция, когда привезут и почём.
 *
 * Порядок отражает модель закупа ТД: договорное предложение всегда сверху и
 * помечено — это канал по рамочному договору. Внешние маркетплейсы идут
 * ниже с отклонением от договорной цены, чтобы разница читалась сразу.
 */
interface OfferListProps {
  offers: ProductOffer[];
  quantity: number;
  unit: string;
  selectedOfferId?: string;
  onSelect: (offerId: string) => void;
}

const SORTS: Array<{ id: OfferSort; label: string }> = [
  { id: "price", label: "Сначала дешевле" },
  { id: "delivery", label: "Сначала быстрее" },
];

export function OfferList({
  offers,
  quantity,
  unit,
  selectedOfferId,
  onSelect,
}: OfferListProps) {
  const [filterId, setFilterId] = useState("all");
  const [sort, setSort] = useState<OfferSort>("price");

  const filter =
    DELIVERY_FILTERS.find((f) => f.id === filterId) ?? DELIVERY_FILTERS[0];

  const views = useMemo(
    () =>
      buildOfferViews(
        sortOffers(filterByDelivery(offers, filter), sort),
        quantity,
        offers
      ),
    [offers, filter, sort, quantity]
  );

  if (offers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        По позиции нет активных предложений продавцов.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {DELIVERY_FILTERS.map((item) => {
          const count = countByDelivery(offers, item);
          const isActive = item.id === filter.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={count === 0}
              onClick={() => setFilterId(item.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted",
                count === 0 && "cursor-not-allowed opacity-40 hover:bg-card"
              )}
            >
              {item.label}
              <span className={cn("ml-1.5", !isActive && "text-foreground/60")}>
                {count}
              </span>
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-1 rounded-full border border-border bg-muted/40 p-0.5">
          {SORTS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSort(item.id)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                sort === item.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
        {views.map((view) => (
          <OfferRow
            key={view.offer.id}
            view={view}
            unit={unit}
            quantity={quantity}
            isSelected={view.offer.id === selectedOfferId}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </div>
  );
}

interface OfferRowProps {
  view: OfferView;
  unit: string;
  quantity: number;
  isSelected: boolean;
  onSelect: (offerId: string) => void;
}

function OfferRow({ view, unit, quantity, isSelected, onSelect }: OfferRowProps) {
  const { offer, deltaPercent, contractPrice, total, isCheapest, isFastest, isEnough } =
    view;

  return (
    <li
      className={cn(
        "flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:gap-4",
        isSelected ? "bg-accent/40" : "hover:bg-muted/30"
      )}
    >
      {/* Продавец */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-bold text-foreground">
            {offer.sellerName}
          </span>
          {offer.isContract ? (
            <Badge tone="primary">
              <ShieldCheck className="h-3 w-3" />
              по договору
            </Badge>
          ) : (
            <Badge tone="neutral" outline>
              {offer.externalSource}
            </Badge>
          )}
        </div>

        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="font-semibold text-foreground">
            {offer.rating.toFixed(1)}
          </span>
          · {offer.reviews} отзывов
        </span>

        <span
          className={cn(
            "text-xs",
            isEnough ? "text-muted-foreground" : "text-danger-foreground"
          )}
        >
          {isEnough
            ? `В наличии ${offer.availableQuantity} ${unit}`
            : `Доступно только ${offer.availableQuantity} ${unit} — меньше, чем в заказе`}
        </span>
      </div>

      {/* Доставка */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs sm:max-w-[15rem]">
        <span className="flex items-start gap-1.5 font-semibold text-foreground">
          <Truck className="mt-px h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="min-w-0">{offer.deliveryLabel}</span>
        </span>
        <span className="text-muted-foreground">
          {deliveryDateLabel(offer.deliveryDays)} ·{" "}
          {deliveryDaysLabel(offer.deliveryDays)}
        </span>
        <span
          className={cn(
            offer.deliveryCost > 0 ? "text-muted-foreground" : "text-success-foreground"
          )}
        >
          {deliveryCostLabel(offer.deliveryCost)}
        </span>
      </div>

      {/* Цена и выбор */}
      <div className="flex flex-col items-start gap-1.5 sm:w-52 sm:items-end">
        <div className="flex flex-wrap items-baseline gap-2 sm:justify-end">
          <span className="text-lg font-bold tracking-tight text-foreground">
            {formatMoney(offer.price)}
          </span>
          {contractPrice !== undefined && deltaPercent !== 0 && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                {formatMoney(contractPrice)}
              </span>
              <Badge tone={deltaPercent < 0 ? "success" : "warning"}>
                {deltaPercent > 0 ? "+" : ""}
                {deltaPercent}%
              </Badge>
            </>
          )}
        </div>

        <span className="text-xs text-muted-foreground sm:text-right">
          {quantity} {unit} с доставкой — {formatMoney(total)} без НДС
        </span>

        <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
          {isCheapest && <Badge tone="success">дешевле всех</Badge>}
          {isFastest && <Badge tone="info">быстрее всех</Badge>}
        </div>

        <Button
          size="sm"
          variant={isSelected ? "secondary" : "primary"}
          icon={isSelected ? Check : undefined}
          className="mt-1 w-full sm:w-auto"
          onClick={() => onSelect(offer.id)}
        >
          {isSelected ? "Выбрано" : "Выбрать"}
        </Button>
      </div>
    </li>
  );
}
