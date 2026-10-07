import type { Metadata } from "next";
import { getAdminContext } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { NewsManager } from "@/components/admin/NewsManager";

export const metadata: Metadata = { title: "News" };

export default async function AdminNewsPage() {
  const ctx = await getAdminContext();
  const supabase = await createClient();
  const { data: posts } = await supabase.from("posts").select("*").order("publish_date", { ascending: false });
  return <NewsManager posts={posts ?? []} defaultAuthor={ctx.status === "admin" ? ctx.name : ""} />;
}
