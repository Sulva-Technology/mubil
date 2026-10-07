import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, CalendarPlus, ChevronRight, Clock, MapPin, Navigation } from "lucide-react";
import { getEventBySlug, getEventSlugs, getUpcomingEvents } from "@/lib/data/events";
import { formatDate, formatTimeRange } from "@/lib/format";
import { sanitizeRichText } from "@/lib/sanitize";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShareRow } from "@/components/share/ShareRow";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Glass } from "@/components/ui/Glass";
import { Section } from "@/components/ui/Section";
import { EventCard } from "@/components/events/EventCard";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  const path = `/events/${event.slug}`;
  const description = event.excerpt ?? `${event.title}, ${formatDate(event.event_date)}`;
  return {
    title: event.title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title: event.title, description },
    twitter: { card: "summary_large_image", title: event.title, description },
  };
}

function lagosIso(date: string, time: string | null) {
  return time ? `${date}T${time.slice(0, 5)}:00+01:00` : date;
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const more = (await getUpcomingEvents(4)).filter((e) => e.id !== event.id).slice(0, 3);
  const url = absoluteUrl(`/events/${event.slug}`);
  const time = formatTimeRange(event.start_time, event.end_time);
  const mapsHref =
    event.map_link ??
    (event.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}` : null);

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.excerpt ?? undefined,
    startDate: lagosIso(event.event_date, event.start_time),
    endDate: event.end_time ? lagosIso(event.event_date, event.end_time) : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: event.cover_image_url ? [event.cover_image_url] : undefined,
    url,
    location: {
      "@type": "Place",
      name: event.venue ?? event.address ?? "To be confirmed",
      address: { "@type": "PostalAddress", streetAddress: event.address ?? undefined, addressCountry: "NG" },
    },
    organizer: { "@type": "NGO", name: site.name, url: absoluteUrl("/") },
  };

  const details = [
    { icon: CalendarDays, label: "Date", value: formatDate(event.event_date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    time ? { icon: Clock, label: "Time", value: time } : null,
    event.venue ? { icon: MapPin, label: "Venue", value: event.venue } : null,
    event.address ? { icon: Navigation, label: "Address", value: event.address } : null,
  ].filter((d): d is NonNullable<typeof d> => d !== null);

  return (
    <>
      <JsonLd
        data={[
          eventJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Events", path: "/events" },
            { name: event.title, path: `/events/${event.slug}` },
          ]),
        ]}
      />

      <article className="pb-24 pt-32 md:pt-40">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-small text-ink-2">
              <li>
                <Link href="/events" className="rounded hover:text-ink">
                  Events
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="truncate text-ink">
                {event.title}
              </li>
            </ol>
          </nav>
          <h1 className="max-w-[20ch] text-h1 font-semibold">{event.title}</h1>
          {event.excerpt && <p className="measure mt-5 text-[1.125rem] text-ink-2 md:text-[1.3125rem]">{event.excerpt}</p>}

          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-panel bg-ice shadow-lift sm:aspect-[21/9]">
            <Image
              src={event.cover_image_url ?? "/placeholders/landscape.svg"}
              alt=""
              fill
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
              unoptimized={!event.cover_image_url}
              className="object-cover"
            />
          </div>

          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12">
            <aside className="lg:order-2 lg:col-span-4">
              <Glass variant="strong" className="rounded-panel p-6 lg:sticky lg:top-28 lg:p-8">
                <h2 className="sr-only">Event details</h2>
                <dl className="space-y-5">
                  {details.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex gap-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ice text-brand">
                        <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <dt className="text-small text-ink-2">{label}</dt>
                        <dd className="font-medium">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 flex flex-col gap-3">
                  <a href={`/events/${event.slug}/calendar`} download={`${event.slug}.ics`} className={buttonClasses("primary", "md", "w-full")}>
                    <CalendarPlus aria-hidden className="size-4" />
                    Add to calendar
                  </a>
                  {mapsHref && (
                    <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="glass inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-medium text-ink transition-colors hover:bg-white/80">
                      <MapPin aria-hidden className="size-4" />
                      Open in Maps
                    </a>
                  )}
                </div>
              </Glass>
            </aside>

            <div className="lg:col-span-7">
              <div className="prose-mubil" dangerouslySetInnerHTML={{ __html: sanitizeRichText(event.description) }} />
              <div className="mt-12 border-t border-line pt-8">
                <ShareRow url={url} title={event.title} />
              </div>
            </div>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <Section tone="surface" aria-labelledby="more-events-title">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <h2 id="more-events-title" className="text-h2 font-semibold">
              More events
            </h2>
            <Button href="/events" variant="tertiary">
              All events
            </Button>
          </div>
          <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {more.map((e) => (
              <li key={e.id} className="flex w-[80vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none">
                <EventCard event={e} className="w-full" />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
