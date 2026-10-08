import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CalendarPlus, FilePen, Inbox, Mail, Newspaper, PenSquare } from "lucide-react";
import { getAdminContext } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { Greeting } from "@/components/admin/Greeting";

export const metadata: Metadata = { title: "Overview" };

type Activity = { id: string; kind: "event" | "post" | "message"; title: string; detail: string; at: string; href: string };

export default async function OverviewPage() {
  const ctx = await getAdminContext();
  const name = ctx.status === "admin" ? ctx.name : "";
  const supabase = await createClient();

  const count = (table: "events" | "posts", status: "draft" | "published") =>
    supabase.from(table).select("id", { count: "exact", head: true }).eq("status", status);

  const [pubEvents, draftEvents, pubPosts, unread, recentEvents, recentPosts, recentMessages] = await Promise.all([
    count("events", "published"),
    count("events", "draft"),
    count("posts", "published"),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
    supabase.from("events").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("posts").select("id, title, status, updated_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("messages").select("id, name, subject, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Published events", value: pubEvents.count ?? 0, icon: CalendarDays, href: "/admin/events?status=published", tour: "stat-published" },
    { label: "Draft events", value: draftEvents.count ?? 0, icon: FilePen, href: "/admin/events?status=draft", tour: "stat-drafts" },
    { label: "Published posts", value: pubPosts.count ?? 0, icon: Newspaper, href: "/admin/news?status=published", tour: undefined },
    { label: "Unread messages", value: unread.count ?? 0, icon: Inbox, href: "/admin/inbox", tour: undefined },
  ];

  const activity: Activity[] = [
    ...(recentEvents.data ?? []).map((e) => ({
      id: `e-${e.id}`,
      kind: "event" as const,
      title: e.title,
      detail: e.status === "published" ? "Event published or updated" : "Event draft saved",
      at: e.updated_at,
      href: `/admin/events?edit=${e.id}`,
    })),
    ...(recentPosts.data ?? []).map((p) => ({
      id: `p-${p.id}`,
      kind: "post" as const,
      title: p.title,
      detail: p.status === "published" ? "Post published or updated" : "Post draft saved",
      at: p.updated_at,
      href: `/admin/news?edit=${p.id}`,
    })),
    ...(recentMessages.data ?? []).map((m) => ({
      id: `m-${m.id}`,
      kind: "message" as const,
      title: m.subject ?? "New message",
      detail: `Message from ${m.name}`,
      at: m.created_at,
      href: `/admin/inbox?open=${m.id}`,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  const kindIcon = { event: CalendarDays, post: Newspaper, message: Mail } as const;

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">
            <Greeting />, {name}
          </h1>
          <p className="mt-2 text-ink-2">Here is what is happening on the website.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/events?new=1" data-tour="add-event" className={buttonClasses("primary")}>
            <CalendarPlus aria-hidden className="size-4" />
            Add event
          </Link>
          <Link href="/admin/news?new=1" data-tour="add-news" className={buttonClasses("secondary")}>
            <PenSquare aria-hidden className="size-4" />
            Add news post
          </Link>
        </div>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, tour }) => (
          <li key={label}>
            <Link
              href={href}
              data-tour={tour}
              className="group block rounded-card border border-line bg-surface p-5 shadow-card transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-0.5 hover:shadow-lift md:p-6"
            >
              <span className="grid size-10 place-items-center rounded-full bg-ice text-brand-text">
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <p className="mt-5 font-display text-[2.25rem] font-semibold leading-none tracking-[-0.03em] tabular-nums">{value}</p>
              <p className="mt-2 text-small text-ink-2">{label}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="activity-title" className="mt-10 rounded-card border border-line bg-surface p-5 shadow-card md:p-8">
        <h2 id="activity-title" className="font-display text-[1.25rem] font-semibold">
          Recent activity
        </h2>
        {activity.length === 0 ? (
          <p className="mt-4 text-ink-2">Nothing yet. Add your first event or news post to get started.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {activity.map((a) => {
              const Icon = kindIcon[a.kind];
              return (
                <li key={a.id}>
                  <Link href={a.href} className="flex items-center gap-4 rounded-chip py-3.5 hover:bg-bg md:px-2">
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full",
                        a.kind === "message" ? "bg-[color-mix(in_srgb,var(--aqua)_15%,transparent)] text-brand-deep" : "bg-ice text-brand-text",
                      )}
                    >
                      <Icon aria-hidden className="size-4" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{a.title}</span>
                      <span className="block text-small text-ink-2">{a.detail}</span>
                    </span>
                    <time dateTime={a.at} className="shrink-0 text-small text-ink-2">
                      {formatDate(a.at, { day: "numeric", month: "short" })}
                    </time>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
