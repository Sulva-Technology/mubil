import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AmbientBackground } from "./AmbientBackground";

type Tone = "default" | "surface" | "ice" | "night";

const toneClass: Record<Tone, string> = {
  default: "bg-bg text-ink",
  surface: "bg-surface text-ink",
  ice: "bg-ice text-ink",
  night: "bg-night text-white",
};

type SectionProps = {
  id?: string;
  tone?: Tone;
  /** Render ambient blobs behind the content. */
  ambient?: boolean;
  /** Wrap children in the 1280px page container. */
  contained?: boolean;
  className?: string;
  containerClassName?: string;
  /** Below-the-fold section: let the browser skip rendering it until it's close. */
  deferRender?: boolean;
  "aria-labelledby"?: string;
  children: ReactNode;
};

export function Section({
  id,
  tone = "default",
  ambient = false,
  contained = true,
  className,
  containerClassName,
  deferRender = false,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("section-y relative overflow-hidden", toneClass[tone], deferRender && "cv-auto", className)}
      {...rest}
    >
      {ambient && <AmbientBackground tone={tone === "night" ? "night" : "light"} />}
      {contained ? (
        <div className={cn("container-page relative z-10", containerClassName)}>{children}</div>
      ) : (
        <div className="relative z-10">{children}</div>
      )}
    </section>
  );
}
