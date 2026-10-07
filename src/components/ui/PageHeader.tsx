import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AmbientBackground } from "./AmbientBackground";
import { Eyebrow } from "./Eyebrow";

/** Top of every inner page: eyebrow, the page's single h1, short intro. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48", className)}>
      <AmbientBackground />
      <div className="container-page relative z-10">
        {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
        <h1 className="max-w-[18ch] text-h1 font-semibold text-ink">{title}</h1>
        {intro && <p className="measure mt-6 text-[1.1875rem] leading-relaxed text-ink-2 md:text-[1.3125rem]">{intro}</p>}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </header>
  );
}
