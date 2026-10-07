import { getEventBySlug } from "@/lib/data/events";
import { buildIcs } from "@/lib/ics";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 60;

/** `.ics` download for "Add to calendar". */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return new Response("Event not found", { status: 404 });

  return new Response(buildIcs(event, absoluteUrl(`/events/${event.slug}`)), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
