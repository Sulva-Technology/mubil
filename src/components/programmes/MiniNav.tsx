"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";

type Item = { id: string; label: string };

/** Sticky glass mini-nav that highlights the section in view. */
export function MiniNav({ items }: { items: ReadonlyArray<Item> }) {
  const [active, setActive] = useState(items[0]?.id);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-24 z-30 flex justify-center px-4">
      <ul className="glass glass-strong flex gap-1 rounded-full p-1">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative block rounded-full px-4 py-2 text-small font-medium transition-colors duration-300 md:px-5",
                  isActive ? "text-white" : "text-ink-2 hover:text-ink",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="mini-nav-active"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
