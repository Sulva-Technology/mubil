import type { Metadata } from "next";
import { pages } from "@/content";
import { PageHeader } from "@/components/ui/PageHeader";

const page = pages.gallery;

export const metadata: Metadata = {
  title: "Gallery",
  description: page.intro,
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Gallery", description: page.intro, url: "/gallery" },
};

/** Placeholder. Phase 6 builds this page. */
export default function GalleryPage() {
  return <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />;
}
