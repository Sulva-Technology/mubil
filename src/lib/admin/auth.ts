import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type AdminContext =
  | { status: "signed-out" }
  | { status: "not-admin"; email: string | null }
  | { status: "admin"; userId: string; email: string | null; name: string; tourCompleted: boolean };

/** Who is signed in, and are they in the admins table? Cached per request. */
export const getAdminContext = cache(async (): Promise<AdminContext> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || !isAdmin) return { status: "not-admin", email: user.email ?? null };

  const meta = user.user_metadata ?? {};
  const fallbackName = (user.email ?? "there").split("@")[0];
  const name = typeof meta.full_name === "string" && meta.full_name ? meta.full_name.split(" ")[0] : fallbackName;
  return {
    status: "admin",
    userId: user.id,
    email: user.email ?? null,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    tourCompleted: meta.tour_completed === true,
  };
});

export class NotAdminError extends Error {
  constructor() {
    super("You don't have permission to do that.");
  }
}

/**
 * Every admin Server Action calls this first. It re-checks is_admin() on the
 * server and returns a client bound to the user's session, so RLS applies too.
 */
export async function requireAdmin() {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") throw new NotAdminError();
  return { ctx, supabase: await createClient() };
}
