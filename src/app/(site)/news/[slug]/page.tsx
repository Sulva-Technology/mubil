import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { site } from "@/content";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/data/posts";
import { formatDate, readingTime } from "@/lib/format";
import { sanitizeRichText } from "@/lib/sanitize";
import { absoluteUrl, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShareRow } from "@/components/share/ShareRow";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { PostCard } from "@/components/news/PostCard";
import { ReadingProgress } from "@/components/news/ReadingProgress";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Story not found" };
  const path = `/news/${post.slug}`;
  const description = post.excerpt ?? undefined;
  return {
    title: post.title,
    description,
    authors: post.author ? [{ name: post.author }] : undefined,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: post.title,
      description,
      publishedTime: post.publish_date,
      modifiedTime: post.updated_at,
      authors: post.author ? [post.author] : undefined,
      section: post.category ?? undefined,
    },
    twitter: { card: "summary_large_image", title: post.title, description },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const url = absoluteUrl(`/news/${post.slug}`);
  const minutes = readingTime(post.body);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.publish_date,
    dateModified: post.updated_at,
    author: post.author ? [{ "@type": "Person", name: post.author }] : undefined,
    publisher: { "@type": "NGO", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/icon") } },
    mainEntityOfPage: url,
  };

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={[
          articleJsonLd,
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "News", path: "/news" },
            { name: post.title, path: `/news/${post.slug}` },
          ]),
        ]}
      />

      <article className="pb-20 pt-32 md:pt-40">
        <header className="container-page">
          <div className="mx-auto max-w-[680px]">
            <Link href="/news" className="inline-flex items-center gap-1 rounded text-small font-medium text-brand hover:text-brand-deep">
              <ChevronLeft aria-hidden className="size-4" />
              All news
            </Link>
            {post.category && (
              <p className="mt-8 text-eyebrow font-semibold uppercase text-brand">{post.category}</p>
            )}
            <h1 className="mt-4 text-h1 font-semibold">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-[1.1875rem] leading-relaxed text-ink-2 md:text-[1.375rem]">{post.excerpt}</p>}
            <div className="mt-8 flex items-center gap-4 border-y border-line py-4 text-small">
              <span aria-hidden className="grid size-10 place-items-center rounded-full bg-ice font-display font-semibold text-brand">
                {(post.author ?? site.shortName).charAt(0)}
              </span>
              <div>
                <p className="font-medium">{post.author ?? site.name}</p>
                <p className="text-ink-2">
                  <time dateTime={post.publish_date}>{formatDate(post.publish_date)}</time>
                  <span aria-hidden className="mx-2">
                    /
                  </span>
                  {minutes} min read
                </p>
              </div>
            </div>
          </div>
        </header>

        {post.cover_image_url && (
          <div className="container-page mt-10 md:mt-14">
            <div className="relative aspect-[4/3] overflow-hidden rounded-panel bg-ice sm:aspect-[2/1]">
              <Image src={post.cover_image_url} alt="" fill priority sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
            </div>
          </div>
        )}

        <div className="container-page mt-12 md:mt-16">
          <div
            className="prose-mubil mx-auto"
            dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.body) }}
          />
          <div className="mx-auto mt-14 max-w-[680px] border-t border-line pt-8">
            <ShareRow url={url} title={post.title} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <Section tone="surface" aria-labelledby="related-title">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <h2 id="related-title" className="text-h2 font-semibold">
              Keep reading
            </h2>
            <Button href="/news" variant="tertiary">
              All news
            </Button>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.id} className="flex">
                <PostCard post={p} className="w-full" />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
