import { site } from "@/content";
import { OG_SIZE, renderOgCard } from "@/lib/og/card";

export const alt = site.name;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Default share card for every page without its own. */
export default function Image() {
  return renderOgCard({ eyebrow: site.tagline, title: "Children learn, women earn, families thrive", meta: site.description });
}
