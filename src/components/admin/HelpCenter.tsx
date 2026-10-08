"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, LifeBuoy, PlayCircle, RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";

/** Swap `src` for real video links (YouTube unlisted or Loom) when they are recorded. */
const videos = [
  { title: "Add and publish an event", duration: "2:30", src: null },
  { title: "Write a news post", duration: "3:10", src: null },
  { title: "Upload good cover photos", duration: "1:45", src: null },
  { title: "Read and reply to messages", duration: "1:20", src: null },
];

const faqs = [
  {
    q: "What is the difference between Draft and Published?",
    a: "Drafts are only visible to admins in this dashboard. Published events and posts appear on the public website within about a minute. You can switch back to Draft at any time to hide something without deleting it.",
  },
  {
    q: "How do I add an event?",
    a: "Go to Events and click Add event. Fill in the title, date and venue, add a cover photo, then choose Draft or Published and click Save.",
  },
  {
    q: "What size should photos be?",
    a: "Any reasonably sharp photo works. We automatically resize it to 1600 pixels wide and convert it to a light WebP file, so it loads quickly on mobile data. Landscape photos look best as covers.",
  },
  {
    q: "What does Featured do?",
    a: "Featured events are highlighted first when several events happen around the same time. Use it for your most important event, not for everything.",
  },
  {
    q: "I changed something but the website hasn't updated.",
    a: "Changes usually appear within a minute. Refresh the public page. If it still looks old after five minutes, contact support.",
  },
  {
    q: "Can I undo a delete?",
    a: "No. Deleting is permanent. If you only want to hide an event or post, unpublish it instead (the eye icon in the list).",
  },
  {
    q: "Where do contact form messages go?",
    a: "Every message appears in the Inbox here and is also emailed to the foundation's contact address. Click Reply by email to answer from your own email app.",
  },
  {
    q: "What is the web address field?",
    a: "It is the end of the page link, for example /events/community-health-day. It is made from the title automatically. Avoid changing it after you have shared the link, or old links will stop working.",
  },
];

export function HelpCenter() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.map((f, i) => ({ ...f, i })).filter((f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Help</h1>
          <p className="mt-1 text-ink-2">Short videos, answers to common questions, and a way to reach us.</p>
        </div>
        <Link href="/admin?tour=1" className={buttonClasses("secondary")}>
          <RotateCcw aria-hidden className="size-4" />
          Replay tour
        </Link>
      </div>

      <section aria-labelledby="videos-title" className="mt-10">
        <h2 id="videos-title" className="font-display text-[1.25rem] font-semibold">
          Video guides
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v) => (
            <li key={v.title} className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
              <div className="relative grid aspect-video place-items-center bg-gradient-to-br from-brand-deep to-brand">
                <PlayCircle aria-hidden className="size-12 text-white/90" strokeWidth={1.25} />
                <span className="absolute bottom-2 right-2 rounded-full bg-night/60 px-2 py-0.5 text-[0.75rem] font-medium text-white">{v.duration}</span>
              </div>
              <div className="p-4">
                <p className="font-medium">{v.title}</p>
                <p className="text-[0.8125rem] text-ink-2">{v.src ? "Watch now" : "Video coming soon"}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq-title" className="mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="faq-title" className="font-display text-[1.25rem] font-semibold">
            Common questions
          </h2>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search questions</span>
            <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions"
              className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-small outline-none focus:border-brand"
            />
          </label>
        </div>
        {visible.length === 0 ? (
          <p className="mt-6 text-ink-2">No answers match that search. Contact support and we&apos;ll help.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-card border border-line bg-surface shadow-card">
            {visible.map(({ q, a, i }) => {
              const expanded = open === i;
              return (
                <li key={q}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(expanded ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium hover:bg-bg"
                    >
                      {q}
                      <ChevronDown aria-hidden className={cn("size-5 shrink-0 text-ink-2 transition-transform duration-300", expanded && "rotate-180")} />
                    </button>
                  </h3>
                  <div id={`faq-${i}`} hidden={!expanded} className="px-5 pb-5 text-ink-2">
                    {a}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12 flex flex-col items-start gap-4 rounded-card bg-ice p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-brand-text shadow-card">
            <LifeBuoy aria-hidden className="size-5" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="font-display text-[1.25rem] font-semibold">Still stuck?</h2>
            <p className="text-ink-2">Sulva Technology supports this website. We usually reply the same working day.</p>
          </div>
        </div>
        <a href="mailto:hello@sulvatech.com?subject=Mubil%20website%20support" className={buttonClasses("primary")}>
          Contact support
        </a>
      </section>
    </div>
  );
}
