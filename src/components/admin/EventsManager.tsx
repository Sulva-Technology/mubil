"use client";

import Image from "@/components/ui/Img";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { CalendarPlus, CalendarX2, Eye, EyeOff, Pencil, Search, Star, Trash2 } from "lucide-react";
import { deleteEvent, setEventStatus } from "@/app/admin/actions";
import type { EventRow } from "@/types/database";
import { formatDate, formatTimeRange } from "@/lib/format";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { EventEditor } from "./EventEditor";
import { ConfirmDialog, FilterChips, StatusBadge } from "./ui";

type StatusFilter = "all" | "published" | "draft";

function RowActions({
  event,
  onEdit,
  onToggle,
  onDelete,
  busy,
}: {
  event: EventRow;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const btn = "grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-bg hover:text-ink disabled:opacity-40";
  return (
    <div className="flex items-center justify-end gap-0.5">
      <button type="button" onClick={onEdit} className={btn} aria-label={`Edit ${event.title}`} title="Edit">
        <Pencil aria-hidden className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        disabled={busy}
        className={btn}
        aria-label={event.status === "published" ? `Unpublish ${event.title}` : `Publish ${event.title}`}
        title={event.status === "published" ? "Unpublish" : "Publish"}
      >
        {event.status === "published" ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
      </button>
      <button type="button" onClick={onDelete} className={`${btn} hover:text-error`} aria-label={`Delete ${event.title}`} title="Delete">
        <Trash2 aria-hidden className="size-4" />
      </button>
    </div>
  );
}

export function EventsManager({ events }: { events: EventRow[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [status, setStatus] = useState<StatusFilter>((params.get("status") as StatusFilter) || "all");
  const [toDelete, setToDelete] = useState<EventRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const editId = params.get("edit");
  const creating = params.get("new") === "1";
  const editing = editId ? (events.find((e) => e.id === editId) ?? null) : null;

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
      all: events.length,
      published: events.filter((e) => e.status === "published").length,
      draft: events.filter((e) => e.status === "draft").length,
    }),
    [events],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter(
      (e) =>
        (status === "all" || e.status === status) &&
        (!q || [e.title, e.venue, e.address, e.slug].some((f) => f?.toLowerCase().includes(q))),
    );
  }, [events, query, status]);

  function toggle(event: EventRow) {
    startTransition(async () => {
      const result = await setEventStatus(event.id, event.status === "published" ? "draft" : "published");
      toast(result.ok ? (result.message ?? "Updated") : result.message, result.ok ? "success" : "error");
      router.refresh();
    });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deleteEvent(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    toast(result.ok ? (result.message ?? "Deleted") : result.message, result.ok ? "success" : "error");
    router.refresh();
  }

  const closeEditor = useCallback(() => setParam("edit", null), [setParam]);
  const onSaved = useCallback(() => router.refresh(), [router]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Events</h1>
          <p className="mt-1 text-ink-2">Create, publish and update events on the website.</p>
        </div>
        <button type="button" onClick={() => setParam("new", "1")} className={buttonClasses("primary")}>
          <CalendarPlus aria-hidden className="size-4" />
          Add event
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
          <span className="sr-only">Search events</span>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or venue"
            className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-small outline-none focus:border-brand"
          />
        </label>
      </div>

      <div className="mt-6">
        {events.length === 0 ? (
          <EmptyState
            icon={CalendarPlus}
            title="No events yet"
            description="Click Add event to create your first one."
            action={
              <button type="button" onClick={() => setParam("new", "1")} className={buttonClasses("primary")}>
                Add event
              </button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState icon={CalendarX2} title="No events match" description="Try a different search or filter." />
        ) : (
          <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
            <table className="w-full text-left">
              <thead className="hidden border-b border-line bg-bg text-[0.8125rem] text-ink-2 md:table-header-group">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Event
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((event) => (
                  <tr key={event.id} className="flex flex-col gap-3 p-4 md:table-row md:p-0">
                    <td className="md:px-5 md:py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-chip bg-ice">
                          {event.cover_image_url && <Image src={event.cover_image_url} alt="" fill sizes="48px" className="object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <button type="button" onClick={() => setParam("edit", event.id)} className="block max-w-[38ch] truncate text-left font-medium hover:text-brand">
                            {event.title}
                          </button>
                          <p className="flex items-center gap-1.5 truncate text-[0.8125rem] text-ink-2">
                            {event.featured && <Star aria-label="Featured" className="size-3.5 fill-warning text-warning" />}
                            {event.venue ?? "No venue yet"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-small md:px-5 md:py-3.5">
                      <span className="text-ink">{formatDate(event.event_date, { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="ml-2 text-ink-2 md:ml-0 md:block">{formatTimeRange(event.start_time, event.end_time)}</span>
                    </td>
                    <td className="flex items-center justify-between md:table-cell md:px-5 md:py-3.5">
                      <StatusBadge status={event.status} />
                      <div className="md:hidden">
                        <RowActions event={event} busy={pending} onEdit={() => setParam("edit", event.id)} onToggle={() => toggle(event)} onDelete={() => setToDelete(event)} />
                      </div>
                    </td>
                    <td className="hidden md:table-cell md:px-3 md:py-3.5">
                      <RowActions event={event} busy={pending} onEdit={() => setParam("edit", event.id)} onToggle={() => toggle(event)} onDelete={() => setToDelete(event)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EventEditor event={editing} open={creating || Boolean(editing)} onClose={closeEditor} onSaved={onSaved} />

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this event?"
        body={
          <>
            <strong className="font-medium text-ink">{toDelete?.title}</strong> will be removed from the website and from this
            list. This can&apos;t be undone. To hide it instead, unpublish it.
          </>
        }
        confirmLabel="Delete event"
        busy={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
