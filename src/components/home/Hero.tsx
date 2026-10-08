"use client";

import { useRef, type CSSProperties } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import { home } from "@/content";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glass } from "@/components/ui/Glass";
import { SmartImage } from "@/components/ui/SmartImage";

const { hero } = home;
const words = hero.headline.split(" ");
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;
const wordsDone = 150 + words.length * 60;

/**
 * The text entrance is CSS (see .rise-in in globals.css) so the headline
 * animates on first paint. Only the scroll-linked image scale needs JS.
 */
export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
      <AmbientBackground />
      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <div className="rise-in">
          <Eyebrow className="mb-6">{hero.eyebrow}</Eyebrow>
        </div>

        <h1 className="max-w-[13ch] text-hero font-semibold text-ink">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="rise-in inline-block whitespace-pre" style={delay(150 + i * 60)}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>

        <p className="rise-in measure mt-8 text-[1.125rem] text-ink-2 md:text-[1.3125rem] md:leading-relaxed" style={delay(wordsDone)}>
          {hero.supporting}
        </p>

        <div className="rise-in mt-10 flex flex-wrap justify-center gap-3" style={delay(wordsDone + 100)}>
          <Button href="/contact" size="lg">
            Get involved
          </Button>
          <Button href="/programmes" variant="secondary" size="lg">
            See our work
          </Button>
        </div>
      </div>

      <div className="container-page relative z-10 mt-14 md:mt-20">
        <m.div ref={imageRef} data-reveal style={{ scale }} className="relative origin-top">
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
            <MapPin aria-hidden className="size-4 text-brand-text" strokeWidth={2} />
            <span>{hero.caption.location}</span>
            <span aria-hidden className="h-3.5 w-px bg-ink/20" />
            <span className="text-ink-2">{hero.caption.year}</span>
          </Glass>
        </m.div>
      </div>
    </section>
  );
}
