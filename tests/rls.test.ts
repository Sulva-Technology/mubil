/**
 * Proves Row Level Security blocks writes from anyone who isn't an admin.
 * Runs against the real Supabase project in .env.local.
 *
 * The signed-in non-admin tests need a normal (non-admin) Supabase user:
 *   TEST_NONADMIN_EMAIL=someone@example.com
 *   TEST_NONADMIN_PASSWORD=...
 * Create it in Supabase > Authentication and do NOT add it to the admins table.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import type { Database } from "@/types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.TEST_NONADMIN_EMAIL;
const password = process.env.TEST_NONADMIN_PASSWORD;

const haveDb = Boolean(url && anonKey && serviceKey);
const haveUser = haveDb && Boolean(email && password);

const client = () =>
  createClient<Database>(url!, anonKey!, { auth: { persistSession: false, autoRefreshToken: false } });

const probe = {
  title: "RLS probe (should never be stored)",
  slug: `rls-probe-${Date.now()}`,
  event_date: "2030-01-01",
  status: "published" as const,
};

let targetEventId: string;
let targetEventTitle: string;
let targetPostId: string;

beforeAll(async () => {
  if (!haveDb) return;
  const admin = createClient<Database>(url!, serviceKey!, { auth: { persistSession: false } });
  const { data: e } = await admin.from("events").select("id, title").limit(1).single();
  const { data: p } = await admin.from("posts").select("id").limit(1).single();
  targetEventId = e!.id;
  targetEventTitle = e!.title;
  targetPostId = p!.id;
});

async function expectNoWrites(db: SupabaseClient<Database>) {
  const insert = await db.from("events").insert(probe).select();
  expect(insert.error?.code).toBe("42501"); // insufficient privilege / RLS violation

  const postInsert = await db.from("posts").insert({ title: probe.title, slug: probe.slug }).select();
  expect(postInsert.error?.code).toBe("42501");

  // Updates and deletes filtered by RLS silently match zero rows.
  const update = await db.from("events").update({ title: "Hacked" }).eq("id", targetEventId).select();
  expect(update.data ?? []).toHaveLength(0);

  const del = await db.from("events").delete().eq("id", targetEventId).select();
  expect(del.data ?? []).toHaveLength(0);

  const postDel = await db.from("posts").delete().eq("id", targetPostId).select();
  expect(postDel.data ?? []).toHaveLength(0);

  const msg = await db.from("messages").select("id").limit(1);
  expect(msg.data ?? []).toHaveLength(0);

  const upload = await db.storage.from("media").upload(`events/rls-probe-${Date.now()}.webp`, new Blob(["x"], { type: "image/webp" }));
  expect(upload.error).not.toBeNull();
}

async function expectUntouched() {
  const admin = createClient<Database>(url!, serviceKey!, { auth: { persistSession: false } });
  const { data: e } = await admin.from("events").select("id, title").eq("id", targetEventId).single();
  expect(e?.title).toBe(targetEventTitle);
  const { data: p } = await admin.from("posts").select("id").eq("id", targetPostId).maybeSingle();
  expect(p?.id).toBe(targetPostId);
  const { data: probes } = await admin.from("events").select("id").eq("slug", probe.slug);
  expect(probes ?? []).toHaveLength(0);
}

describe.skipIf(!haveDb)("RLS: anonymous visitors", () => {
  it("cannot insert, update or delete", async () => {
    await expectNoWrites(client());
    await expectUntouched();
  });

  it("cannot see drafts", async () => {
    const { data } = await client().from("events").select("status");
    expect((data ?? []).every((r) => r.status === "published")).toBe(true);
  });
});

describe.skipIf(!haveUser)("RLS: signed-in non-admin", () => {
  it("is not an admin", async () => {
    const db = client();
    const { error } = await db.auth.signInWithPassword({ email: email!, password: password! });
    expect(error).toBeNull();
    const { data } = await db.rpc("is_admin");
    expect(data).toBe(false);
  });

  it("cannot insert, update or delete", async () => {
    const db = client();
    await db.auth.signInWithPassword({ email: email!, password: password! });
    await expectNoWrites(db);
    await expectUntouched();
  });
});
