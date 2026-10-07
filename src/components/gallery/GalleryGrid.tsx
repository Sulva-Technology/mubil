"use client";

import dynamic from "next/dynamic";
import Image from "@/components/ui/Img";
import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Expand } from "lucide-react";
import type { GalleryItem } from "@/content";
import { cn } from "@/lib/cn";

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

/** Album chips, masonry grid and a lazily loaded lightbox. */
export function GalleryGrid({ items, albums }: { items: GalleryItem[]; albums: ReadonlyArray<string> }) {
  const [album, setAlbum] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const visible = album ? items.filter((i) => i.album === album) : items;
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <div role="group" aria-label="Filter by album" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {[null, ...albums].map((a) => {
          const active = a === album;
          return (
            <button
              key={a ?? "all"}
              type="button"
              aria-pressed={active}
              onClick={() => setAlbum(a)}
              className={cn(
                "h-10 shrink-0 rounded-chip px-4 text-small font-medium transition-colors duration-300",
                active ? "bg-brand text-white shadow-glow" : "glass text-ink hover:bg-white/80",
              )}
            >
              {a ?? "All photos"}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} photos
      </p>

      <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visible.map((item, i) => (
          <li key={item.src} className="mb-5 break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-card bg-ice text-left"
              aria-label={`Open photo: ${item.caption}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width * 400}
                height={item.height * 400}
                sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-night/70 to-transparent p-4 pt-12 text-small font-medium text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.caption}
                <Expand aria-hidden className="size-4 shrink-0" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && <Lightbox items={visible} index={open} onIndexChange={setOpen} onClose={close} />}
      </AnimatePresence>
    </>
  );
}
