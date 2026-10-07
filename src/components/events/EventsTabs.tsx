"use client";

import { useState, type ReactNode } from "react";

import { SegmentedControl } from "@/components/ui/SegmentedControl";

type Tab = "upcoming" | "past";

const tabs = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
] as const;

/** Switches between server-rendered upcoming and past lists. */
export function EventsTabs({ upcoming, past }: { upcoming: ReactNode; past: ReactNode }) {
  const [tab, setTab] = useState<Tab>("upcoming");
  return (
    <div>
      <SegmentedControl label="Show events" options={tabs} value={tab} onChange={setTab} />
      <div className="mt-10" hidden={tab !== "upcoming"}>
        {upcoming}
      </div>
      <div className="mt-10" hidden={tab !== "past"}>
        {past}
      </div>
    </div>
  );
}
