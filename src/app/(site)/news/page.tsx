import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { pages } from "@/content";
import { NEWS_PAGE_SIZE, getPostCategories, getPostsPage } from "@/lib/data/posts";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { FeaturedPostCard, PostCard } from "@/components/news/PostCard";

const page = pages.news;

type Props = { searchParams: Promise<{ page?: string; category?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  return {
    title: category ? `${category} news` : "News",
    description: page.intro,
    alternates: { canonical: "/news" },
    openGraph: { title: "News", description: page.intro, url: "/news" },
  };
}

function href(params: { page?: number; category?: string }) {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/news?${qs}` : "/news";
}

export default async function NewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pageNumber = Math.max(1, Math.min(50, Number.parseInt(sp.page ?? "1", 10) || 1));
  const categories = await getPostCategories();
  const category = sp.category && categories.includes(sp.category) ? sp.category : undefined;

  // Featured post (page one, no filter) + every page loaded so far, all rendered on the server.
  const showFeatured = !category;
  const featuredCount = showFeatured ? 1 : 0;
  const { posts, total } = await getPostsPage({ offset: 0, limit: featuredCount + pageNumber * NEWS_PAGE_SIZE, category });
  const [featured, ...rest] = showFeatured ? posts : [undefined, ...posts];
  const hasMore = posts.length < total;

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} intro={page.intro} />

      <Section className="pt-0!">
        {posts.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title={category ? `No ${category} stories yet` : "No news yet"}
            description="Stories from the field will appear here as soon as they are published."
            action={
              category ? (
                <Link href="/news" className={buttonClasses("secondary")}>
                  Show all news
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            {featured && <FeaturedPostCard post={featured} priority className="min-h-[480px] md:min-h-[620px]" />}

            {categories.length > 0 && (
              <nav aria-label="Filter by category" className={featured ? "mt-14" : ""}>
                <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
                  {[undefined, ...categories].map((c) => {
                    const active = c === category;
                    return (
                      <li key={c ?? "all"} className="shrink-0">
                        <Link
                          href={href({ category: c })}
                          scroll={false}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "inline-flex h-10 items-center rounded-chip px-4 text-small font-medium transition-colors duration-300",
                            active ? "bg-brand text-white" : "bg-ice text-brand-deep hover:bg-[color-mix(in_srgb,var(--ice)_70%,var(--sky))]",
                          )}
                        >
                          {c ?? "All"}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}

            {rest.length > 0 && (
              <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) =>
                  post ? (
                    <li key={post.id} className="flex">
                      <PostCard post={post} className="w-full" />
                    </li>
                  ) : null,
                )}
              </ul>
            )}

            {hasMore && (
              <div className="mt-14 flex justify-center">
                <Link href={href({ page: pageNumber + 1, category })} scroll={false} className={buttonClasses("secondary", "lg")}>
                  Load more stories
                </Link>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}
