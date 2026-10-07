import type { Metadata } from "next";
import { pages } from "@/content";
import { PageHeader } from "@/components/ui/PageHeader";

const page = pages.programmes;

export const metadata: Metadata = {
  title: "Programmes",
  description: page.intro,
  alternates: { canonical: "/programmes" },
  openGraph: { title: "Programmes", description: page.intro, url: "/programmes" },
};

/** Placeholder. Phase 3 builds this page. */
export default function ProgrammesPage() {
  return <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />;
}
