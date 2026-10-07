import type { Metadata } from "next";
import { pages } from "@/content";
import { PageHeader } from "@/components/ui/PageHeader";

const page = pages.about;

export const metadata: Metadata = {
  title: "About",
  description: page.intro,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", description: page.intro, url: "/about" },
};

/** Placeholder. Phase 2 builds this page. */
export default function AboutPage() {
  return <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />;
}
