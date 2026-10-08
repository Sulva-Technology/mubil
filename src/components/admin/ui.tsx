"use client";

import { useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Info, Loader2, X } from "lucide-react";
import type { PublishStatus } from "@/types/database";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { Modal } from "@/components/ui/Modal";
import { buttonClasses } from "@/components/ui/Button";

const noop = () => () => {};

export function StatusBadge({ status }: { status: PublishStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.8125rem] font-medium",
        status === "published"
          ? "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[color-mix(in_srgb,var(--success)_65%,var(--ink))]"
          : "bg-ice text-ink-2",
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", status === "published" ? "bg-success" : "bg-ink-2")} />
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}

/** Filter chips for status (All, Published, Draft). */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: ReadonlyArray<{ value: T; label: string; count?: number }>;
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-chip px-3.5 text-small font-medium transition-colors",
            o.value === value ? "bg-ink text-white" : "bg-surface text-ink-2 ring-1 ring-line hover:text-ink",
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="tabular-nums opacity-70">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Field wrapper: label, optional inline hint, error. */
export function FormField({
  label,
  htmlFor,
  hint,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-1.5 text-small font-medium text-ink">
        {label}
        {optional && <span className="font-normal text-ink-2">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 flex gap-1.5 text-[0.8125rem] leading-snug text-ink-2">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand-text" />
          <span>{hint}</span>
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-[0.8125rem] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "block h-11 w-full rounded-chip border border-line bg-white px-3.5 text-[0.9375rem] text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-brand focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_14%,transparent)] aria-[invalid=true]:border-error";

export function Toggle({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300", checked ? "bg-brand" : "bg-[color-mix(in_srgb,var(--ink)_18%,transparent)]")}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow-card transition-transform duration-300 ease-soft",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

/** Full-height glass side panel for editors and message detail. */
export function SidePanel({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-2xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  const reduce = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  // Parents pass a fresh onClose every render; reading it through a ref keeps the
  // open effect from re-running (and stealing focus) on every keystroke.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      (panel?.querySelector<HTMLElement>("input, textarea") ?? panel?.querySelector<HTMLElement>("button"))?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      // Ignore Escape while a dialog (like a delete confirmation) is stacked on top.
      if (e.key === "Escape" && document.querySelectorAll("[role=dialog][aria-modal=true]").length <= 1) onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <m.div
            aria-hidden
            className="absolute inset-0 bg-night/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={onClose}
          />
          <m.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.5, ease: EASE }}
            className={cn(
              "glass glass-strong absolute inset-y-0 right-0 flex w-full flex-col sm:inset-y-2 sm:right-2 sm:rounded-panel",
              width,
            )}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
              <h2 id={titleId} className="font-display text-[1.25rem] font-semibold">
                {title}
              </h2>
              <button type="button" onClick={onClose} aria-label="Close panel" className="grid size-10 place-items-center rounded-full text-ink-2 hover:bg-white/80 hover:text-ink">
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">{children}</div>
            {footer && <div className="border-t border-line px-5 py-4 sm:px-7">{footer}</div>}
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Glass confirm dialog for destructive actions. */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="text-ink-2">
        {body}
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={buttonClasses("secondary")}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className={cn(buttonClasses("primary"), "bg-error hover:bg-[color-mix(in_srgb,var(--error)_80%,var(--ink))] hover:shadow-none")}
        >
          {busy && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
