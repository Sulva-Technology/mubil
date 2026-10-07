import type { Metadata } from "next";
import { pages } from "@/content";
import { PageHeader } from "@/components/ui/PageHeader";

const page = pages.contact;

export const metadata: Metadata = {
  title: "Contact",
  description: page.intro,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact", description: page.intro, url: "/contact" },
};

/** Placeholder. Phase 7 builds this page. */
export default function ContactPage() {
  return <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />;
}
