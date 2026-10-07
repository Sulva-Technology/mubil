import type { Metadata } from "next";
import { gallery, galleryAlbums, pages } from "@/content";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

const page = pages.gallery;

export const metadata: Metadata = {
  title: "Gallery",
  description: page.intro,
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Gallery", description: page.intro, url: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section className="pt-0!">
        <GalleryGrid items={gallery} albums={galleryAlbums} />
      </Section>
    </>
  );
}
