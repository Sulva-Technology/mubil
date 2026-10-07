import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import { todayInLagos } from "@/lib/format";
import type { EventRow } from "@/types/database";

export type EventSummary = Pick<
  EventRow,
  "id" | "title" | "slug" | "excerpt" | "event_date" | "start_time" | "end_time" | "venue" | "cover_image_url" | "featured"
>;

const SUMMARY = "id, title, slug, excerpt, event_date, start_time, end_time, venue, cover_image_url, featured";

/** Published events only (RLS enforces it too). Errors degrade to empty lists. */
export async function getUpcomingEvents(limit?: number): Promise<EventSummary[]> {
  let query = createPublicClient()
    .from("events")
    .select(SUMMARY)
    .eq("status", "published")
    .gte("event_date", todayInLagos())
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true, nullsFirst: true });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) console.error("getUpcomingEvents", error.message);
  return data ?? [];
}

export async function getPastEvents(limit?: number): Promise<EventSummary[]> {
  let query = createPublicClient()
    .from("events")
    .select(SUMMARY)
    .eq("status", "published")
    .lt("event_date", todayInLagos())
    .order("event_date", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) console.error("getPastEvents", error.message);
  return data ?? [];
}

export async function getEventBySlug(slug: string): Promise<EventRow | null> {
  const { data, error } = await createPublicClient()
    .from("events")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) console.error("getEventBySlug", error.message);
  return data;
}

export async function getEventSlugs(): Promise<string[]> {
  const { data } = await createPublicClient().from("events").select("slug").eq("status", "published");
  return (data ?? []).map((e) => e.slug);
}

export async function getEventsForSitemap() {
  const { data } = await createPublicClient().from("events").select("slug, updated_at").eq("status", "published");
  return data ?? [];
}
