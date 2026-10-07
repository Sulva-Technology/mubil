"use client";

import dynamic from "next/dynamic";
import { useState, type FormEvent } from "react";
import { isSlugAvailable, saveEvent } from "@/app/admin/actions";
import type { EventRow } from "@/types/database";
import type { FieldErrors } from "@/lib/admin/schemas";
import { slugify } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";
import { EditorFooter, RestoreBanner } from "./EditorChrome";
import { ImageDropzone } from "./ImageDropzone";
import { ConfirmDialog, FormField, SidePanel, Toggle, inputClass } from "./ui";
import { useDraftForm } from "./useDraftForm";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-[290px] animate-pulse rounded-chip bg-ice" />,
});

type Values = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  address: string;
  map_link: string;
  cover_image_url: string;
  status: "draft" | "published";
  featured: boolean;
};

function toValues(e?: EventRow | null): Values {
  return {
    title: e?.title ?? "",
    slug: e?.slug ?? "",
    excerpt: e?.excerpt ?? "",
    description: e?.description ?? "",
    event_date: e?.event_date ?? "",
    start_time: e?.start_time?.slice(0, 5) ?? "",
    end_time: e?.end_time?.slice(0, 5) ?? "",
    venue: e?.venue ?? "",
    address: e?.address ?? "",
    map_link: e?.map_link ?? "",
    cover_image_url: e?.cover_image_url ?? "",
    status: e?.status ?? "draft",
    featured: e?.featured ?? false,
  };
}

const FORM_ID = "event-editor";

function EditorBody({ event, onClose, onSaved }: { event: EventRow | null; onClose: () => void; onSaved: () => void }) {
  const { toast } = useToast();
  const initial = toValues(event);
  const form = useDraftForm<Values>(`mubil-admin:event:${event?.id ?? "new"}`, initial);
  const { values: v, set } = form;
  const [id, setId] = useState(event?.id);
  const [slugEdited, setSlugEdited] = useState(Boolean(event));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  function onTitle(title: string) {
    set("title", title);
    if (!slugEdited) set("slug", slugify(title));
  }

  async function checkSlug() {
    if (!v.slug) return;
    const free = await isSlugAvailable("events", v.slug, id);
    setErrors((e) => ({ ...e, slug: free ? "" : "Another event already uses this web address." }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await saveEvent({ ...v, id });
    setSaving(false);
    if (!result.ok) {
      setErrors(result.fieldErrors ?? {});
      toast(result.message, "error");
      const first = Object.keys(result.fieldErrors ?? {})[0];
      if (first) document.getElementById(`event-${first}`)?.focus();
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
  const aria = (k: keyof Values) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `event-${k}-error` } : {});

  return (
    <SidePanel
      open
      onClose={requestClose}
      title={event ? "Edit event" : "New event"}
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
        <FormField label="Title" htmlFor="event-title" error={err("title")}>
          <input id="event-title" className={inputClass} value={v.title} onChange={(e) => onTitle(e.target.value)} {...aria("title")} />
        </FormField>

        <FormField
          label="Web address"
          htmlFor="event-slug"
          error={err("slug")}
          hint="Made from the title. It becomes the end of the page link, so avoid changing it after sharing."
        >
          <div className="flex items-center overflow-hidden rounded-chip border border-line bg-white focus-within:border-brand focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_14%,transparent)]">
            <span className="hidden pl-3.5 text-[0.9375rem] text-ink-2 sm:inline">/events/</span>
            <input
              id="event-slug"
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

        <FormField label="Short summary" htmlFor="event-excerpt" optional error={err("excerpt")} hint="One or two sentences. Shown on event cards and in link previews on WhatsApp and Facebook.">
          <textarea id="event-excerpt" rows={2} maxLength={300} className={`${inputClass} h-auto py-2.5`} value={v.excerpt} onChange={(e) => set("excerpt", e.target.value)} {...aria("excerpt")} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Date" htmlFor="event-event_date" error={err("event_date")}>
            <input id="event-event_date" type="date" className={inputClass} value={v.event_date} onChange={(e) => set("event_date", e.target.value)} {...aria("event_date")} />
          </FormField>
          <FormField label="Starts" htmlFor="event-start_time" optional error={err("start_time")}>
            <input id="event-start_time" type="time" className={inputClass} value={v.start_time} onChange={(e) => set("start_time", e.target.value)} {...aria("start_time")} />
          </FormField>
          <FormField label="Ends" htmlFor="event-end_time" optional error={err("end_time")}>
            <input id="event-end_time" type="time" className={inputClass} value={v.end_time} onChange={(e) => set("end_time", e.target.value)} {...aria("end_time")} />
          </FormField>
        </div>

        <FormField label="Cover image" htmlFor="event-cover_image_url" optional error={err("cover_image_url")} hint="Landscape photos work best. Any size is fine: we resize to 1600px wide and convert to WebP.">
          <ImageDropzone id="event-cover_image_url" folder="events" value={v.cover_image_url} onChange={(url) => set("cover_image_url", url)} invalid={Boolean(errors.cover_image_url)} />
        </FormField>

        <FormField label="Description" htmlFor="event-description" optional error={err("description")}>
          <RichTextEditor id="event-description" value={v.description} onChange={(html) => set("description", html)} placeholder="What will happen, who it's for, what to bring..." />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Venue" htmlFor="event-venue" optional error={err("venue")}>
            <input id="event-venue" className={inputClass} value={v.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Makoko Community Hall" />
          </FormField>
          <FormField label="Address" htmlFor="event-address" optional error={err("address")}>
            <input id="event-address" className={inputClass} value={v.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, area, city" />
          </FormField>
        </div>

        <FormField label="Map link" htmlFor="event-map_link" optional error={err("map_link")} hint="Paste a Google Maps link. If empty, we search the address instead.">
          <input id="event-map_link" type="url" className={inputClass} value={v.map_link} onChange={(e) => set("map_link", e.target.value)} placeholder="https://maps.google.com/..." {...aria("map_link")} />
        </FormField>

        <div className="flex items-start justify-between gap-6 rounded-card border border-line bg-white p-4">
          <div>
            <label htmlFor="event-featured" className="font-medium">
              Featured
            </label>
            <p className="mt-0.5 text-[0.8125rem] text-ink-2">Featured events are highlighted first when several happen in the same week.</p>
          </div>
          <Toggle id="event-featured" label="Featured" checked={v.featured} onChange={(c) => set("featured", c)} />
        </div>

        <p className="flex gap-2 rounded-card bg-ice p-4 text-[0.8125rem] text-brand-deep">
          <span className="font-semibold">Draft or Published?</span>
          Drafts are only visible here. Published events appear on the website within a minute.
        </p>
      </form>

      <ConfirmDialog
        open={confirmClose}
        title="Leave without saving?"
        body="Your changes are backed up on this device, so you can restore them next time you open this event."
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

/** Mount a fresh editor per item so form state never leaks between events. */
export function EventEditor({ event, open, onClose, onSaved }: { event: EventRow | null; open: boolean; onClose: () => void; onSaved: () => void }) {
  if (!open) return null;
  return <EditorBody key={event?.id ?? "new"} event={event} onClose={onClose} onSaved={onSaved} />;
}
