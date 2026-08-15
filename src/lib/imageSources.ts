// Современные форматы (AVIF/WebP) для тяжёлых фото автопарка.
// Ключ — обычный jpg-URL, значение — облегчённые варианты для <picture>.
import rr1 from "@/assets/rangerover-1.jpg";
import rr2 from "@/assets/rangerover-2.jpg";
import rr3 from "@/assets/rangerover-3.jpg";
import rr4 from "@/assets/rangerover-4.jpg";
import rr5 from "@/assets/rangerover-5.jpg";
import rr6 from "@/assets/rangerover-6.jpg";

import rr1Avif from "@/assets/rangerover-1.avif";
import rr2Avif from "@/assets/rangerover-2.avif";
import rr3Avif from "@/assets/rangerover-3.avif";
import rr4Avif from "@/assets/rangerover-4.avif";
import rr5Avif from "@/assets/rangerover-5.avif";
import rr6Avif from "@/assets/rangerover-6.avif";

import rr1Webp from "@/assets/rangerover-1.webp";
import rr2Webp from "@/assets/rangerover-2.webp";
import rr3Webp from "@/assets/rangerover-3.webp";
import rr4Webp from "@/assets/rangerover-4.webp";
import rr5Webp from "@/assets/rangerover-5.webp";
import rr6Webp from "@/assets/rangerover-6.webp";

export type ModernSources = { avif: string; webp: string };

export const modernSources: Record<string, ModernSources> = {
  [rr1]: { avif: rr1Avif, webp: rr1Webp },
  [rr2]: { avif: rr2Avif, webp: rr2Webp },
  [rr3]: { avif: rr3Avif, webp: rr3Webp },
  [rr4]: { avif: rr4Avif, webp: rr4Webp },
  [rr5]: { avif: rr5Avif, webp: rr5Webp },
  [rr6]: { avif: rr6Avif, webp: rr6Webp },
};

/** Лучший доступный формат для программной предзагрузки (new Image()). */
export const bestSource = (src: string) => modernSources[src]?.avif ?? src;
