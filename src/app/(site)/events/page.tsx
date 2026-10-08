import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarClock, CalendarX2 } from "lucide-react";
import { pages } from "@/content";
import { getPastEvents, getUpcomingEvents } from "@/lib/data/events";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { EventCard, EventCardSkeleton } from "@/components/events/EventCard";
import { EventsTabs } from "@/components/events/EventsTabs";

export const revalidate = 60;

const page = pages.events;

export const metadata: Metadata = {
  title: "Events",
  description: page.intro,
  alternates: { canonical: "/events" },
  openGraph: { title: "Events", description: page.intro, url: "/events" },
};

const grid = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

async function EventLists() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);
  return (
    <EventsTabs
      upcoming={
        upcoming.length ? (
          <ul className={grid}>
            {upcoming.map((event, i) => (
              <li key={event.id} className="flex">
                <EventCard event={event} className="w-full" headingLevel="h2" priority={i === 0} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={CalendarClock}
            title="No upcoming events"
            description="New events appear here as soon as they are published. Follow our news for updates."
            action={
              <Button href="/news" variant="secondary">
                Read the latest news
              </Button>
            }
          />
        )
      }
      past={
        past.length ? (
          <ul className={grid}>
            {past.map((event) => (
              <li key={event.id} className="flex">
                <EventCard event={event} past className="w-full" headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={CalendarX2} title="No past events yet" description="Events move here once their date has passed." />
        )
      }
    />
  );
}

function EventListsSkeleton() {
  return (
    <div>
      <div className="h-12 w-56 animate-pulse rounded-full bg-ice" />
      <div className={`mt-10 ${grid}`}>
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section className="pt-0!">
        <Suspense fallback={<EventListsSkeleton />}>
          <EventLists />
        </Suspense>
      </Section>
    </>
  );
}
