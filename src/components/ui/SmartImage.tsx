import Image from "@/components/ui/Img";
import type { ImageProps } from "next/image";
import { cn } from "@/lib/cn";

/** Soft brand-tinted blur shown while the real image loads. */
const BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="5"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6F0FF"/><stop offset="1" stop-color="#C9DBFF"/></linearGradient></defs><rect width="8" height="5" fill="url(#g)"/></svg>`,
  );

type SmartImageProps = Omit<ImageProps, "fill" | "width" | "height" | "placeholder"> & {
  /**
   * CSS aspect ratio, e.g. "16/9", "4/5", "1/1". Locks layout to avoid shift.
   * Pass "none" to size the wrapper with classes instead (responsive ratios).
   */
  ratio?: string;
  rounded?: "none" | "chip" | "card" | "panel";
  wrapperClassName?: string;
};

const radius = {
  none: "",
  chip: "rounded-chip",
  card: "rounded-card",
  panel: "rounded-panel",
} as const;

/** next/image with a locked aspect ratio and a blur placeholder. */
export function SmartImage({
  ratio = "16/9",
  rounded = "card",
  sizes = "100vw",
  wrapperClassName,
  className,
  alt,
  src,
  blurDataURL,
  ...rest
}: SmartImageProps) {
  const isSvg = typeof src === "string" && src.endsWith(".svg");
  return (
    <div
      className={cn("relative overflow-hidden bg-ice", radius[rounded], wrapperClassName)}
      style={ratio === "none" ? undefined : { aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        placeholder={isSvg ? "empty" : "blur"}
        blurDataURL={blurDataURL ?? BLUR_DATA_URL}
        unoptimized={isSvg}
        className={cn("object-cover", className)}
        {...rest}
      />
    </div>
  );
}
