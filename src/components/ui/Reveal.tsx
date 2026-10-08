"use client";

import type { ReactNode } from "react";
import { m, type Variants } from "framer-motion";
import { DURATION, EASE, STAGGER } from "@/lib/motion";

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: DURATION.slow, ease: EASE } },
};

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER } },
};

/**
 * Fade + 24px rise + blur-to-sharp once in view. With `stagger`, wrap each
 * child in `RevealItem` and they follow 60ms apart. Under reduced motion,
 * globals.css forces `[data-reveal]` visible, so markup never branches and
 * hydration stays stable.
 */
export function Reveal({ children, className, stagger = false }: { children: ReactNode; className?: string; stagger?: boolean }) {
  return (
    <m.div
      data-reveal
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={stagger ? group : item}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div data-reveal className={className} variants={item}>
      {children}
    </m.div>
  );
}
