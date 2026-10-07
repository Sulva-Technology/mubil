"use client";

import Image from "@/components/ui/Img";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Eye, EyeOff, FileSearch, Newspaper, Pencil, PenSquare, Search, Trash2 } from "lucide-react";
import { deletePost, setPostStatus } from "@/app/admin/actions";
import type { PostRow } from "@/types/database";
import { formatDate } from "@/lib/format";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { PostEditor } from "./PostEditor";
import { ConfirmDialog, FilterChips, StatusBadge } from "./ui";

type StatusFilter = "all" | "published" | "draft";

export function NewsManager({ posts, defaultAuthor }: { posts: PostRow[]; defaultAuthor: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [status, setStatus] = useState<StatusFilter>((params.get("status") as StatusFilter) || "all");
  const [toDelete, setToDelete] = useState<PostRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const editId = params.get("edit");
  const creating = params.get("new") === "1";
  const editing = editId ? (posts.find((p) => p.id === editId) ?? null) : null;
  const categories = useMemo(() => [...new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))].sort(), [posts]);

  const setParam = useCallback(
    (key: "edit" | "new", value: string | null) => {
      const sp = new URLSearchParams(params.toString());
      sp.delete("edit");
      sp.delete("new");
      if (value) sp.set(key, value);
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
    }),
    [posts],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (status === "all" || p.status === status) &&
        (!q || [p.title, p.category, p.author, p.slug].some((f) => f?.toLowerCase().includes(q))),
    );
  }, [posts, query, status]);

  function toggle(post: PostRow) {
    startTransition(async () => {
      const result = await setPostStatus(post.id, post.status === "published" ? "draft" : "published");
      toast(result.ok ? (result.message ?? "Updated") : result.message, result.ok ? "success" : "error");
      router.refresh();
    });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deletePost(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    toast(result.ok ? (result.message ?? "Deleted") : result.message, result.ok ? "success" : "error");
    router.refresh();
  }

  const closeEditor = useCallback(() => setParam("edit", null), [setParam]);
  const onSaved = useCallback(() => router.refresh(), [router]);
  const btn = "grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-bg hover:text-ink disabled:opacity-40";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">News</h1>
          <p className="mt-1 text-ink-2">Write stories and announcements for the News page.</p>
        </div>
        <button type="button" onClick={() => setParam("new", "1")} className={buttonClasses("primary")}>
          <PenSquare aria-hidden className="size-4" />
          Add news post
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips
          label="Filter by status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All", count: counts.all },
            { value: "published", label: "Published", count: counts.published },
            { value: "draft", label: "Drafts", count: counts.draft },
          ]}
        />
        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search news</span>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by headline or category"
            className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-small outline-none focus:border-brand"
          />
        </label>
      </div>

      <div className="mt-6">
        {posts.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No news yet"
            description="Click Add news post to write your first story."
            action={
              <button type="button" onClick={() => setParam("new", "1")} className={buttonClasses("primary")}>
                Add news post
              </button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState icon={FileSearch} title="No posts match" description="Try a different search or filter." />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface shadow-card">
            {visible.map((post) => (
              <li key={post.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-chip bg-ice">
                    {post.cover_image_url && <Image src={post.cover_image_url} alt="" fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <button type="button" onClick={() => setParam("edit", post.id)} className="block max-w-full truncate text-left font-medium hover:text-brand">
                      {post.title}
                    </button>
                    <p className="truncate text-[0.8125rem] text-ink-2">
                      {[post.category, post.author, formatDate(post.publish_date, { day: "numeric", month: "short", year: "numeric" })].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <StatusBadge status={post.status} />
                  <div className="flex items-center gap-0.5">
                    <button type="button" onClick={() => setParam("edit", post.id)} className={btn} aria-label={`Edit ${post.title}`} title="Edit">
                      <Pencil aria-hidden className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggle(post)}
                      disabled={pending}
                      className={btn}
                      aria-label={post.status === "published" ? `Unpublish ${post.title}` : `Publish ${post.title}`}
                      title={post.status === "published" ? "Unpublish" : "Publish"}
                    >
                      {post.status === "published" ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
                    </button>
                    <button type="button" onClick={() => setToDelete(post)} className={`${btn} hover:text-error`} aria-label={`Delete ${post.title}`} title="Delete">
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <PostEditor
        post={editing}
        open={creating || Boolean(editing)}
        categories={categories}
        defaultAuthor={defaultAuthor}
        onClose={closeEditor}
        onSaved={onSaved}
      />

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this post?"
        body={
          <>
            <strong className="font-medium text-ink">{toDelete?.title}</strong> will be removed from the website. This
            can&apos;t be undone. To hide it instead, unpublish it.
          </>
        }
        confirmLabel="Delete post"
        busy={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
