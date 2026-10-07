import type { Metadata } from "next";
import { pages } from "@/content";
import { PageHeader } from "@/components/ui/PageHeader";

const page = pages.news;

export const metadata: Metadata = {
  title: "News",
  description: page.intro,
  alternates: { canonical: "/news" },
  openGraph: { title: "News", description: page.intro, url: "/news" },
};

/** Placeholder. Phase 5 builds this page. */
export default function NewsPage() {
  return <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />;
}
