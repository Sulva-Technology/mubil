import Image from "@/components/ui/Img";
import { CalendarX2, Newspaper } from "lucide-react";
import { home } from "@/content";
import { getUpcomingEvents } from "@/lib/data/events";
import { getLatestPosts } from "@/lib/data/posts";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Glass } from "@/components/ui/Glass";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { EventRow, EventRowSkeleton } from "@/components/events/EventRow";
import { FeaturedPostCard, PostCard } from "@/components/news/PostCard";

function SectionHeading({ id, eyebrow, title, action }: { id: string; eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
        <h2 id={id} className="max-w-[18ch] text-h2 font-semibold">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function ProgrammesHeading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-end">
      <div>
        <Eyebrow className="mb-4">{home.programmes.eyebrow}</Eyebrow>
        <h2 id="programmes-title" className="max-w-[16ch] text-h2 font-semibold">
          {home.programmes.title}
        </h2>
      </div>
      <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
        <p className="max-w-[44ch] text-ink-2">{home.programmes.intro}</p>
        <Button href="/programmes" variant="tertiary">
          All programmes
        </Button>
      </div>
    </div>
  );
}

export async function UpcomingEvents() {
  const events = await getUpcomingEvents(3);
  return (
    <Section aria-labelledby="events-title">
      <SectionHeading
        id="events-title"
        eyebrow={home.events.eyebrow}
        title={home.events.title}
        action={
          <Button href="/events" variant="tertiary">
            All events
          </Button>
        }
      />
      <Reveal className="mt-12">
        {events.length > 0 ? (
          <ul className="divide-y divide-line border-y border-line">
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={CalendarX2}
            title="No upcoming events"
            description="New events appear here as soon as they are published."
            action={
              <Button href="/events" variant="secondary">
                See past events
              </Button>
            }
          />
        )}
      </Reveal>
    </Section>
  );
}

export function UpcomingEventsSkeleton() {
  return (
    <Section>
      <Skeleton className="h-10 w-64" />
      <ul className="mt-12 divide-y divide-line border-y border-line">
        <EventRowSkeleton />
        <EventRowSkeleton />
        <EventRowSkeleton />
      </ul>
    </Section>
  );
}

export async function LatestNews() {
  const posts = await getLatestPosts(3);
  const [featured, ...rest] = posts;
  return (
    <Section tone="surface" aria-labelledby="news-title">
      <SectionHeading
        id="news-title"
        eyebrow={home.news.eyebrow}
        title={home.news.title}
        action={
          <Button href="/news" variant="tertiary">
            All news
          </Button>
        }
      />
      <Reveal className="mt-12">
        {featured ? (
          <div className="grid gap-6 lg:grid-cols-12">
            <FeaturedPostCard post={featured} className="lg:col-span-7 lg:min-h-[560px]" />
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} horizontal sizes="(min-width: 1024px) 240px, 50vw" />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState icon={Newspaper} title="No news yet" description="Stories from the field will appear here soon." />
        )}
      </Reveal>
    </Section>
  );
}

export function LatestNewsSkeleton() {
  return (
    <Section tone="surface">
      <Skeleton className="h-10 w-64" />
      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <Skeleton className="h-[420px] rounded-panel lg:col-span-7" />
        <div className="grid gap-6 lg:col-span-5">
          <Skeleton className="h-[200px] rounded-card" />
          <Skeleton className="h-[200px] rounded-card" />
        </div>
      </div>
    </Section>
  );
}

export function Story() {
  const { story } = home;
  return (
    <section aria-label="A story from our programmes" className="relative min-h-[720px] overflow-hidden bg-brand-deep md:min-h-[85vh]">
      <Image src={story.image} alt={story.imageAlt} fill sizes="100vw" className="object-cover object-[50%_25%] md:object-[30%_25%]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent md:bg-gradient-to-l md:from-night/40" />
      <div className="container-page relative flex min-h-[720px] items-end py-6 md:min-h-[85vh] md:items-center md:justify-end md:py-24">
        <Reveal className="w-full max-w-xl">
          <Glass as="figure" variant="strong" className="rounded-panel p-7 md:p-10">
            <blockquote className="font-display text-[1.5rem] font-semibold leading-[1.25] tracking-[-0.02em] text-ink md:text-[2rem]">
              <p>&ldquo;{story.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-6 border-t border-ink/10 pt-5">
              <p className="font-medium text-ink">{story.name}</p>
              <p className="text-small text-ink-2">{story.role}</p>
            </figcaption>
          </Glass>
        </Reveal>
      </div>
    </section>
  );
}

export function ClosingCta() {
  const { cta } = home;
  return (
    <section aria-labelledby="cta-title" className="section-y relative overflow-hidden bg-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[min(900px,120vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--brand)_22%,transparent),color-mix(in_srgb,var(--aqua)_10%,transparent)_60%,transparent)]"
      />
      <Reveal className="container-page relative flex flex-col items-center text-center">
        <h2 id="cta-title" className="max-w-[14ch] text-h1 font-semibold md:text-[clamp(3rem,1.5rem+4.5vw,6rem)]">
          {cta.headline}
        </h2>
        <p className="measure mt-6 text-[1.125rem] text-ink-2 md:text-[1.3125rem]">{cta.supporting}</p>
        <Button href="/contact" size="lg" className="mt-10">
          {cta.action}
        </Button>
      </Reveal>
    </section>
  );
}
