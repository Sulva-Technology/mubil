"use client";

import dynamic from "next/dynamic";
import { useState, type FormEvent } from "react";
import { isSlugAvailable, savePost } from "@/app/admin/actions";
import type { PostRow } from "@/types/database";
import type { FieldErrors } from "@/lib/admin/schemas";
import { slugify, todayInLagos } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";
import { EditorFooter, RestoreBanner } from "./EditorChrome";
import { ImageDropzone } from "./ImageDropzone";
import { ConfirmDialog, FormField, SidePanel, inputClass } from "./ui";
import { useDraftForm } from "./useDraftForm";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-[290px] animate-pulse rounded-chip bg-ice" />,
});

type Values = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  category: string;
  author: string;
  publish_date: string;
  status: "draft" | "published";
};

function toValues(p: PostRow | null, defaultAuthor: string): Values {
  return {
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    excerpt: p?.excerpt ?? "",
    body: p?.body ?? "",
    cover_image_url: p?.cover_image_url ?? "",
    category: p?.category ?? "",
    author: p?.author ?? defaultAuthor,
    publish_date: (p?.publish_date ?? todayInLagos()).slice(0, 10),
    status: p?.status ?? "draft",
  };
}

const FORM_ID = "post-editor";

function EditorBody({
  post,
  categories,
  defaultAuthor,
  onClose,
  onSaved,
}: {
  post: PostRow | null;
  categories: string[];
  defaultAuthor: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const form = useDraftForm<Values>(`mubil-admin:post:${post?.id ?? "new"}`, toValues(post, defaultAuthor));
  const { values: v, set } = form;
  const [id, setId] = useState(post?.id);
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  function onTitle(title: string) {
    set("title", title);
    if (!slugEdited) set("slug", slugify(title));
  }

  async function checkSlug() {
    if (!v.slug) return;
    const free = await isSlugAvailable("posts", v.slug, id);
    setErrors((e) => ({ ...e, slug: free ? "" : "Another post already uses this web address." }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await savePost({ ...v, id });
    setSaving(false);
    if (!result.ok) {
      setErrors(result.fieldErrors ?? {});
      toast(result.message, "error");
      const first = Object.keys(result.fieldErrors ?? {})[0];
      if (first) document.getElementById(`post-${first}`)?.focus();
      return;
    }
    setErrors({});
    if (result.data) setId(result.data.id);
    form.markSaved(v);
    toast(result.message ?? "Saved");
    onSaved();
  }

  function requestClose() {
    if (form.dirty) setConfirmClose(true);
    else onClose();
  }

  const err = (k: keyof Values) => errors[k] || undefined;
  const aria = (k: keyof Values) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `post-${k}-error` } : {});

  return (
    <SidePanel
      open
      onClose={requestClose}
      title={post ? "Edit news post" : "New news post"}
      footer={
        <EditorFooter
          formId={FORM_ID}
          status={v.status}
          onStatus={(s) => set("status", s)}
          dirty={form.dirty}
          autosavedAt={form.autosavedAt}
          saving={saving}
          onCancel={requestClose}
        />
      }
    >
      {form.restorable && (
        <RestoreBanner savedAt={form.restorable.savedAt} onRestore={form.restore} onDiscard={form.discardRestorable} />
      )}

      <form id={FORM_ID} onSubmit={onSubmit} noValidate className="space-y-6">
        <FormField label="Headline" htmlFor="post-title" error={err("title")}>
          <input id="post-title" className={inputClass} value={v.title} onChange={(e) => onTitle(e.target.value)} {...aria("title")} />
        </FormField>

        <FormField label="Web address" htmlFor="post-slug" error={err("slug")} hint="Made from the headline. Avoid changing it after the post has been shared.">
          <div className="flex items-center overflow-hidden rounded-chip border border-line bg-white focus-within:border-brand focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_14%,transparent)]">
            <span className="hidden pl-3.5 text-[0.9375rem] text-ink-2 sm:inline">/news/</span>
            <input
              id="post-slug"
              className="h-11 w-full bg-transparent px-3.5 text-[0.9375rem] outline-none sm:pl-0.5"
              value={v.slug}
              onChange={(e) => {
                setSlugEdited(true);
                set("slug", slugify(e.target.value));
              }}
              onBlur={checkSlug}
              {...aria("slug")}
            />
          </div>
        </FormField>

        <FormField label="Short summary" htmlFor="post-excerpt" optional error={err("excerpt")} hint="Shown under the headline, on news cards and in link previews.">
          <textarea id="post-excerpt" rows={2} maxLength={300} className={`${inputClass} h-auto py-2.5`} value={v.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        </FormField>

        <FormField label="Cover image" htmlFor="post-cover_image_url" optional error={err("cover_image_url")} hint="Landscape photos work best. We resize to 1600px wide and convert to WebP.">
          <ImageDropzone id="post-cover_image_url" folder="posts" value={v.cover_image_url} onChange={(url) => set("cover_image_url", url)} />
        </FormField>

        <FormField label="Story" htmlFor="post-body" optional error={err("body")} hint="Use Pull quote to highlight a powerful line from someone you met.">
          <RichTextEditor id="post-body" value={v.body} onChange={(html) => set("body", html)} placeholder="Write the story..." />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Category" htmlFor="post-category" optional error={err("category")}>
            <input id="post-category" list="post-categories" className={inputClass} value={v.category} onChange={(e) => set("category", e.target.value)} placeholder="Stories" />
            <datalist id="post-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </FormField>
          <FormField label="Author" htmlFor="post-author" optional error={err("author")}>
            <input id="post-author" className={inputClass} value={v.author} onChange={(e) => set("author", e.target.value)} />
          </FormField>
          <FormField label="Publish date" htmlFor="post-publish_date" error={err("publish_date")}>
            <input id="post-publish_date" type="date" className={inputClass} value={v.publish_date} onChange={(e) => set("publish_date", e.target.value)} {...aria("publish_date")} />
          </FormField>
        </div>

        <p className="flex gap-2 rounded-card bg-ice p-4 text-[0.8125rem] text-brand-deep">
          <span className="font-semibold">Draft or Published?</span>
          Drafts are only visible here. Published posts appear on the News page within a minute, newest first.
        </p>
      </form>

      <ConfirmDialog
        open={confirmClose}
        title="Leave without saving?"
        body="Your changes are backed up on this device, so you can restore them next time you open this post."
        confirmLabel="Leave"
        onCancel={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
      />
    </SidePanel>
  );
}

export function PostEditor({
  post,
  open,
  categories,
  defaultAuthor,
  onClose,
  onSaved,
}: {
  post: PostRow | null;
  open: boolean;
  categories: string[];
  defaultAuthor: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  if (!open) return null;
  return <EditorBody key={post?.id ?? "new"} post={post} categories={categories} defaultAuthor={defaultAuthor} onClose={onClose} onSaved={onSaved} />;
}
