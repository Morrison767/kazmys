/**
 * Загрузка фотографий товаров из Wikimedia Commons.
 *
 * Берутся только файлы под свободными лицензиями (public domain, CC0,
 * CC BY, CC BY-SA). Для каждого файла сохраняется атрибуция —
 * public/products/ATTRIBUTION.md: CC BY-SA требует указания автора,
 * а PD/CC0 — нет, но источник всё равно полезно знать.
 *
 * Запуск: node scripts/fetch-images.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const API = "https://commons.wikimedia.org/w/api.php";
const OUT_DIR = "public/products";
const WIDTH = 640;

/** Позиция каталога → поисковый запрос по Commons. */
const TARGETS = [
  { productId: "prd-instrumenty-i-003", file: "manometr", query: "pressure gauge manometer" },
  { productId: "prd-instrumenty-i-016", file: "trehcotka", query: "socket wrench ratchet tool" },
  { productId: "prd-instrumenty-i-007", file: "sverlo", query: "drill bit metal" },
  { productId: "prd-instrumenty-i-024", file: "napilnik", query: "file tool metalworking" },
  { productId: "prd-rashodnye-materialy-019", file: "elektrody", query: "welding electrodes" },
  { productId: "prd-rashodnye-materialy-010", file: "krug-shlif", query: "grinding wheel abrasive" },
  { productId: "prd-specodezhda-i-011", file: "botinki", query: "safety boots work" },
  { productId: "prd-specodezhda-i-013", file: "sapogi", query: "rubber boots" },
  { productId: "prd-hozyaystvennye-ofisnye-019", file: "kartridzh", query: "laser printer toner cartridge" },
  { productId: "prd-hozyaystvennye-ofisnye-005", file: "papka", query: "ring binder office folder" },
  { productId: "prd-metizy-i-001", file: "bolt", query: "hex bolt steel fastener" },
  { productId: "prd-elektrotehnika-i-001", file: "vyklyuchatel", query: "miniature circuit breaker DIN rail" },
];

/** Лицензии, которые можно использовать в прототипе. */
const ALLOWED = [
  /^cc0/i,
  /^cc[- ]by([- ]sa)?([- ]\d)?/i,
  /public domain/i,
  /^pd/i,
];

const isAllowed = (license) =>
  Boolean(license) && ALLOWED.some((re) => re.test(license));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Commons ограничивает частоту запросов (HTTP 429), поэтому запросы идут
 * с паузой и повторными попытками с увеличением задержки.
 */
async function fetchWithRetry(url, attempts = 4) {
  let delay = 2000;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, {
      headers: { "User-Agent": "kazakhmys-marketplace-prototype/1.0 (demo)" },
    });
    if (response.ok) return response;
    if (response.status !== 429 || attempt === attempts) {
      throw new Error(`HTTP ${response.status}`);
    }
    await sleep(delay);
    delay *= 2;
  }
  throw new Error("не удалось получить ответ");
}

async function searchImage(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "12",
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: String(WIDTH),
    format: "json",
    origin: "*",
  });

  const response = await fetchWithRetry(`${API}?${params}`);
  const data = await response.json();
  const pages = Object.values(data.query?.pages ?? {});

  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info || !info.thumburl) continue;
    if (!/^image\/(jpeg|png)$/.test(info.mime ?? "")) continue;
    const meta = info.extmetadata ?? {};
    const license = meta.LicenseShortName?.value;
    if (!isAllowed(license)) continue;
    return {
      title: page.title,
      thumbUrl: info.thumburl,
      descriptionUrl: info.descriptionurl,
      license,
      author: (meta.Artist?.value ?? "")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    };
  }
  return null;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const attribution = [];
  const mapping = {};
  // Уже загруженные файлы не тянем повторно: Commons быстро включает лимит.
  const previous = existsSync("data/product-images.json")
    ? JSON.parse(readFileSync("data/product-images.json", "utf8"))
    : {};
  const previousAttribution = existsSync(`${OUT_DIR}/attribution.json`)
    ? JSON.parse(readFileSync(`${OUT_DIR}/attribution.json`, "utf8"))
    : [];

  for (const target of TARGETS) {
    const existing = previous[target.productId];
    if (existing && existsSync(`public${existing}`)) {
      mapping[target.productId] = existing;
      const saved = previousAttribution.find((a) => a.productId === target.productId);
      if (saved) {
        attribution.push(saved);
        console.log(`  ${existing} — уже загружено`);
        continue;
      }
      // Файл есть, а атрибуции нет — добираем метаданные без повторной загрузки.
      try {
        await sleep(1500);
        const found = await searchImage(target.query);
        if (found) {
          attribution.push({
            file: existing.replace("/products/", ""),
            productId: target.productId,
            title: found.title,
            license: found.license,
            author: found.author || "не указан",
            source: found.descriptionUrl,
          });
          console.log(`  ${existing} — атрибуция восстановлена`);
        }
      } catch (error) {
        console.warn(`  ${target.file}: атрибуцию получить не удалось (${error.message})`);
      }
      continue;
    }
    try {
      await sleep(1500);
      const found = await searchImage(target.query);
      if (!found) {
        console.warn(`  ${target.file}: подходящего файла не нашлось`);
        continue;
      }
      const extension = found.thumbUrl.toLowerCase().includes(".png")
        ? "png"
        : "jpg";
      const fileName = `${target.file}.${extension}`;
      const image = await fetchWithRetry(found.thumbUrl);
      const buffer = Buffer.from(await image.arrayBuffer());
      writeFileSync(`${OUT_DIR}/${fileName}`, buffer);

      mapping[target.productId] = `/products/${fileName}`;
      attribution.push({
        file: fileName,
        productId: target.productId,
        title: found.title,
        license: found.license,
        author: found.author || "не указан",
        source: found.descriptionUrl,
      });
      console.log(
        `  ${fileName} ← ${found.title} (${found.license}, ${Math.round(buffer.length / 1024)} КБ)`
      );
    } catch (error) {
      console.warn(`  ${target.file}: ${error.message}`);
    }
  }

  const md = [
    "# Источники изображений товаров",
    "",
    "Фотографии загружены из Wikimedia Commons под свободными лицензиями",
    "скриптом `scripts/fetch-images.mjs`. В источнике номенклатуры (SMAT)",
    "изображений нет; в проде фото приходят из каталога поставщика",
    "по рамочному договору.",
    "",
    "| Файл | Позиция | Лицензия | Автор | Источник |",
    "|---|---|---|---|---|",
    ...attribution.map(
      (a) =>
        `| ${a.file} | ${a.productId} | ${a.license} | ${a.author} | [Commons](${a.source}) |`
    ),
    "",
  ].join("\n");

  writeFileSync(`${OUT_DIR}/ATTRIBUTION.md`, md, "utf8");
  writeFileSync(
    `${OUT_DIR}/attribution.json`,
    `${JSON.stringify(attribution, null, 2)}
`,
    "utf8"
  );
  writeFileSync(
    "data/product-images.json",
    `${JSON.stringify(mapping, null, 2)}\n`,
    "utf8"
  );

  console.log(
    `\nГотово: ${attribution.length} фото → ${OUT_DIR}, карта → data/product-images.json`
  );
}

main().catch((error) => {
  console.error("Загрузка изображений не удалась:", error.message);
  process.exit(1);
});
