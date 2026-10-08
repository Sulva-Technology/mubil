"use client";

import { useEffect, useRef } from "react";

const format = (n: number) => new Intl.NumberFormat("en-GB").format(Math.round(n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Renders the final number on the server (good for SEO and no-JS), then
 * counts up from zero once when scrolled into view. Plain rAF, no libraries.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen at load: leave the final number alone.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    el.textContent = `0${suffix}`;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1600);
          el.textContent = `${format(value * easeOut(t))}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = `${format(value)}${suffix}`;
    };
  }, [value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
      {suffix}
    </span>
  );
}
