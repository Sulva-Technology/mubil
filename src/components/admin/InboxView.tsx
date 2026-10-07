"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Inbox, Mail, MailOpen, Phone, Reply, Search } from "lucide-react";
import { setMessageRead } from "@/app/admin/actions";
import type { MessageRow } from "@/types/database";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { FilterChips, SidePanel } from "./ui";

type Filter = "all" | "unread";

function when(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }).format(new Date(iso));
}

export function InboxView({ messages }: { messages: MessageRow[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { toast } = useToast();
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState(params.get("q") ?? "");
  // Optimistic read flags so the dot disappears immediately.
  const [readOverrides, setReadOverrides] = useState<Record<string, boolean>>({});

  const openId = params.get("open");
  const isRead = useCallback((m: MessageRow) => readOverrides[m.id] ?? m.read, [readOverrides]);
  const open = openId ? (messages.find((m) => m.id === openId) ?? null) : null;

  const setRead = useCallback(
    (m: MessageRow, read: boolean, quiet = false) => {
      setReadOverrides((o) => ({ ...o, [m.id]: read }));
      startTransition(async () => {
        const result = await setMessageRead(m.id, read);
        if (!result.ok) {
          setReadOverrides((o) => ({ ...o, [m.id]: !read }));
          toast(result.message, "error");
        } else if (!quiet) {
          toast(read ? "Marked as read" : "Marked as unread");
        }
        router.refresh();
      });
    },
    [router, toast],
  );

  // Opening a message marks it read.
  useEffect(() => {
    if (open && !isRead(open)) setRead(open, true, true);
  }, [open, isRead, setRead]);

  const setOpen = useCallback(
    (id: string | null) => {
      const sp = new URLSearchParams(params.toString());
      if (id) sp.set("open", id);
      else sp.delete("open");
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const unreadCount = messages.filter((m) => !isRead(m)).length;
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter(
      (m) => (filter === "all" || !isRead(m)) && (!q || [m.name, m.email, m.subject, m.message].some((f) => f?.toLowerCase().includes(q))),
    );
  }, [messages, filter, query, isRead]);

  const close = useCallback(() => setOpen(null), [setOpen]);

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold">Inbox</h1>
      <p className="mt-1 text-ink-2">Messages sent through the contact form on the website.</p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterChips
          label="Filter messages"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All", count: messages.length },
            { value: "unread", label: "Unread", count: unreadCount },
          ]}
        />
        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Search messages</span>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or text"
            className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-small outline-none focus:border-brand"
          />
        </label>
      </div>

      <div className="mt-6">
        {messages.length === 0 ? (
          <EmptyState icon={Inbox} title="No messages yet" description="When someone uses the contact form, their message appears here and in your email." />
        ) : visible.length === 0 ? (
          <EmptyState icon={MailOpen} title={filter === "unread" ? "You're all caught up" : "No messages match"} description={filter === "unread" ? "Every message has been read." : "Try a different search."} />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-surface shadow-card">
            {visible.map((m) => {
              const unread = !isRead(m);
              return (
                <li key={m.id}>
                  <button type="button" onClick={() => setOpen(m.id)} className="flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-bg sm:px-5">
                    <span aria-hidden className={cn("mt-2 size-2.5 shrink-0 rounded-full", unread ? "bg-brand" : "bg-transparent")} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className={cn("truncate", unread ? "font-semibold" : "font-medium text-ink-2")}>{m.name}</span>
                        <time dateTime={m.created_at} className="shrink-0 text-[0.8125rem] text-ink-2">
                          {when(m.created_at)}
                        </time>
                      </span>
                      <span className={cn("block truncate text-small", unread ? "font-medium text-ink" : "text-ink-2")}>{m.subject ?? "No subject"}</span>
                      <span className="block truncate text-small text-ink-2">{m.message}</span>
                    </span>
                    <span className="sr-only">{unread ? "Unread" : "Read"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <SidePanel
        open={open !== null}
        onClose={close}
        title={open?.subject ?? "Message"}
        width="max-w-xl"
        footer={
          open && (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => setRead(open, !isRead(open))} className={buttonClasses("secondary")}>
                {isRead(open) ? <Mail aria-hidden className="size-4" /> : <MailOpen aria-hidden className="size-4" />}
                {isRead(open) ? "Mark as unread" : "Mark as read"}
              </button>
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject ?? "Your message to Mubil Foundation"}`)}`}
                className={buttonClasses("primary")}
              >
                <Reply aria-hidden className="size-4" />
                Reply by email
              </a>
            </div>
          )
        }
      >
        {open && (
          <article>
            <div className="flex items-center gap-3">
              <span aria-hidden className="grid size-11 place-items-center rounded-full bg-ice font-display font-semibold text-brand">
                {open.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="font-medium">{open.name}</p>
                <p className="truncate text-small text-ink-2">{open.email}</p>
              </div>
            </div>
            <dl className="mt-6 grid gap-3 rounded-card border border-line bg-white p-4 text-small sm:grid-cols-2">
              <div>
                <dt className="text-ink-2">Received</dt>
                <dd className="font-medium">{formatDate(open.created_at, { weekday: "short", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</dd>
              </div>
              {open.phone && (
                <div>
                  <dt className="text-ink-2">Phone</dt>
                  <dd>
                    <a href={`tel:${open.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 font-medium text-brand">
                      <Phone aria-hidden className="size-3.5" />
                      {open.phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
            <p className="mt-6 whitespace-pre-wrap leading-relaxed text-ink">{open.message}</p>
          </article>
        )}
      </SidePanel>
    </div>
  );
}
