"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const format = (n: number) => new Intl.NumberFormat("en-GB").format(Math.round(n));

/**
 * Renders the final number on the server (good for SEO and no-JS), then
 * counts up from zero once when scrolled into view.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const primed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView && !primed.current) {
      primed.current = true;
      el.textContent = `0${suffix}`;
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${format(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(value)}
      {suffix}
    </span>
  );
}
