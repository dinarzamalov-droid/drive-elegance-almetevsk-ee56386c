import { ImgHTMLAttributes } from "react";
import { modernSources } from "@/lib/imageSources";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  priority?: boolean;
};

/**
 * <picture> с автоматическим выбором формата: AVIF → WebP → JPEG.
 * Браузер сам берёт самый лёгкий поддерживаемый вариант.
 */
const SmartImage = ({ src, alt, priority = false, ...rest }: Props) => {
  const modern = modernSources[src];
  const img = (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...{ fetchpriority: priority ? "high" : "low" }}
      {...rest}
    />
  );

  if (!modern) return img;

  return (
    <picture>
      {modern.avif && <source srcSet={modern.avif} type="image/avif" />}
      {modern.webp && <source srcSet={modern.webp} type="image/webp" />}
      {img}
    </picture>
  );
};

export default SmartImage;
