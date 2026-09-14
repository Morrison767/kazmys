import path from "node:path";
import { copyFileSync, writeFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 * Прототип публикуется на GitHub Pages по адресу
 * https://morrison767.github.io/kazmys/, поэтому в прод-сборке base — подпуть
 * репозитория. Локальная разработка идёт с корня, чтобы адреса были короче.
 * Переопределить можно переменной VITE_BASE (например, для другого хостинга).
 */
const PAGES_BASE = "/kazmys/";

/**
 * GitHub Pages — статика без сервера: по неизвестному пути отдаётся 404.html.
 * Кладём туда копию index.html, чтобы прямые ссылки вида /orders/ord-011
 * открывали приложение, а маршрут разбирал уже роутер.
 * .nojekyll отключает обработку Jekyll — она может съедать служебные файлы.
 */
function spaFallback(): Plugin {
  return {
    name: "spa-fallback-for-pages",
    apply: "build",
    closeBundle() {
      copyFileSync("dist/index.html", "dist/404.html");
      writeFileSync("dist/.nojekyll", "");
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE ?? (mode === "production" ? PAGES_BASE : "/"),
  plugins: [react(), spaFallback()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    // host: true — сервер слушает все интерфейсы, а не только localhost:
    // прототип открывается с других машин в сети (демо с ноутбука заказчика).
    host: true,
    port: 5173,
    open: false,
  },
}));
