"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, CircleHelp, ExternalLink, Inbox, LayoutGrid, LogOut, Newspaper, Search } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { Wordmark } from "@/components/layout/Wordmark";
import { Greeting } from "./Greeting";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutGrid, tour: "nav-overview" },
  { href: "/admin/events", label: "Events", icon: CalendarDays, tour: "nav-events" },
  { href: "/admin/news", label: "News", icon: Newspaper, tour: "nav-news" },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox, tour: "nav-inbox" },
  { href: "/admin/help", label: "Help", icon: CircleHelp, tour: "nav-help" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function AvatarMenu({ name, email }: { name: string; email: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className="grid size-10 place-items-center rounded-full bg-brand font-display text-[0.9375rem] font-semibold text-white shadow-card"
      >
        {name.charAt(0)}
      </button>
      {open && (
        <div role="menu" className="glass glass-strong absolute right-0 top-12 z-50 w-64 rounded-card p-2">
          <div className="px-3 py-2">
            <p className="font-medium">{name}</p>
            {email && <p className="truncate text-small text-ink-2">{email}</p>}
          </div>
          <div className="my-1 h-px bg-line" />
          <Link role="menuitem" href="/" target="_blank" className="flex items-center gap-2 rounded-chip px-3 py-2 text-small hover:bg-white/80">
            <ExternalLink aria-hidden className="size-4" />
            View website
          </Link>
          <form action={signOut}>
            <button role="menuitem" type="submit" className="flex w-full items-center gap-2 rounded-chip px-3 py-2 text-left text-small text-error hover:bg-white/80">
              <LogOut aria-hidden className="size-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function AdminShell({
  name,
  email,
  unread,
  children,
}: {
  name: string;
  email: string | null;
  unread: number;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState(params.get("q") ?? "");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const base = ["/admin/news", "/admin/inbox", "/admin/events"].find((p) => pathname.startsWith(p)) ?? "/admin/events";
    router.push(query.trim() ? `${base}?q=${encodeURIComponent(query.trim())}` : base);
  }

  return (
    <div className="relative min-h-[100svh] md:pl-[88px] lg:pl-[264px]">
      {/* Sidebar: icons on tablet, full on desktop */}
      <aside className="glass glass-strong fixed inset-y-3 left-3 z-40 hidden w-[72px] flex-col rounded-panel p-3 md:flex lg:w-[248px]">
        <Link href="/admin" className="mb-8 mt-2 flex items-center rounded-full px-2 text-[1.0625rem]" aria-label="Mubil admin home">
          <Wordmark className="[&>span:last-child]:hidden lg:[&>span:last-child]:inline" />
        </Link>
        <nav aria-label="Admin">
          <ul className="space-y-1">
            {nav.map(({ href, label, icon: Icon, tour }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    data-tour={tour}
                    aria-current={active ? "page" : undefined}
                    title={label}
                    className={cn(
                      "relative flex h-11 items-center gap-3 rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors duration-300",
                      active ? "text-brand-deep" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-nav-active"
                        className="absolute inset-0 rounded-full bg-white shadow-card"
                        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                      />
                    )}
                    <Icon aria-hidden className="relative z-10 size-5 shrink-0" strokeWidth={1.75} />
                    <span className="relative z-10 hidden lg:inline">{label}</span>
                    {href === "/admin/inbox" && unread > 0 && (
                      <span className="relative z-10 ml-auto hidden min-w-6 rounded-full bg-brand px-1.5 text-center text-[0.75rem] font-semibold leading-6 text-white lg:inline">
                        {unread}
                      </span>
                    )}
                    {href === "/admin/inbox" && unread > 0 && (
                      <span aria-hidden className="absolute right-2 top-2 z-10 size-2 rounded-full bg-brand lg:hidden" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Link
          href="/"
          target="_blank"
          className="mt-auto flex h-11 items-center gap-3 rounded-full px-3.5 text-small text-ink-2 hover:text-ink"
          title="View website"
        >
          <ExternalLink aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
          <span className="hidden lg:inline">View website</span>
        </Link>
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-8">
          {pathname !== "/admin" && (
            <p className="hidden font-display text-[1.0625rem] font-semibold sm:block">
              <Greeting />, {name}
            </p>
          )}
          <Link href="/admin" className="text-[1rem] sm:hidden" aria-label="Admin home">
            <Wordmark className="[&>span:last-child]:hidden" />
          </Link>
          <form onSubmit={onSearch} role="search" className="ml-auto w-full max-w-xs">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events, news, messages"
                className="h-10 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-small outline-none transition-[border-color,box-shadow] focus:border-brand focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_14%,transparent)]"
              />
            </label>
          </form>
          <AvatarMenu name={name} email={email} />
        </div>
      </header>

      <main id="admin-main" className="mx-auto max-w-6xl px-4 pb-32 pt-8 md:px-8 md:pb-16">
        {children}
      </main>

      {/* Bottom tab bar on mobile */}
      <nav aria-label="Admin" className="glass glass-strong fixed inset-x-3 bottom-3 z-40 rounded-full p-1.5 md:hidden">
        <ul className="grid grid-cols-5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-full text-[0.6875rem] font-medium",
                    active ? "text-brand-deep" : "text-ink-2",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="admin-tab-active"
                      className="absolute inset-0 rounded-full bg-white shadow-card"
                      transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                    />
                  )}
                  <Icon aria-hidden className="relative z-10 size-5" strokeWidth={1.75} />
                  <span className="relative z-10">{label}</span>
                  {href === "/admin/inbox" && unread > 0 && (
                    <span aria-hidden className="absolute right-[30%] top-2.5 z-10 size-2 rounded-full bg-brand" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
