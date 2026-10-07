import type { Metadata } from "next";
import { pages, programmes } from "@/content";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { ProgrammesGrid } from "@/components/programmes/ProgrammesGrid";

const page = pages.programmes;

export const metadata: Metadata = {
  title: "Programmes",
  description: page.intro,
  alternates: { canonical: "/programmes" },
  openGraph: { title: "Programmes", description: page.intro, url: "/programmes" },
};

export default function ProgrammesPage() {
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section className="pt-0!">
        <ProgrammesGrid items={programmes} />
      </Section>
    </>
  );
}
