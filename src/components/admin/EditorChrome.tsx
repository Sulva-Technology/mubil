"use client";

import { Check, CloudUpload, History, Loader2 } from "lucide-react";
import type { PublishStatus } from "@/types/database";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
] as const;

/** Banner offering to bring back edits autosaved on this device. */
export function RestoreBanner({ savedAt, onRestore, onDiscard }: { savedAt: number; onRestore: () => void; onDiscard: () => void }) {
  return (
    <div className="mb-6 flex flex-col gap-3 rounded-card border border-[color-mix(in_srgb,var(--warning)_45%,transparent)] bg-[color-mix(in_srgb,var(--warning)_10%,white)] p-4 sm:flex-row sm:items-center">
      <History aria-hidden className="size-5 shrink-0 text-[color-mix(in_srgb,var(--warning)_70%,var(--ink))]" />
      <p className="flex-1 text-small">
        You have unsaved changes from{" "}
        {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(savedAt)} on this device.
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={onRestore} className={buttonClasses("primary", "sm")}>
          Restore
        </button>
        <button type="button" onClick={onDiscard} className={buttonClasses("secondary", "sm")}>
          Discard
        </button>
      </div>
    </div>
  );
}

/** Sticky footer: Draft/Published switch, autosave indicator, Save. */
export function EditorFooter({
  status,
  onStatus,
  dirty,
  autosavedAt,
  saving,
  onCancel,
  formId,
}: {
  status: PublishStatus;
  onStatus: (s: PublishStatus) => void;
  dirty: boolean;
  autosavedAt: number | null;
  saving: boolean;
  onCancel: () => void;
  formId: string;
}) {
  const indicator = saving
    ? { icon: Loader2, text: "Saving...", spin: true }
    : dirty
      ? autosavedAt
        ? { icon: CloudUpload, text: `Unsaved, backed up on this device ${new Intl.DateTimeFormat("en-GB", { timeStyle: "short" }).format(autosavedAt)}`, spin: false }
        : { icon: CloudUpload, text: "Unsaved changes", spin: false }
      : { icon: Check, text: "All changes saved", spin: false };
  const Icon = indicator.icon;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2" data-tour="status-switch">
        <SegmentedControl label="Visibility" options={statusOptions} value={status} onChange={onStatus} />
        <p aria-live="polite" className="flex items-center gap-1.5 text-[0.8125rem] text-ink-2">
          <Icon aria-hidden className={cn("size-3.5", indicator.spin && "animate-spin", !dirty && !saving && "text-success")} />
          {indicator.text}
        </p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className={buttonClasses("secondary")}>
          Close
        </button>
        <button type="submit" form={formId} disabled={saving} className={buttonClasses("primary")}>
          {saving && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {status === "published" ? "Save and publish" : "Save draft"}
        </button>
      </div>
    </div>
  );
}
