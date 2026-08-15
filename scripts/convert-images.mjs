// Автоконвертация фото автопарка в AVIF и WebP.
// Проходит по src/assets, создаёт .avif и .webp рядом с исходником,
// пропускает уже актуальные файлы. Запуск: node scripts/convert-images.mjs
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ASSETS_DIR = path.resolve(process.cwd(), "src/assets");
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png"]);

// Качество подобрано под фото автомобилей: визуально без потерь, но легче JPEG.
export const QUALITY = {
  avif: { quality: 55, effort: 4, chromaSubsampling: "4:4:4" },
  webp: { quality: 82, effort: 4 },
};

const mtime = async (file) => {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return 0;
  }
};

export async function convertAssets({ log = () => {} } = {}) {
  let entries = [];
  try {
    entries = await readdir(ASSETS_DIR);
  } catch {
    return { converted: 0 };
  }

  const sources = entries.filter((f) => SOURCE_EXT.has(path.extname(f).toLowerCase()));
  let converted = 0;

  for (const file of sources) {
    const src = path.join(ASSETS_DIR, file);
    const base = src.replace(/\.(jpe?g|png)$/i, "");
    const srcTime = await mtime(src);

    for (const format of ["avif", "webp"]) {
      const out = `${base}.${format}`;
      if ((await mtime(out)) >= srcTime) continue;
      const buf = await sharp(src).toFormat(format, QUALITY[format]).toBuffer();
      await writeFile(out, buf);
      converted += 1;
      log(`[images] ${path.basename(out)}`);
    }
  }

  return { converted };
}

/** Vite-плагин: конвертирует при старте и при появлении новых фото. */
export function autoImageFormats() {
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      const { converted } = await convertAssets({ log: (m) => console.log(m) });
      if (converted) console.log(`[images] сконвертировано файлов: ${converted}`);
    } catch (e) {
      console.warn("[images] конвертация не удалась:", e.message);
    } finally {
      running = false;
    }
  };

  return {
    name: "auto-image-formats",
    async buildStart() {
      await run();
    },
    configureServer(server) {
      const onChange = (file) => {
        if (file.includes(`${path.sep}src${path.sep}assets${path.sep}`) && SOURCE_EXT.has(path.extname(file).toLowerCase())) {
          run();
        }
      };
      server.watcher.on("add", onChange);
      server.watcher.on("change", onChange);
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { converted } = await convertAssets({ log: (m) => console.log(m) });
  console.log(`[images] готово, сконвертировано: ${converted}`);
}
