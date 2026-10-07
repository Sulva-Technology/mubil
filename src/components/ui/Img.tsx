"use client";

import NextImage, { type ImageLoaderProps, type ImageProps } from "next/image";

/** Unsplash demo photos are resized by Unsplash's CDN instead of our optimizer. */
function unsplashLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  const w = Number(url.searchParams.get("w")) || 0;
  const h = Number(url.searchParams.get("h")) || 0;
  url.searchParams.set("w", String(width));
  if (w && h) url.searchParams.set("h", String(Math.round((width * h) / w)));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  return url.toString();
}

/**
 * Drop-in replacement for next/image. Uploaded images (Supabase Storage)
 * still go through Next's optimizer.
 */
export default function Img(props: ImageProps) {
  const isUnsplash = typeof props.src === "string" && props.src.startsWith("https://images.unsplash.com/");
  return <NextImage loader={isUnsplash ? unsplashLoader : undefined} {...props} />;
}
