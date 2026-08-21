/**
 * Импорт выборки каталога из SMAT (https://smat.amvp.kz).
 *
 * Источник — номенклатура склада Казахмыса, разложенная по трёхуровневому
 * дереву: 25 разделов L1 → 543 группы L2 → 5055 видов L3.
 * Скрипт берёт заданные разделы, внутри каждого — по несколько групп и видов,
 * и по 2–3 позиции в каждом виде, после чего сохраняет выборку в
 * data/smat-selection.json.
 *
 * Из источника берутся только названия и структура категорий. Номенклатурные
 * коды не выгружаются: артикулы для прототипа генерируются (см.
 * scripts/generate-catalog.mjs) — внутренние коды не должны попадать
 * в публичный репозиторий.
 *
 * Запуск: node scripts/import-smat.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";

const API = "https://smat.amvp.kz/api/projects/2";

/** Разделы L1, которые ложатся на этапность категорий из концепции. */
const WANTED_ROOTS = [
  "Хозяйственные, офисные и канцелярские товары",
  "Спецодежда и средства защиты",
  "Инструменты и измерительная техника",
  "Расходные материалы и оснастка",
  "Метизы и крепежные изделия",
  "Электротехника и автоматизация",
];

const GROUPS_PER_ROOT = 3;
const KINDS_PER_GROUP = 3;
const PRODUCTS_PER_KIND = 3;

/** Заблокированные карточки номенклатуры — в каталог прототипа не идут. */
const BLOCKED = /^\s*НЕ\s*ИСПОЛЬЗОВАТЬ/i;

/** Слишком короткие и слишком длинные названия читаются плохо. */
const MIN_NAME = 8;
const MAX_NAME = 90;

async function get(path) {
  const response = await fetch(`${API}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`${path} → HTTP ${response.status}`);
  }
  return response.json();
}

/** Название пригодно для витрины: не заблокировано, читаемой длины, без мусора. */
function isUsableName(name) {
  if (!name || BLOCKED.test(name)) return false;
  const clean = name.trim();
  if (clean.length < MIN_NAME || clean.length > MAX_NAME) return false;
  // Позиции вида «ЛЕНТА 1459119» — только код без содержания.
  if (/^[А-ЯЁA-Z]+\s+\d{5,}$/.test(clean)) return false;
  return true;
}

/** Ключ для отсева near-дублей: буквы и цифры названия без пробелов. */
function dedupeKey(name) {
  return name.toUpperCase().replace(/[^А-ЯЁA-Z0-9]/g, "");
}

async function pickProducts(kindId) {
  const data = await get(`/category/${kindId}/products?limit=60`);
  const seen = new Set();
  const picked = [];

  for (const item of data.items ?? []) {
    if (!isUsableName(item.name)) continue;
    const key = dedupeKey(item.name);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push({
      sourceName: item.name.trim(),
      sourceDescription: (item.description ?? "").trim(),
    });
    if (picked.length >= PRODUCTS_PER_KIND) break;
  }
  return picked;
}

async function main() {
  console.log("Загружаю дерево категорий SMAT…");
  const tree = await get("/tree");

  const selection = { source: API, importedAt: null, roots: [] };

  for (const rootName of WANTED_ROOTS) {
    const root = tree.roots.find((r) => r.name === rootName);
    if (!root) {
      console.warn(`  раздел «${rootName}» не найден — пропускаю`);
      continue;
    }

    // Берём самые наполненные группы и виды: в них номенклатура живая.
    const groups = [...root.children]
      .sort((a, b) => b.total_count - a.total_count)
      .slice(0, GROUPS_PER_ROOT);

    const rootOut = {
      name: root.name,
      productsInSource: root.total_count,
      groups: [],
    };

    for (const group of groups) {
      const kinds = [...group.children]
        .sort((a, b) => b.own_count - a.own_count)
        .slice(0, KINDS_PER_GROUP);

      const groupOut = {
        name: group.name,
        productsInSource: group.total_count,
        kinds: [],
      };

      for (const kind of kinds) {
        const products = await pickProducts(kind.id);
        if (products.length === 0) {
          console.warn(`    вид «${kind.name}»: пригодных позиций нет`);
          continue;
        }
        groupOut.kinds.push({
          name: kind.name,
          productsInSource: kind.own_count,
          products,
        });
        console.log(
          `  ${root.name} / ${group.name} / ${kind.name}: ${products.length}`
        );
      }

      if (groupOut.kinds.length > 0) rootOut.groups.push(groupOut);
    }

    selection.roots.push(rootOut);
  }

  const total = selection.roots.reduce(
    (sum, r) =>
      sum +
      r.groups.reduce(
        (s, g) => s + g.kinds.reduce((k, kind) => k + kind.products.length, 0),
        0
      ),
    0
  );

  mkdirSync("data", { recursive: true });
  writeFileSync(
    "data/smat-selection.json",
    `${JSON.stringify(selection, null, 2)}\n`,
    "utf8"
  );

  console.log(
    `\nГотово: разделов ${selection.roots.length}, позиций ${total} → data/smat-selection.json`
  );
}

main().catch((error) => {
  console.error("Импорт не удался:", error.message);
  process.exit(1);
});
