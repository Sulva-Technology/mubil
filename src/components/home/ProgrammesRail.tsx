"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { programmes } from "@/content";
import { ProgrammeCard } from "@/components/programmes/ProgrammeCard";

/**
 * Desktop: the section pins and vertical scroll drives the rail sideways.
 * Mobile, tablet and reduced motion: a swipeable scroll-snap rail.
 */
export function ProgrammesRail({ header }: { header: ReactNode }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      const track = trackRef.current;
      const enabled = mq.matches && !reduce;
      setPinned(enabled);
      if (!track || !enabled) return setDistance(0);
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="programmes-title"
      className="relative bg-bg"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "section-y"}>
        <div className="container-page">{header}</div>
        <m.div
          ref={trackRef}
          style={pinned ? { x } : undefined}
          className={
            pinned
              ? "mt-12 flex w-max gap-6 pl-[max(32px,calc((100vw-1216px)/2))] pr-[max(32px,calc((100vw-1216px)/2))]"
              : "mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] md:scroll-px-8 md:px-8 [&::-webkit-scrollbar]:hidden"
          }
        >
          {programmes.map((programme) => (
            <ProgrammeCard
              key={programme.slug}
              programme={programme}
              className={
                pinned
                  ? "aspect-[3/4] h-[min(62vh,560px)] shrink-0"
                  : "aspect-[3/4] w-[78vw] max-w-[380px] shrink-0 snap-start"
              }
            />
          ))}
        </m.div>
      </div>
    </section>
  );
}
