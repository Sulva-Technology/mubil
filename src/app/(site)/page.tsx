import type { Metadata } from "next";
import { site } from "@/content";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: { absolute: site.name },
  alternates: { canonical: "/" },
};

/** Placeholder hero. Phase 1 builds the full home page. */
export default function HomePage() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-36">
      <AmbientBackground />
      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <Eyebrow className="mb-6">{site.tagline}</Eyebrow>
        <h1 className="max-w-[14ch] text-hero font-semibold text-ink">[MISSION IN 6 TO 9 WORDS]</h1>
        <p className="measure mt-8 text-[1.1875rem] text-ink-2 md:text-[1.3125rem]">[SUPPORTING LINE]</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/contact" size="lg">
            Get involved
          </Button>
          <Button href="/programmes" variant="secondary" size="lg">
            See our work
          </Button>
        </div>
      </div>
    </section>
  );
}
