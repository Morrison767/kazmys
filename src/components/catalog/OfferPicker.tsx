import { useState } from "react";
import { ShoppingCart } from "lucide-react";

import { OfferList } from "@/components/catalog/OfferList";
import { QuantityStepper } from "@/components/catalog/QuantityStepper";
import { Button, Modal } from "@/components/ui";
import { formatMoney } from "@/lib/utils";
import type { Product, ProductOffer } from "@/types";

/**
 * Выбор продавца перед добавлением в корзину: «у кого заказываем и сколько».
 *
 * Открывается по кнопке «В корзину» в сетке каталога и по «сменить» в строке
 * корзины — в обоих случаях решение принимается до того, как позиция попадёт
 * в заказ. Родитель монтирует компонент только на время показа, поэтому
 * количество и выбор начинаются с переданных значений без сброса эффектами.
 */
export function OfferPicker({
  product,
  offers,
  initialQuantity = 1,
  initialOfferId,
  confirmLabel = "В корзину",
  onClose,
  onConfirm,
}: {
  product: Product;
  offers: ProductOffer[];
  initialQuantity?: number;
  /** Ранее выбранный продавец; по умолчанию — предложение по договору. */
  initialOfferId?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: (offerId: string, quantity: number) => void;
}) {
  const fallbackId =
    offers.find((o) => o.isContract)?.id ?? offers[0]?.id ?? "";
  const [offerId, setOfferId] = useState(
    offers.some((o) => o.id === initialOfferId) ? initialOfferId! : fallbackId
  );
  const [quantity, setQuantity] = useState(initialQuantity);

  const selected = offers.find((o) => o.id === offerId);
  const total = (selected?.price ?? product.price) * quantity;
  const notEnough = selected ? selected.availableQuantity < quantity : false;

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title="Откуда заказать"
      description={product.name}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button
            icon={ShoppingCart}
            disabled={!selected}
            onClick={() => selected && onConfirm(selected.id, quantity)}
          >
            {confirmLabel} — {formatMoney(total)}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            unit={product.unit}
          />
          <p className="text-xs text-muted-foreground">
            {selected
              ? `${selected.sellerName} · ${formatMoney(selected.price)} за ${product.unit}`
              : "Продавец не выбран"}
          </p>
        </div>

        {/*
          Количество больше остатка не блокирует заказ — позиция уйдёт
          в поставку под заказ, но заказчик должен увидеть это заранее.
        */}
        {notEnough && selected && (
          <p className="rounded-lg border border-warning-border bg-warning-soft px-3 py-2 text-xs text-warning-foreground">
            У продавца {selected.sellerName} свободно{" "}
            {selected.availableQuantity} {product.unit} — остальное придёт
            отдельной поставкой и увеличит срок.
          </p>
        )}

        <OfferList
          offers={offers}
          quantity={quantity}
          unit={product.unit}
          selectedOfferId={offerId}
          onSelect={setOfferId}
        />
      </div>
    </Modal>
  );
}
