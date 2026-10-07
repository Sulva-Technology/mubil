import { getEventBySlug } from "@/lib/data/events";
import { formatDate, formatTimeRange } from "@/lib/format";
import { OG_SIZE, renderOgCard } from "@/lib/og/card";

export const alt = "Mubil Foundation event";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 60;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return renderOgCard({ eyebrow: "Events", title: "Mubil Foundation events" });
  const when = [formatDate(event.event_date, { weekday: "short", day: "numeric", month: "long", year: "numeric" }), formatTimeRange(event.start_time, event.end_time)]
    .filter(Boolean)
    .join(", ");
  return renderOgCard({ eyebrow: "Event", title: event.title, meta: [when, event.venue].filter(Boolean).join("  |  ") });
}
