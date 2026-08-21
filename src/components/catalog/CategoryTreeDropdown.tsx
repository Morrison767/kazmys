import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderTree,
  ListTree,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

/**
 * Дерево категорий каталога в выпадающей панели.
 *
 * Кнопка «Категории» открывает панель поверх контента: раздел → группа → вид,
 * с раскрытием ветвей и числом доступных позиций справа. Так трёхуровневый
 * каталог не занимает место на странице и читается целиком, а не по одному
 * ряду фильтров за раз.
 */
export interface CategorySelection {
  rootId: string | null;
  groupId: string | null;
  kindId: string | null;
}

export const EMPTY_SELECTION: CategorySelection = {
  rootId: null,
  groupId: null,
  kindId: null,
};

interface TreeNode {
  category: Category;
  level: 1 | 2 | 3;
  children: TreeNode[];
  count: number;
}

function buildTree(
  roots: Category[],
  all: Category[],
  countOf: (id: string) => number
): TreeNode[] {
  const childrenOf = (parentId: string, level: 2 | 3): TreeNode[] =>
    all
      .filter((c) => c.parentId === parentId && c.isActive)
      .map((category) => ({
        category,
        level,
        count: countOf(category.id),
        children: level === 2 ? childrenOf(category.id, 3) : [],
      }));

  return roots.map((category) => ({
    category,
    level: 1 as const,
    count: countOf(category.id),
    children: childrenOf(category.id, 2),
  }));
}

/** Выбор узла: раздел/группа/вид по уровню. */
function selectionFor(node: TreeNode, all: Category[]): CategorySelection {
  if (node.level === 1) {
    return { rootId: node.category.id, groupId: null, kindId: null };
  }
  if (node.level === 2) {
    return {
      rootId: node.category.parentId,
      groupId: node.category.id,
      kindId: null,
    };
  }
  const group = all.find((c) => c.id === node.category.parentId);
  return {
    rootId: group?.parentId ?? null,
    groupId: group?.id ?? null,
    kindId: node.category.id,
  };
}

export function CategoryTreeDropdown({
  roots,
  categories,
  selection,
  onSelect,
  countOf,
  totalCount,
  className,
}: {
  /** Разделы, открытые цеху. */
  roots: Category[];
  /** Все категории — из них берутся группы и виды. */
  categories: Category[];
  selection: CategorySelection;
  onSelect: (next: CategorySelection) => void;
  /** Сколько доступных позиций в категории с учётом вложенных. */
  countOf: (categoryId: string) => number;
  totalCount: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const tree = useMemo(
    () => buildTree(roots, categories, countOf),
    [roots, categories, countOf]
  );

  // При открытии раскрываем ветку текущего выбора — она сразу видна.
  useEffect(() => {
    if (!open) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (selection.rootId) next.add(selection.rootId);
      if (selection.groupId) next.add(selection.groupId);
      return [...next];
    });
  }, [open, selection.rootId, selection.groupId]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const allBranchIds = useMemo(() => {
    const ids: string[] = [];
    const walk = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.children.length > 0) {
          ids.push(node.category.id);
          walk(node.children);
        }
      }
    };
    walk(tree);
    return ids;
  }, [tree]);

  const selectedId = selection.kindId ?? selection.groupId ?? selection.rootId;
  const path = [selection.rootId, selection.groupId, selection.kindId]
    .filter((id): id is string => Boolean(id))
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter(Boolean);

  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const choose = (node: TreeNode) => {
    onSelect(selectionFor(node, categories));
    setOpen(false);
  };

  const renderNode = (node: TreeNode) => {
    const isExpanded = expanded.includes(node.category.id);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedId === node.category.id;

    return (
      <li key={node.category.id}>
        <div
          className={cn(
            "flex items-center gap-1 rounded-md pr-2 transition-colors",
            isSelected ? "bg-accent" : "hover:bg-muted",
            node.level === 2 && "ml-4",
            node.level === 3 && "ml-9"
          )}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggle(node.category.id)}
              aria-label={isExpanded ? "Свернуть ветку" : "Развернуть ветку"}
              aria-expanded={isExpanded}
              className="flex h-8 w-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="flex h-8 w-6 shrink-0 items-center justify-center text-muted-foreground">
              ·
            </span>
          )}

          <button
            type="button"
            onClick={() => choose(node)}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 py-1.5 text-left text-sm transition-colors",
              node.level === 1
                ? isSelected
                  ? "font-bold text-foreground"
                  : "font-semibold text-foreground"
                : isSelected
                  ? "font-semibold text-foreground"
                  : "text-foreground"
            )}
          >
            <span className="min-w-0 flex-1 truncate">{node.category.name}</span>
            <span
              className={cn(
                "shrink-0 text-xs tabular-nums",
                node.count === 0 ? "text-muted-foreground" : "text-muted-foreground"
              )}
            >
              {node.count}
            </span>
          </button>
        </div>

        {hasChildren && isExpanded && (
          <ul className="flex flex-col">{node.children.map(renderNode)}</ul>
        )}
      </li>
    );
  };

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="tree"
          className={cn(
            "flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition-colors",
            open
              ? "border-primary/30 bg-accent text-foreground"
              : "border-border bg-card text-foreground hover:bg-muted"
          )}
        >
          <FolderTree className="h-4 w-4 text-primary" />
          Категории
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </button>

        {/* Выбранный путь по дереву */}
        {path.length > 0 ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
            {path.map((name, index) => (
              <span key={name} className="flex items-center gap-1.5">
                {index > 0 && <span>/</span>}
                <span className="text-foreground">{name}</span>
              </span>
            ))}
            <button
              type="button"
              onClick={() => onSelect(EMPTY_SELECTION)}
              className="ml-1 inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              сбросить
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            Все категории цеха · {totalCount} позиций
          </span>
        )}
      </div>

      {open && (
        <div
          role="tree"
          aria-label="Дерево категорий каталога"
          className="animate-fade-in absolute left-0 top-full z-30 mt-2 flex w-[min(560px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setExpanded(allBranchIds)}
                className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <ListTree className="h-3.5 w-3.5 text-muted-foreground" />
                Развернуть всё
              </button>
              <button
                type="button"
                onClick={() => setExpanded([])}
                className="flex h-8 items-center rounded-md px-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Свернуть всё
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть дерево категорий"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[min(60vh,480px)] overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => {
                onSelect(EMPTY_SELECTION);
                setOpen(false);
              }}
              className={cn(
                "mb-1 flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                selectedId === null
                  ? "bg-accent font-semibold text-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              Все категории цеха
              <Badge tone={selectedId === null ? "primary" : "neutral"}>
                {totalCount}
              </Badge>
            </button>

            <ul className="flex flex-col">{tree.map(renderNode)}</ul>
          </div>

          <p className="border-t border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            Раздел → группа → вид. Справа — число позиций, доступных вашему цеху.
          </p>
        </div>
      )}
    </div>
  );
}
