import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import type { EventSummary } from "@/lib/data/events";
import { formatTimeRange } from "@/lib/format";
import { buttonClasses } from "@/components/ui/Button";
import { DateBlock } from "./DateBlock";

/** Clean list row: date block, title, time and venue, Details pill. */
export function EventRow({ event }: { event: EventSummary }) {
  const time = formatTimeRange(event.start_time, event.end_time);
  return (
    <li className="group relative">
      <div className="flex items-center gap-5 rounded-card px-2 py-6 transition-colors duration-500 group-hover:bg-surface md:gap-8 md:px-6">
        <DateBlock date={event.event_date} />
        <span aria-hidden className="h-12 w-px bg-line" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] md:text-h3">
            <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0 after:rounded-card">
              {event.title}
            </Link>
          </h3>
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-small text-ink-2">
            {time && (
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                {time}
              </span>
            )}
            {event.venue && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                {event.venue}
              </span>
            )}
          </p>
        </div>
        <span aria-hidden className="hidden md:block">
          <span className={buttonClasses("secondary", "sm")}>Details</span>
        </span>
        <ArrowRight aria-hidden className="size-5 shrink-0 text-ink-2 md:hidden" />
      </div>
    </li>
  );
}

export function EventRowSkeleton() {
  return (
    <li className="flex items-center gap-5 px-2 py-6 md:gap-8 md:px-6" aria-hidden>
      <div className="h-14 w-16 animate-pulse rounded-chip bg-ice" />
      <div className="flex-1 space-y-3">
        <div className="h-6 w-2/3 animate-pulse rounded-chip bg-ice" />
        <div className="h-4 w-1/3 animate-pulse rounded-chip bg-ice" />
      </div>
    </li>
  );
}
