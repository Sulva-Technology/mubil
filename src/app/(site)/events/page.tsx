import type { Metadata } from "next";
import { pages } from "@/content";
import { PageHeader } from "@/components/ui/PageHeader";

const page = pages.events;

export const metadata: Metadata = {
  title: "Events",
  description: page.intro,
  alternates: { canonical: "/events" },
  openGraph: { title: "Events", description: page.intro, url: "/events" },
};

/** Placeholder. Phase 4 builds this page. */
export default function EventsPage() {
  return <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />;
}
