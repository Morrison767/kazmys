import { cn } from "@/lib/utils";

/**
 * Скелетон загрузки. Используется, пока подгружается код тяжёлых разделов
 * (аналитика, админ-панель) — вместо пустого экрана показывается каркас
 * той же формы, что и будущий контент.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  );
}

/** Каркас страницы: заголовок, плитки и крупный блок контента. */
export function PageSkeleton({
  tiles = 4,
  blocks = 2,
  label = "Загрузка раздела",
}: {
  tiles?: number;
  blocks?: number;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      {tiles > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: tiles }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-6"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      )}

      {Array.from({ length: blocks }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:p-6"
        >
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-3 w-full max-w-md" />
          <Skeleton className="h-40 w-full" />
        </div>
      ))}

      <span className="sr-only">{label}</span>
    </div>
  );
}
