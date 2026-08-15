// Современные форматы (AVIF/WebP) для фото автопарка.
// Карта строится автоматически из src/assets — вручную ничего добавлять не нужно:
// достаточно положить новый .jpg/.png, конвертация в AVIF/WebP выполняется скриптом
// scripts/convert-images.mjs (запускается автоматически через vite-плагин).

const jpegs = import.meta.glob("@/assets/*.{jpg,jpeg,png}", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const avifs = import.meta.glob("@/assets/*.avif", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const webps = import.meta.glob("@/assets/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

const keyOf = (p: string) => p.replace(/\.[^.]+$/, "");

const avifByKey = Object.fromEntries(Object.entries(avifs).map(([p, url]) => [keyOf(p), url]));
const webpByKey = Object.fromEntries(Object.entries(webps).map(([p, url]) => [keyOf(p), url]));

export type ModernSources = { avif?: string; webp?: string };

export const modernSources: Record<string, ModernSources> = Object.fromEntries(
  Object.entries(jpegs)
    .map(([p, url]) => {
      const k = keyOf(p);
      const variants: ModernSources = {};
      if (avifByKey[k]) variants.avif = avifByKey[k];
      if (webpByKey[k]) variants.webp = webpByKey[k];
      return [url, variants] as const;
    })
    .filter(([, v]) => v.avif || v.webp),
);

/** Лучший доступный формат для программной предзагрузки (new Image()). */
export const bestSource = (src: string) => modernSources[src]?.avif ?? modernSources[src]?.webp ?? src;
