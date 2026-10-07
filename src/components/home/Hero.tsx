"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import { home } from "@/content";
import { EASE } from "@/lib/motion";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glass } from "@/components/ui/Glass";
import { SmartImage } from "@/components/ui/SmartImage";

const { hero } = home;
const words = hero.headline.split(" ");

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.7, ease: EASE, delay },
});

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const wordsDone = 0.15 + words.length * 0.06;

  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
      <AmbientBackground />
      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <motion.div data-reveal {...fadeUp(0)}>
          <Eyebrow className="mb-6">{hero.eyebrow}</Eyebrow>
        </motion.div>

        <h1 className="max-w-[13ch] text-hero font-semibold text-ink" aria-label={hero.headline}>
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              aria-hidden
              data-reveal
              className="inline-block whitespace-pre"
              {...fadeUp(0.15 + i * 0.06)}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p
          data-reveal
          className="measure mt-8 text-[1.125rem] text-ink-2 md:text-[1.3125rem] md:leading-relaxed"
          {...fadeUp(wordsDone)}
        >
          {hero.supporting}
        </motion.p>

        <motion.div data-reveal className="mt-10 flex flex-wrap justify-center gap-3" {...fadeUp(wordsDone + 0.1)}>
          <Button href="/contact" size="lg">
            Get involved
          </Button>
          <Button href="/programmes" variant="secondary" size="lg">
            See our work
          </Button>
        </motion.div>
      </div>

      <div className="container-page relative z-10 mt-14 md:mt-20">
        <motion.div ref={imageRef} data-reveal style={{ scale }} className="relative origin-top">
          <SmartImage
            src={hero.image}
            alt={hero.imageAlt}
            ratio="none"
            rounded="panel"
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            wrapperClassName="aspect-[4/5] sm:aspect-[16/9] shadow-lift"
          />
          <Glass
            variant="strong"
            className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full py-2 pl-3 pr-4 text-small font-medium text-ink md:bottom-6 md:left-6"
          >
            <MapPin aria-hidden className="size-4 text-brand" strokeWidth={2} />
            <span>{hero.caption.location}</span>
            <span aria-hidden className="h-3.5 w-px bg-ink/20" />
            <span className="text-ink-2">{hero.caption.year}</span>
          </Glass>
        </motion.div>
      </div>
    </section>
  );
}
