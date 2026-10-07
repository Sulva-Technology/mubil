"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/content";
import { EASE } from "@/lib/motion";

type Props = {
  items: GalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const MAX_SCALE = 4;

/**
 * Full-screen viewer. Keyboard: arrows and Escape. Touch: swipe to change,
 * pinch or double-tap to zoom, drag to pan while zoomed.
 */
export default function Lightbox({ items, index, onIndexChange, onClose }: Props) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(0);
  const [zoom, setZoom] = useState({ scale: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{ startDist: number; startScale: number; startX: number; startY: number; panX: number; panY: number; lastTap: number }>({
    startDist: 0,
    startScale: 1,
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
    lastTap: 0,
  });

  const item = items[index];
  const count = items.length;

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setZoom({ scale: 1, x: 0, y: 0 });
      onIndexChange((index + step + count) % count);
    },
    [index, count, onIndexChange],
  );

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "Tab" && dialogRef.current) {
        const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button"));
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [go, onClose]);

  function onPointerDown(e: ReactPointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      g.startDist = Math.hypot(a.x - b.x, a.y - b.y);
      g.startScale = zoom.scale;
    } else {
      g.startX = e.clientX;
      g.startY = e.clientY;
      g.panX = zoom.x;
      g.panY = zoom.y;
      const now = Date.now();
      if (now - g.lastTap < 280) setZoom((z) => (z.scale > 1 ? { scale: 1, x: 0, y: 0 } : { scale: 2.5, x: 0, y: 0 }));
      g.lastTap = now;
    }
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const scale = Math.min(MAX_SCALE, Math.max(1, (g.startScale * dist) / g.startDist));
      setZoom((z) => (scale === 1 ? { scale: 1, x: 0, y: 0 } : { ...z, scale }));
    } else if (zoom.scale > 1) {
      setZoom((z) => ({ ...z, x: g.panX + (e.clientX - g.startX), y: g.panY + (e.clientY - g.startY) }));
    }
  }

  function onPointerUp(e: ReactPointerEvent) {
    const g = gesture.current;
    const wasSingle = pointers.current.size === 1;
    pointers.current.delete(e.pointerId);
    if (!wasSingle || zoom.scale > 1) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  }

  const slide = reduce ? 0 : 60;

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[95] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div aria-hidden className="absolute inset-0 bg-night/90 backdrop-blur-xl" onClick={onClose} />

      <div
        className="relative flex flex-1 touch-none items-center justify-center overflow-hidden px-4 pb-36 pt-6 md:px-20 md:pb-32"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.figure
            key={item.src}
            custom={direction}
            initial={{ opacity: 0, x: direction * slide }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * slide }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative h-full w-full"
          >
            <div
              className="relative h-full w-full transition-transform duration-200 ease-out"
              style={{ transform: `translate3d(${zoom.x}px, ${zoom.y}px, 0) scale(${zoom.scale})` }}
            >
              <Image src={item.src} alt={item.alt} fill sizes="100vw" className="select-none object-contain" draggable={false} priority />
            </div>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <p className="max-w-xl text-center text-small text-white/85" aria-live="polite">
          {item.caption}
        </p>
        <div className="glass glass-dark pointer-events-auto flex items-center gap-1 rounded-full p-1.5">
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10">
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <span className="min-w-16 text-center text-small font-medium tabular-nums text-white/85">
            {index + 1} / {count}
          </span>
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10">
            <ChevronRight aria-hidden className="size-5" />
          </button>
          <span aria-hidden className="mx-1 h-6 w-px bg-white/15" />
          <button type="button" data-autofocus onClick={onClose} aria-label="Close viewer" className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10">
            <X aria-hidden className="size-5" />
          </button>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
