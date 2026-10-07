import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { EventsManager } from "@/components/admin/EventsManager";

export const metadata: Metadata = { title: "Events" };

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").order("event_date", { ascending: false });
  return <EventsManager events={events ?? []} />;
}
