import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Glass } from "@/components/ui/Glass";

const FALLBACK = "/placeholders/landscape.svg";

function Chip({ children }: { children: string }) {
  return (
    <Glass
      variant="strong"
      className="absolute left-4 top-4 rounded-chip px-3 py-1.5 text-[0.8125rem] font-medium text-ink"
    >
      {children}
    </Glass>
  );
}

/** Standard news card: image, category chip, title, date. */
export function PostCard({
  post,
  className,
  horizontal = false,
  sizes = "(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw",
}: {
  post: PostSummary;
  className?: string;
  /** Image beside the text on large screens. */
  horizontal?: boolean;
  sizes?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-lift",
        horizontal && "lg:flex-row",
        className,
      )}
    >
      <div className={cn("relative aspect-[3/2] overflow-hidden bg-ice", horizontal && "lg:aspect-auto lg:w-[44%] lg:shrink-0")}>
        <Image
          src={post.cover_image_url ?? FALLBACK}
          alt=""
          fill
          sizes={sizes}
          unoptimized={!post.cover_image_url}
          className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
        />
        {post.category && <Chip>{post.category}</Chip>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em]">
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-small text-ink-2">{post.excerpt}</p>}
        <p className="mt-auto pt-5 text-small text-ink-2">
          <time dateTime={post.publish_date}>{formatDate(post.publish_date)}</time>
        </p>
      </div>
    </article>
  );
}

/** Large featured post: full image with a glass panel. */
export function FeaturedPostCard({ post, className, priority = false }: { post: PostSummary; className?: string; priority?: boolean }) {
  return (
    <article
      className={cn(
        "group relative min-h-[420px] overflow-hidden rounded-panel bg-brand-deep shadow-card transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Image
        src={post.cover_image_url ?? FALLBACK}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 800px, 100vw"
        unoptimized={!post.cover_image_url}
        className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night/60 to-transparent" />
      <Glass variant="strong" className="absolute inset-x-3 bottom-3 rounded-card p-6 md:inset-x-5 md:bottom-5 md:p-8">
        <p className="flex items-center gap-3 text-small text-ink-2">
          {post.category && <span className="rounded-chip bg-ice px-2.5 py-1 font-medium text-brand-deep">{post.category}</span>}
          <time dateTime={post.publish_date}>{formatDate(post.publish_date)}</time>
        </p>
        <h3 className="mt-3 max-w-[28ch] font-display text-h3 font-semibold text-ink">
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0 after:rounded-panel">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 max-w-[60ch] text-ink-2">{post.excerpt}</p>}
      </Glass>
    </article>
  );
}
