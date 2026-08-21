import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Денежный формат тенге: 1 234 567 ₸ (без копеек — закупочные суммы крупные). */
export function formatMoney(value: number): string {
  return `${new Intl.NumberFormat("ru-KZ", {
    maximumFractionDigits: 0,
  }).format(value)} ₸`;
}

/**
 * Адрес файла из public с учётом подпути публикации: на GitHub Pages
 * приложение живёт в /kazmys/, поэтому «/products/x.jpg» сам по себе
 * не открылся бы.
 */
export function assetUrl(path: string): string {
  // Вне Vite (тесты, серверный рендер) base неизвестен — считаем его корнем.
  const base = import.meta.env?.BASE_URL ?? "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

/** Короткая дата: 19.08.2026. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ru-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

/** Дата со временем — для истории статусов заказа. */
export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ru-KZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
