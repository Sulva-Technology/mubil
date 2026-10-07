"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useToast } from "@/components/ui/Toast";

const filters = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
] as const;

type Filter = (typeof filters)[number]["value"];

export function SegmentedDemo() {
  const [value, setValue] = useState<Filter>("all");
  return (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl label="Filter programmes" options={filters} value={value} onChange={setValue} />
      <p className="text-small text-ink-2">
        Selected: <span className="font-medium text-ink">{value}</span>. Arrow keys move the selection.
      </p>
    </div>
  );
}

export function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => toast("Link copied")}>
        Show success
      </Button>
      <Button variant="secondary" onClick={() => toast("Message not sent. Check your connection and try again.", "error")}>
        Show error
      </Button>
      <Button variant="secondary" onClick={() => toast("Draft saved", "info")}>
        Show info
      </Button>
    </div>
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="[TEAM MEMBER NAME]">
        <p className="text-small font-medium text-brand">[ROLE]</p>
        <p className="mt-4 text-ink-2">
          [SHORT BIO]. Press Escape, click outside, or use the close button to dismiss. Focus stays inside while open
          and returns to the trigger afterwards.
        </p>
        <div className="mt-8 flex justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
