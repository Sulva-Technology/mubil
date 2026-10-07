import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { CalendarX2 } from "lucide-react";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glass, type GlassVariant } from "@/components/ui/Glass";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { SmartImage } from "@/components/ui/SmartImage";
import { StatPill } from "@/components/ui/StatPill";
import { ModalDemo, SegmentedDemo, ToastDemo } from "@/components/styleguide/InteractiveDemos";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Design system reference for the Mubil Foundation website.",
  robots: { index: false, follow: false },
};

const colours = [
  { token: "--bg", hex: "#F5F7FB", use: "Page canvas", dark: false },
  { token: "--surface", hex: "#FFFFFF", use: "Cards, solid panels", dark: false },
  { token: "--ink", hex: "#0B1B33", use: "Headlines and body text", dark: true },
  { token: "--ink-2", hex: "#5B6B82", use: "Secondary text", dark: true },
  { token: "--line", hex: "rgba(11,27,51,0.08)", use: "Dividers, borders", dark: false },
  { token: "--brand", hex: "#1F5EFF", use: "Buttons, links, focus", dark: true },
  { token: "--brand-deep", hex: "#0A2A6B", use: "Hover, pressed, gradients", dark: true },
  { token: "--sky", hex: "#6FB8FF", use: "Ambient glow only", dark: false },
  { token: "--aqua", hex: "#19C3D9", use: "Accent, sparingly", dark: false },
  { token: "--ice", hex: "#E6F0FF", use: "Chips, soft bands", dark: false },
  { token: "--night", hex: "#050B18", use: "Impact section, footer", dark: true },
  { token: "--success", hex: "#12B76A", use: "Success states", dark: true },
  { token: "--warning", hex: "#F5A524", use: "Warnings", dark: false },
  { token: "--error", hex: "#E5484D", use: "Errors", dark: true },
];

const typeScale = [
  { name: "Hero", spec: "56 → 112px, Inter Tight 600", className: "text-hero font-semibold", sample: "Every child" },
  { name: "H1", spec: "40 → 72px, Inter Tight 600", className: "text-h1 font-semibold", sample: "Building brighter futures" },
  { name: "H2", spec: "32 → 48px, Inter Tight 600", className: "text-h2 font-semibold", sample: "Programmes that last" },
  { name: "H3", spec: "22 → 28px, Inter Tight 600", className: "text-h3 font-semibold", sample: "Community health outreach" },
  {
    name: "Body",
    spec: "17px / 1.6, Inter 400",
    className: "text-body measure",
    sample:
      "Body copy keeps a 65 character measure so long paragraphs stay easy to read on any screen, from a 360px phone to a wide desktop.",
  },
  { name: "Small", spec: "14px, Inter 400", className: "text-small text-ink-2", sample: "Saturday 14 March, 10:00 to 14:00" },
  { name: "Eyebrow", spec: "13px, uppercase, 0.08em", className: "text-eyebrow font-semibold uppercase text-brand", sample: "Upcoming events" },
];

const glassVariants: GlassVariant[] = ["subtle", "regular", "strong", "dark"];

function Block({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-16 md:py-20">
      <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <h2 className="text-h2 font-semibold">{title}</h2>
        {note && <p className="max-w-[48ch] text-small text-ink-2">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Design system"
        title="Styleguide"
        intro="Every token and component the Mubil Foundation site is built from. Change a token here and the whole site follows."
      />

      <div className="container-page pb-24">
        <Block title="Colour" note="All colours are CSS variables. Tailwind's default palette is removed, so nothing else can sneak in.">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {colours.map((c) => (
              <li key={c.token} className="overflow-hidden rounded-card border border-line bg-surface">
                <div className="h-24 border-b border-line" style={{ background: `var(${c.token})` }} />
                <div className="p-4">
                  <p className="font-medium">{c.token}</p>
                  <p className="text-small text-ink-2">{c.hex}</p>
                  <p className="mt-1 text-small text-ink-2">{c.use}</p>
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Type" note="Inter Tight for display, Inter for text. Sizes are fluid between 360px and 1440px.">
          <ul className="space-y-10">
            {typeScale.map((t) => (
              <li key={t.name} className="grid gap-3 md:grid-cols-[200px_1fr] md:gap-10">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-small text-ink-2">{t.spec}</p>
                </div>
                <p className={t.className}>{t.sample}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Glass" note="Floating layers only. The bottom row forces the solid fallback used when backdrop-filter is unsupported.">
          <div className="relative overflow-hidden rounded-panel">
            <Image src="/placeholders/landscape.svg" alt="" fill unoptimized className="object-cover" />
            <div className="relative grid gap-4 p-5 sm:grid-cols-2 md:p-10 lg:grid-cols-4">
              {glassVariants.map((v) => (
                <Glass key={v} variant={v} className="rounded-card p-6">
                  <p className="font-display text-h3 font-semibold capitalize">{v}</p>
                  <p className={v === "dark" ? "mt-1 text-small text-white/80" : "mt-1 text-small text-ink"}>
                    {v === "dark" ? "For --night sections" : "Over imagery and colour"}
                  </p>
                </Glass>
              ))}
              {glassVariants.map((v) => (
                <Glass key={`${v}-fallback`} variant={v} fallback className="rounded-card p-6">
                  <p className="font-display text-h3 font-semibold capitalize">{v}</p>
                  <p className={v === "dark" ? "mt-1 text-small text-white/80" : "mt-1 text-small text-ink"}>Fallback</p>
                </Glass>
              ))}
            </div>
          </div>
        </Block>

        <Block title="Buttons" note="Pills throughout. Primary for the one main action, glass for the second, text link for the rest.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="flex flex-wrap items-center gap-4">
              <Button>Get involved</Button>
              <Button variant="secondary">See our work</Button>
              <Button variant="tertiary" href="/styleguide">
                Read the story
              </Button>
            </Card>
            <Card className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </Card>
            <div className="relative overflow-hidden rounded-card lg:col-span-2">
              <AmbientBackground />
              <div className="relative flex flex-wrap items-center gap-4 bg-ice/40 p-8">
                <Button>Primary over colour</Button>
                <Button variant="secondary">Glass over colour</Button>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Cards" note="Solid surfaces for content. Hover lifts 4px. Glass only appears where a panel floats over an image.">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <Eyebrow className="mb-3">Static</Eyebrow>
              <h3 className="text-h3 font-semibold">[CARD TITLE]</h3>
              <p className="mt-2 text-ink-2">[ONE LINE DESCRIPTION]</p>
            </Card>
            <Card as="a" href="#cards" interactive>
              <Eyebrow className="mb-3">Interactive</Eyebrow>
              <h3 className="text-h3 font-semibold">[CARD TITLE]</h3>
              <p className="mt-2 text-ink-2">Hover or focus to lift.</p>
            </Card>
            <Card as="a" href="#cards" interactive padded={false} className="overflow-hidden">
              <SmartImage src="/placeholders/portrait.svg" alt="[IMAGE DESCRIPTION]" ratio="4/5" rounded="none" />
              <Glass variant="strong" className="absolute inset-x-3 bottom-3 rounded-[16px] p-4">
                <p className="font-display text-[1.125rem] font-semibold">[PROGRAMME TITLE]</p>
                <p className="text-small text-ink">[ONE LINE]</p>
              </Glass>
            </Card>
          </div>
        </Block>

        <Block title="Stat pills">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative flex flex-1 flex-wrap gap-3 overflow-hidden rounded-card p-8">
              <AmbientBackground />
              <StatPill value="[00]" label="[COMMUNITIES]" className="relative" />
              <StatPill value="[00]" label="[VOLUNTEERS]" className="relative" />
            </div>
            <div className="relative flex flex-1 flex-wrap gap-3 overflow-hidden rounded-card bg-night p-8">
              <AmbientBackground tone="night" />
              <StatPill tone="dark" value="[00]" label="[PEOPLE REACHED]" className="relative" />
            </div>
          </div>
        </Block>

        <Block title="Segmented control" note="Sliding indicator, keyboard friendly.">
          <SegmentedDemo />
        </Block>

        <Block title="Toast and modal" note="Toasts stack at the bottom and clear after four seconds. The modal traps focus and closes on Escape.">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <ToastDemo />
            <ModalDemo />
          </div>
        </Block>

        <Block title="Smart image" note="Locked aspect ratio, blur placeholder, no layout shift.">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <SmartImage src="/placeholders/landscape.svg" alt="[DESCRIPTION]" ratio="1/1" sizes="25vw" />
            <SmartImage src="/placeholders/portrait.svg" alt="[DESCRIPTION]" ratio="4/5" sizes="25vw" />
            <SmartImage src="/placeholders/landscape.svg" alt="[DESCRIPTION]" ratio="16/9" rounded="chip" sizes="50vw" wrapperClassName="col-span-2" />
          </div>
        </Block>

        <Block title="Empty state and skeleton">
          <div className="grid gap-6 lg:grid-cols-2">
            <EmptyState
              icon={CalendarX2}
              title="No upcoming events"
              description="New events appear here as soon as they are published."
              action={<Button variant="secondary" href="/news">Read the latest news</Button>}
            />
            <Card className="space-y-5">
              <Skeleton className="aspect-[16/9] w-full rounded-card" />
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          </div>
        </Block>

        <Block title="Motion" note="Scroll reveal: fade, 24px rise, blur to sharp, 60ms stagger. Off when reduced motion is on.">
          <Reveal stagger className="grid gap-4 sm:grid-cols-3">
            {["First", "Second", "Third"].map((label) => (
              <RevealItem key={label}>
                <Card className="text-center">
                  <p className="font-display text-h3 font-semibold">{label}</p>
                </Card>
              </RevealItem>
            ))}
          </Reveal>
        </Block>
      </div>

      <Section tone="ice">
        <Eyebrow className="mb-4">Section tone: ice</Eyebrow>
        <h2 className="max-w-[20ch] text-h2 font-semibold">Soft band for supporting content</h2>
      </Section>

      <Section tone="night" ambient>
        <Eyebrow tone="dark" className="mb-4">
          Section tone: night
        </Eyebrow>
        <h2 className="max-w-[20ch] text-h2 font-semibold">Deep ocean glow for the mood shift</h2>
        <p className="measure mt-4 text-white/70">Used for the impact numbers on the home page and the footer.</p>
      </Section>
    </>
  );
}
