import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, EmptyState, Tile } from "@/components/ui";

/**
 * Единая заглушка страницы для Этапа 0: заголовок раздела, план наполнения
 * и пустое состояние. Бизнес-логика приходит на следующих этапах.
 */
export function StubPage({
  title,
  description,
  icon,
  plan,
  stageNote,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  /** Что появится на экране на следующих этапах. */
  plan: string[];
  /** Пометка об этапе, на котором наполняется экран. */
  stageNote?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />

      {plan.length > 0 && (
        <Card>
          <h2 className="text-base font-bold tracking-tight text-foreground">
            Что будет на экране
          </h2>
          {stageNote && (
            <p className="mt-1 text-sm text-muted-foreground">{stageNote}</p>
          )}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plan.map((item, i) => (
              <Tile key={item} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="min-w-0 text-sm text-foreground">{item}</p>
              </Tile>
            ))}
          </div>
        </Card>
      )}

      {children ?? (
        <EmptyState
          icon={icon}
          title={`Раздел «${title}»`}
          description="Каркас, навигация и типы данных готовы. Наполнение экрана — на следующих этапах прототипа."
        />
      )}
    </div>
  );
}
