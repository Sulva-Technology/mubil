import { getPostBySlug } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";
import { OG_SIZE, renderOgCard } from "@/lib/og/card";

export const alt = "Mubil Foundation news";
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 60;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return renderOgCard({ eyebrow: "News", title: "Mubil Foundation news" });
  return renderOgCard({
    eyebrow: post.category ?? "News",
    title: post.title,
    meta: [post.author, formatDate(post.publish_date)].filter(Boolean).join("  |  "),
  });
}
