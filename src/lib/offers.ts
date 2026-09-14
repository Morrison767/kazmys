import type { ProductOffer } from "@/types";

/**
 * Витрина предложений продавцов (выбор «откуда заказать»).
 *
 * Модель закупа у ТД остаётся прежней: основной канал — рамочный договор
 * категории, поэтому договорное предложение всегда стоит первым и помечено,
 * а внешние маркетплейсы показываются рядом для сравнения цены и срока.
 * Здесь только расчёты — компонент получает готовые строки и подписи.
 */

export type OfferSort = "price" | "delivery";

/** Фильтр по сроку поставки — аналог чипов «Сегодня / До 2 дней». */
export interface DeliveryFilter {
  id: string;
  label: string;
  /** Максимальный срок поставки, дней; undefined — без ограничения. */
  maxDays?: number;
}

export const DELIVERY_FILTERS: DeliveryFilter[] = [
  { id: "all", label: "Все сроки" },
  { id: "d3", label: "До 3 дней", maxDays: 3 },
  { id: "d7", label: "До недели", maxDays: 7 },
  { id: "d14", label: "До 2 недель", maxDays: 14 },
];

/** Строка списка: предложение плюс всё, что показывается рядом с ним. */
export interface OfferView {
  offer: ProductOffer;
  /** Отклонение от договорной цены, % (отрицательное — дешевле). */
  deltaPercent: number;
  /** Цена договора для зачёркнутой строки; undefined у самого договора. */
  contractPrice?: number;
  /** Итог за количество: цена × количество + доставка, ₸ без НДС. */
  total: number;
  /** Самое дешёвое предложение позиции. */
  isCheapest: boolean;
  /** Самая быстрая поставка. */
  isFastest: boolean;
  /** Количества в наличии хватает на заказ. */
  isEnough: boolean;
}

/** Отклонение цены предложения от договорной, % (округление до целых). */
export function priceDeltaPercent(
  price: number,
  contractPrice: number
): number {
  if (contractPrice <= 0) return 0;
  return Math.round(((price - contractPrice) / contractPrice) * 100);
}

/**
 * Сортировка предложений: договорное всегда сверху (основной канал закупа),
 * остальные — по цене или по сроку поставки.
 */
export function sortOffers(
  offers: ProductOffer[],
  sort: OfferSort
): ProductOffer[] {
  return [...offers].sort((a, b) => {
    if (a.isContract !== b.isContract) return a.isContract ? -1 : 1;
    if (sort === "delivery") {
      return a.deliveryDays - b.deliveryDays || a.price - b.price;
    }
    return a.price - b.price || a.deliveryDays - b.deliveryDays;
  });
}

/** Предложения, укладывающиеся в выбранный срок поставки. */
export function filterByDelivery(
  offers: ProductOffer[],
  filter: DeliveryFilter
): ProductOffer[] {
  if (filter.maxDays === undefined) return offers;
  return offers.filter((o) => o.deliveryDays <= filter.maxDays!);
}

/** Сколько предложений попадёт в фильтр — для счётчика на чипе. */
export function countByDelivery(
  offers: ProductOffer[],
  filter: DeliveryFilter
): number {
  return filterByDelivery(offers, filter).length;
}

/**
 * Готовые строки списка: бейджи «дешевле всех» и «быстрее всех» считаются
 * по всем предложениям позиции, а не по отфильтрованным, — иначе подпись
 * меняла бы смысл от переключения фильтра.
 */
export function buildOfferViews(
  offers: ProductOffer[],
  quantity: number,
  allOffers: ProductOffer[] = offers
): OfferView[] {
  const contractPrice =
    allOffers.find((o) => o.isContract)?.price ?? offers[0]?.price ?? 0;
  const minPrice = Math.min(...allOffers.map((o) => o.price));
  const minDays = Math.min(...allOffers.map((o) => o.deliveryDays));

  return offers.map((offer) => ({
    offer,
    deltaPercent: offer.isContract
      ? 0
      : priceDeltaPercent(offer.price, contractPrice),
    contractPrice: offer.isContract ? undefined : contractPrice,
    total: offer.price * quantity + offer.deliveryCost,
    isCheapest: offer.price === minPrice,
    isFastest: offer.deliveryDays === minDays,
    isEnough: offer.availableQuantity >= quantity,
  }));
}

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/**
 * Когда привезёт: «завтра», «послезавтра» или «чт, 24 сентября».
 * Дата считается от текущего дня, а не хранится в данных, — в демо срок
 * всегда выглядит актуальным.
 */
export function deliveryDateLabel(days: number, from: Date = new Date()): string {
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  date.setDate(date.getDate() + days);

  if (days <= 0) return "сегодня";
  if (days === 1) return "завтра";
  if (days === 2) return "послезавтра";
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** Срок в днях словами: «за 3 дня», «за 10 дней». */
export function deliveryDaysLabel(days: number): string {
  const mod100 = days % 100;
  const mod10 = days % 10;
  const word =
    mod100 >= 11 && mod100 <= 14 ? "дней" : mod10 === 1 ? "день" : mod10 >= 2 && mod10 <= 4 ? "дня" : "дней";
  return `за ${days} ${word}`;
}

/** «2 предложения», «5 предложений» — подпись счётчика в сетке каталога. */
export function offersCountLabel(count: number): string {
  const mod100 = count % 100;
  const mod10 = count % 10;
  const word =
    mod100 >= 11 && mod100 <= 14
      ? "предложений"
      : mod10 === 1
        ? "предложение"
        : mod10 >= 2 && mod10 <= 4
          ? "предложения"
          : "предложений";
  return `${count} ${word}`;
}

/** Подпись стоимости доставки. */
export function deliveryCostLabel(cost: number): string {
  return cost > 0 ? `доставка ${cost} ₸` : "бесплатно";
}
