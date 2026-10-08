import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative flex min-h-[86svh] items-center overflow-hidden pb-24 pt-36">
        <AmbientBackground />
        <div className="container-page relative z-10 flex flex-col items-center text-center">
          <span className="glass grid size-16 place-items-center rounded-full text-brand-text">
            <Compass aria-hidden className="size-7" strokeWidth={1.75} />
          </span>
          <p className="mt-8 bg-gradient-to-br from-brand to-aqua bg-clip-text font-display text-[clamp(5rem,3rem+10vw,10rem)] font-semibold leading-none tracking-[-0.05em] text-transparent">
            404
          </p>
          <h1 className="mt-4 text-h2 font-semibold">This page has moved or never existed</h1>
          <p className="measure mt-4 text-ink-2 md:text-[1.125rem]">
            Check the link, or head back to the home page. Events and news posts are removed once they are no longer
            relevant.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/" size="lg">
              Go to the home page
            </Button>
            <Button href="/events" variant="secondary" size="lg">
              See upcoming events
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
