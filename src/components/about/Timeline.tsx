"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

type Milestone = { year: string; text: string };

/** Vertical line that draws itself as you scroll through the milestones. */
export function Timeline({ items }: { items: ReadonlyArray<Milestone> }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  if (items.length === 0) return null;

  return (
    <ol ref={ref} className="relative ml-2 md:ml-0">
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line md:left-1/2" />
      <motion.span
        aria-hidden
        data-reveal
        style={{ scaleY }}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-brand to-aqua md:left-1/2"
      />
      {items.map((item, i) => (
        <li
          key={item.year}
          className={
            "relative grid gap-1 pb-12 pl-10 last:pb-0 md:w-1/2 md:pl-0 " +
            (i % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14")
          }
        >
          <span
            aria-hidden
            className={
              "absolute left-0 top-1.5 size-[15px] rounded-full border-[3px] border-bg bg-brand shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_18%,transparent)] " +
              (i % 2 === 0 ? "md:left-auto md:right-[-7.5px]" : "md:left-[-7.5px]")
            }
          />
          <span className="font-display text-h3 font-semibold text-brand">{item.year}</span>
          <span className="text-ink-2 md:text-body">{item.text}</span>
        </li>
      ))}
    </ol>
  );
}
