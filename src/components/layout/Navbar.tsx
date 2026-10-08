"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/content";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { buttonClasses } from "@/components/ui/Button";
import { Wordmark } from "./Wordmark";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Floating glass pill navbar. Shrinks and turns more opaque on scroll. */
export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current) return;
      const nodes = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a, button"));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          aria-label="Main"
          className={cn(
            "glass pointer-events-auto flex w-full max-w-[1100px] items-center justify-between rounded-full transition-[padding,background-color,box-shadow] duration-500 ease-soft",
            scrolled ? "glass-strong py-1.5 pl-5 pr-1.5" : "py-2.5 pl-6 pr-2.5",
          )}
        >
          <Link href="/" className="rounded-full text-[1.0625rem] text-ink" aria-label="Mubil Foundation, home">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-small font-medium transition-colors duration-300",
                      active ? "text-ink" : "text-ink-2 hover:text-ink",
                    )}
                  >
                    {active && (
                      <m.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-white/80 bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_10px_rgba(10,42,107,0.08)]"
                        transition={reduce ? { duration: 0 } : { duration: 0.55, ease: EASE }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden xl:block">
              <Link href="/contact" className={buttonClasses("primary", "sm")}>
                Get involved
              </Link>
            </span>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-white/70 lg:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <m.div
              aria-hidden
              className="absolute inset-0 bg-night/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              onClick={close}
            />
            <m.div
              id="mobile-menu"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={reduce ? { opacity: 0 } : { y: "100%" }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: "100%" }}
              transition={{ duration: 0.55, ease: EASE }}
              className="glass glass-strong absolute inset-x-2 bottom-2 rounded-panel px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
            >
              <div className="mb-1 flex items-center justify-between pl-4">
                <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-ink/15" />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="grid size-11 place-items-center rounded-full text-ink-2 hover:bg-white/70 hover:text-ink"
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-card px-4 py-3 font-display text-[1.5rem] font-semibold tracking-[-0.02em] transition-colors",
                          active ? "bg-white/80 text-ink" : "text-ink-2 hover:bg-white/60 hover:text-ink",
                        )}
                      >
                        {link.label}
                        {active && <span aria-hidden className="size-2 rounded-full bg-brand" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className={buttonClasses("primary", "lg", "mt-3 w-full")}
              >
                Get involved
              </Link>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
