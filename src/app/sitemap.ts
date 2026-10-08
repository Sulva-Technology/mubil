import type { MetadataRoute } from "next";
import { programmes } from "@/content";
import { getEventsForSitemap } from "@/lib/data/events";
import { getPostsForSitemap } from "@/lib/data/posts";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, posts] = await Promise.all([getEventsForSitemap(), getPostsForSitemap()]);
  const now = new Date();

  const pages = ["/", "/about", "/programmes", "/events", "/news", "/gallery", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/events" || path === "/news" ? ("daily" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.8,
  }));

  return [
    ...pages,
    ...programmes.map((p) => ({ url: absoluteUrl(`/programmes/${p.slug}`), lastModified: now, priority: 0.7 })),
    ...events.map((e) => ({ url: absoluteUrl(`/events/${e.slug}`), lastModified: new Date(e.updated_at), priority: 0.6 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/news/${p.slug}`), lastModified: new Date(p.updated_at), priority: 0.6 })),
  ];
}
