"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NotAdminError, requireAdmin } from "@/lib/admin/auth";
import {
  eventSchema,
  postSchema,
  statusSchema,
  toFieldErrors,
  type ActionResult,
  type EventInput,
  type PostInput,
} from "@/lib/admin/schemas";
import { createClient } from "@/lib/supabase/server";
import type { PublishStatus } from "@/types/database";

/* ---------------------------------------------------------------------------
   Helpers
   --------------------------------------------------------------------------- */

function revalidateEvents(slugs: Array<string | null | undefined> = []) {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/sitemap.xml");
  for (const s of new Set(slugs.filter(Boolean))) revalidatePath(`/events/${s}`);
  revalidatePath("/admin", "layout");
}

function revalidatePosts(slugs: Array<string | null | undefined> = []) {
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/sitemap.xml");
  for (const s of new Set(slugs.filter(Boolean))) revalidatePath(`/news/${s}`);
  revalidatePath("/admin", "layout");
}

function fail(error: unknown): ActionResult<never> {
  if (error instanceof NotAdminError) return { ok: false, message: error.message };
  const msg = error && typeof error === "object" && "message" in error ? String(error.message) : "";
  if (msg.includes("duplicate key") && msg.includes("slug")) {
    return { ok: false, message: "That web address is already used.", fieldErrors: { slug: "Already used. Try another." } };
  }
  console.error("Admin action failed", msg);
  return { ok: false, message: "Something went wrong. Try again in a moment." };
}

type Table = "events" | "posts";

/* ---------------------------------------------------------------------------
   Slugs
   --------------------------------------------------------------------------- */

export async function isSlugAvailable(table: Table, slug: string, excludeId?: string): Promise<boolean> {
  const { supabase } = await requireAdmin();
  let query = supabase.from(table).select("id").eq("slug", slug).limit(1);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return (data ?? []).length === 0;
}

/* ---------------------------------------------------------------------------
   Events
   --------------------------------------------------------------------------- */

export async function saveEvent(input: EventInput): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const { supabase } = await requireAdmin();
    const parsed = eventSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Check the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
    const { id, ...row } = parsed.data;

    let previousSlug: string | null = null;
    if (id) {
      const { data: before } = await supabase.from("events").select("slug").eq("id", id).maybeSingle();
      previousSlug = before?.slug ?? null;
    }

    const { data, error } = id
      ? await supabase.from("events").update(row).eq("id", id).select("id, slug").single()
      : await supabase.from("events").insert(row).select("id, slug").single();
    if (error) throw error;

    revalidateEvents([data.slug, previousSlug]);
    return { ok: true, data, message: row.status === "published" ? "Event published" : "Draft saved" };
  } catch (error) {
    return fail(error);
  }
}

export async function setEventStatus(id: string, status: PublishStatus): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const next = statusSchema.parse(status);
    const { data, error } = await supabase.from("events").update({ status: next }).eq("id", id).select("slug").single();
    if (error) throw error;
    revalidateEvents([data.slug]);
    return { ok: true, message: next === "published" ? "Event published" : "Event moved to drafts" };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.from("events").delete().eq("id", id).select("slug").single();
    if (error) throw error;
    revalidateEvents([data.slug]);
    return { ok: true, message: "Event deleted" };
  } catch (error) {
    return fail(error);
  }
}

/* ---------------------------------------------------------------------------
   News posts
   --------------------------------------------------------------------------- */

export async function savePost(input: PostInput): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const { supabase } = await requireAdmin();
    const parsed = postSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Check the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
    const { id, ...row } = parsed.data;
    const payload = { ...row, publish_date: new Date(row.publish_date).toISOString() };

    let previousSlug: string | null = null;
    if (id) {
      const { data: before } = await supabase.from("posts").select("slug").eq("id", id).maybeSingle();
      previousSlug = before?.slug ?? null;
    }

    const { data, error } = id
      ? await supabase.from("posts").update(payload).eq("id", id).select("id, slug").single()
      : await supabase.from("posts").insert(payload).select("id, slug").single();
    if (error) throw error;

    revalidatePosts([data.slug, previousSlug]);
    return { ok: true, data, message: row.status === "published" ? "Post published" : "Draft saved" };
  } catch (error) {
    return fail(error);
  }
}

export async function setPostStatus(id: string, status: PublishStatus): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const next = statusSchema.parse(status);
    const { data, error } = await supabase.from("posts").update({ status: next }).eq("id", id).select("slug").single();
    if (error) throw error;
    revalidatePosts([data.slug]);
    return { ok: true, message: next === "published" ? "Post published" : "Post moved to drafts" };
  } catch (error) {
    return fail(error);
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase.from("posts").delete().eq("id", id).select("slug").single();
    if (error) throw error;
    revalidatePosts([data.slug]);
    return { ok: true, message: "Post deleted" };
  } catch (error) {
    return fail(error);
  }
}

/* ---------------------------------------------------------------------------
   Inbox
   --------------------------------------------------------------------------- */

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("messages").update({ read }).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/* ---------------------------------------------------------------------------
   Session and onboarding
   --------------------------------------------------------------------------- */

export async function completeTour(): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.auth.updateUser({ data: { tour_completed: true } });
    if (error) throw error;
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
