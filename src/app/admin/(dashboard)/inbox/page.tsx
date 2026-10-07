import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { InboxView } from "@/components/admin/InboxView";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(500);
  return <InboxView messages={messages ?? []} />;
}
