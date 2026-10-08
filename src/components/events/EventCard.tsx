import Image from "@/components/ui/Img";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { EventSummary } from "@/lib/data/events";
import { dateParts, formatTimeRange } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Glass } from "@/components/ui/Glass";

const FALLBACK = "/placeholders/landscape.svg";

/** Image card with a glass date badge in the corner. */
export function EventCard({
  event,
  className,
  past = false,
  priority = false,
  headingLevel = "h3",
}: {
  event: EventSummary;
  className?: string;
  past?: boolean;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const { day, month } = dateParts(event.event_date);
  const time = formatTimeRange(event.start_time, event.end_time);
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ice">
        <Image
          src={event.cover_image_url ?? FALLBACK}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          unoptimized={!event.cover_image_url}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]",
            past && "grayscale-[35%]",
          )}
        />
        <Glass
          variant="strong"
          className="absolute left-4 top-4 flex flex-col items-center rounded-chip px-3 py-2 leading-none text-ink"
        >
          <span className="font-display text-[1.5rem] font-semibold tracking-[-0.03em] tabular-nums">{day}</span>
          <span className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand-text">{month}</span>
        </Glass>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Heading className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em]">
          <Link href={`/events/${event.slug}`} className="after:absolute after:inset-0">
            {event.title}
          </Link>
        </Heading>
        <div className="mt-auto space-y-1.5 pt-4 text-small text-ink-2">
          {time && (
            <p className="flex items-center gap-2">
              <Clock aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
              {time}
            </p>
          )}
          {event.venue && (
            <p className="flex items-center gap-2">
              <MapPin aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
              {event.venue}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function EventCardSkeleton() {
  return (
    <div aria-hidden className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="aspect-[16/10] animate-pulse bg-ice" />
      <div className="space-y-3 p-6">
        <div className="h-6 w-4/5 animate-pulse rounded-chip bg-ice" />
        <div className="h-4 w-1/2 animate-pulse rounded-chip bg-ice" />
      </div>
    </div>
  );
}
