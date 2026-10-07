import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Users } from "lucide-react";
import { programmes } from "@/content";
import { breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { StatPill } from "@/components/ui/StatPill";
import { MiniNav } from "@/components/programmes/MiniNav";
import { ProgrammeCard } from "@/components/programmes/ProgrammeCard";
import { StatusPill } from "@/components/programmes/ProgrammesGrid";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return programmes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const programme = programmes.find((p) => p.slug === slug);
  if (!programme) return {};
  const path = `/programmes/${programme.slug}`;
  return {
    title: programme.title,
    description: programme.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: programme.title,
      description: programme.summary,
      images: [{ url: programme.image, alt: programme.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: programme.title, description: programme.summary, images: [programme.image] },
  };
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "impact", label: "Impact" },
  { id: "gallery", label: "Gallery" },
] as const;

export default async function ProgrammePage({ params }: Props) {
  const { slug } = await params;
  const programme = programmes.find((p) => p.slug === slug);
  if (!programme) notFound();

  const others = programmes.filter((p) => p.slug !== programme.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Programmes", path: "/programmes" },
          { name: programme.title, path: `/programmes/${programme.slug}` },
        ])}
      />

      <header className="relative flex min-h-[78svh] items-end overflow-hidden bg-brand-deep pb-14 pt-36 md:min-h-[86vh] md:pb-20">
        <Image src={programme.image} alt={programme.imageAlt} fill priority sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/35 to-night/10" />
        <div className="container-page relative z-10 text-white">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-small text-white/75">
              <li>
                <Link href="/programmes" className="rounded hover:text-white">
                  Programmes
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="text-white">
                {programme.title}
              </li>
            </ol>
          </nav>
          <StatusPill status={programme.status} />
          <h1 className="mt-5 max-w-[16ch] text-hero font-semibold">{programme.title}</h1>
          <p className="mt-6 max-w-[48ch] text-[1.125rem] text-white/85 md:text-[1.3125rem]">{programme.summary}</p>
        </div>
      </header>

      <div className="relative -mt-7">
        <MiniNav items={sections} />

        <Section id="overview" aria-labelledby="overview-title" className="scroll-mt-40">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Eyebrow className="mb-4">Overview</Eyebrow>
              <h2 id="overview-title" className="text-h2 font-semibold">
                What the programme does
              </h2>
              <div className="measure mt-6 space-y-5 text-ink-2 md:text-[1.125rem]">
                {programme.overview.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </Reveal>
            <Reveal stagger className="space-y-4 lg:col-span-4 lg:col-start-9">
              <RevealItem>
                <div className="rounded-card border border-line bg-surface p-6">
                  <h3 className="flex items-center gap-2 font-medium">
                    <Users aria-hidden className="size-5 text-brand" strokeWidth={1.75} />
                    Who it serves
                  </h3>
                  <p className="mt-2 text-ink-2">{programme.serves}</p>
                </div>
              </RevealItem>
              <RevealItem>
                <div className="rounded-card border border-line bg-surface p-6">
                  <h3 className="flex items-center gap-2 font-medium">
                    <MapPin aria-hidden className="size-5 text-brand" strokeWidth={1.75} />
                    Where it runs
                  </h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {programme.locations.map((location) => (
                      <li key={location} className="rounded-chip bg-ice px-3 py-1.5 text-small text-brand-deep">
                        {location}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            </Reveal>
          </div>
        </Section>

        <Section id="impact" tone="night" ambient aria-labelledby="impact-title" className="scroll-mt-28">
          <Eyebrow tone="dark" className="mb-4">
            Impact
          </Eyebrow>
          <h2 id="impact-title" className="max-w-[18ch] text-h2 font-semibold">
            Results so far
          </h2>
          <Reveal stagger className="mt-12 flex flex-wrap gap-4">
            {programme.impact.map((stat) => (
              <RevealItem key={stat.label}>
                <StatPill tone="dark" value={stat.value} label={stat.label} />
              </RevealItem>
            ))}
          </Reveal>
        </Section>

        <Section id="gallery" aria-labelledby="gallery-title" className="scroll-mt-28">
          <Eyebrow className="mb-4">Gallery</Eyebrow>
          <h2 id="gallery-title" className="text-h2 font-semibold">
            From the field
          </h2>
          <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {programme.photos.map((photo, i) => (
              <div
                key={photo.src}
                className={
                  "relative aspect-[4/5] w-[75vw] shrink-0 snap-start overflow-hidden rounded-card bg-ice md:w-auto " +
                  (i === 1 ? "md:translate-y-10" : "")
                }
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 33vw, 75vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section tone="surface" aria-labelledby="others-title">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <h2 id="others-title" className="text-h2 font-semibold">
            Other programmes
          </h2>
          <Button href="/programmes" variant="tertiary">
            All programmes
          </Button>
        </div>
        <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {others.map((p) => (
            <li key={p.slug} className="w-[78vw] max-w-[380px] shrink-0 snap-start md:w-auto md:max-w-none">
              <ProgrammeCard programme={p} className="aspect-[3/4]" sizes="(min-width: 768px) 33vw, 78vw" />
            </li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="cta-title" className="section-y relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[min(820px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--brand)_20%,transparent),transparent)]"
        />
        <div className="container-page relative flex flex-col items-center text-center">
          <h2 id="cta-title" className="max-w-[16ch] text-h1 font-semibold">
            Support {programme.title}
          </h2>
          <p className="measure mt-5 text-ink-2 md:text-[1.125rem]">
            Volunteer, partner with us, or fund the next phase of this programme.
          </p>
          <Button href="/contact" size="lg" className="mt-8">
            Get involved
          </Button>
        </div>
      </section>
    </>
  );
}
