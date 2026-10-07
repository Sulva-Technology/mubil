import "server-only";
import { createPublicClient } from "@/lib/supabase/public";
import type { PostRow } from "@/types/database";

export type PostSummary = Pick<
  PostRow,
  "id" | "title" | "slug" | "excerpt" | "cover_image_url" | "category" | "author" | "publish_date"
>;

const SUMMARY = "id, title, slug, excerpt, cover_image_url, category, author, publish_date";
export const NEWS_PAGE_SIZE = 9;

export async function getLatestPosts(limit = 3): Promise<PostSummary[]> {
  const { data, error } = await createPublicClient()
    .from("posts")
    .select(SUMMARY)
    .eq("status", "published")
    .order("publish_date", { ascending: false })
    .limit(limit);
  if (error) console.error("getLatestPosts", error.message);
  return data ?? [];
}

/** Server-side pagination over published posts only. */
export async function getPostsPage({ offset, limit, category }: { offset: number; limit: number; category?: string }) {
  let query = createPublicClient()
    .from("posts")
    .select(SUMMARY, { count: "exact" })
    .eq("status", "published")
    .order("publish_date", { ascending: false })
    .range(offset, offset + limit - 1);
  if (category) query = query.eq("category", category);
  const { data, count, error } = await query;
  if (error) console.error("getPostsPage", error.message);
  return { posts: data ?? [], total: count ?? 0 };
}

export async function getPostCategories(): Promise<string[]> {
  const { data } = await createPublicClient().from("posts").select("category").eq("status", "published");
  return [...new Set((data ?? []).map((p) => p.category).filter((c): c is string => Boolean(c)))].sort();
}

export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  const { data, error } = await createPublicClient()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  if (error) console.error("getPostBySlug", error.message);
  return data;
}

export async function getRelatedPosts(post: Pick<PostRow, "id" | "category">, limit = 3): Promise<PostSummary[]> {
  const client = createPublicClient();
  if (post.category) {
    const { data } = await client
      .from("posts")
      .select(SUMMARY)
      .eq("status", "published")
      .eq("category", post.category)
      .neq("id", post.id)
      .order("publish_date", { ascending: false })
      .limit(limit);
    if (data && data.length >= limit) return data;
  }
  const { data } = await client
    .from("posts")
    .select(SUMMARY)
    .eq("status", "published")
    .neq("id", post.id)
    .order("publish_date", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getPostSlugs(): Promise<string[]> {
  const { data } = await createPublicClient().from("posts").select("slug").eq("status", "published");
  return (data ?? []).map((p) => p.slug);
}

export async function getPostsForSitemap() {
  const { data } = await createPublicClient().from("posts").select("slug, updated_at").eq("status", "published");
  return data ?? [];
}
