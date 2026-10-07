import type { Metadata } from "next";
import Image from "@/components/ui/Img";
import { Download, Eye, Heart, Target } from "lucide-react";
import { about } from "@/content";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glass } from "@/components/ui/Glass";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Timeline } from "@/components/about/Timeline";
import { TeamGrid } from "@/components/about/TeamGrid";

export const metadata: Metadata = {
  title: "About",
  description: about.header.intro,
  alternates: { canonical: "/about" },
  openGraph: { title: "About Mubil Foundation", description: about.header.intro, url: "/about" },
};

const pillarIcons = { target: Target, eye: Eye, heart: Heart } as const;

export default function AboutPage() {
  const { header, story, pillars, timeline, team, transparency } = about;

  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} intro={header.intro} />

      <Section aria-labelledby="story-title" className="pt-0!">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 id="story-title" className="text-h2 font-semibold">
              {story.title}
            </h2>
            <div className="measure mt-6 space-y-5 text-ink-2 md:text-[1.125rem]">
              {story.paragraphs.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-panel bg-ice shadow-lift">
              <Image src={story.image} alt={story.imageAlt} fill priority sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
              <Glass variant="strong" className="absolute left-4 top-4 rounded-full px-4 py-2 text-small font-semibold text-ink">
                {story.year}
              </Glass>
            </div>
          </Reveal>
        </div>
      </Section>

      <section aria-labelledby="pillars-title" className="section-y relative overflow-hidden bg-ice">
        <AmbientBackground />
        <div className="container-page relative z-10">
          <h2 id="pillars-title" className="sr-only">
            Mission, vision and values
          </h2>
          <Reveal stagger className="grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillarIcons[pillar.icon];
              return (
                <RevealItem key={pillar.title}>
                  <Glass variant="regular" className="h-full rounded-panel p-8 md:p-10">
                    <span className="grid size-12 place-items-center rounded-full bg-white text-brand shadow-card">
                      <Icon aria-hidden className="size-6" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-8 text-h3 font-semibold">{pillar.title}</h3>
                    <p className="mt-3 text-ink">{pillar.body}</p>
                  </Glass>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>
      </section>

      {timeline.length > 0 && (
        <Section aria-labelledby="timeline-title">
          <div className="mb-16 text-center">
            <Eyebrow className="mb-4">Our journey</Eyebrow>
            <h2 id="timeline-title" className="text-h2 font-semibold">
              Ten years, step by step
            </h2>
          </div>
          <div className="mx-auto max-w-4xl">
            <Timeline items={timeline} />
          </div>
        </Section>
      )}

      <Section tone="surface" aria-labelledby="team-title">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="mb-4">Team</Eyebrow>
            <h2 id="team-title" className="text-h2 font-semibold">
              The people behind the work
            </h2>
          </div>
          <p className="max-w-[40ch] text-ink-2">A small staff, more than three hundred volunteers.</p>
        </div>
        <TeamGrid members={team} />
      </Section>

      <Section aria-labelledby="transparency-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-4">Transparency</Eyebrow>
            <h2 id="transparency-title" className="text-h2 font-semibold">
              {transparency.title}
            </h2>
            <p className="measure mt-5 text-ink-2">{transparency.intro}</p>
            <dl className="mt-8 rounded-card border border-line bg-surface p-5">
              <dt className="text-small text-ink-2">Registration number</dt>
              <dd className="mt-1 font-medium tabular-nums">{transparency.registration}</dd>
            </dl>
            <Button href={transparency.reportUrl} variant="secondary" className="mt-6">
              <Download aria-hidden className="size-4" />
              {transparency.reportLabel}
            </Button>
          </div>

          <figure className="rounded-panel border border-line bg-surface p-6 shadow-card md:p-10 lg:col-span-6 lg:col-start-7">
            <figcaption className="font-display text-[1.25rem] font-semibold">How funds are used</figcaption>
            <ul className="mt-8 space-y-7">
              {transparency.funds.map((fund) => (
                <li key={fund.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span>{fund.label}</span>
                    <span className="font-display text-[1.25rem] font-semibold tabular-nums">{fund.value}%</span>
                  </div>
                  <div
                    className="mt-3 h-2.5 overflow-hidden rounded-full bg-ice"
                    role="meter"
                    aria-label={fund.label}
                    aria-valuenow={fund.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="h-full rounded-full bg-gradient-to-r from-brand to-aqua" style={{ width: `${fund.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </figure>
        </div>
      </Section>
    </>
  );
}
