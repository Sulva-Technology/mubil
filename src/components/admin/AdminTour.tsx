"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "driver.js/dist/driver.css";
import { completeTour } from "@/app/admin/actions";

const steps = [
  {
    element: '[data-tour="add-event"]',
    popover: {
      title: "1. Add an event",
      description: "Start here to create an event. Give it a title, a date and a cover photo.",
    },
  },
  {
    element: '[data-tour="add-news"]',
    popover: {
      title: "2. Add news",
      description: "Share a story or announcement. The editor works like a simple word processor.",
    },
  },
  {
    element: '[data-tour="stat-drafts"]',
    popover: {
      title: "3. Save a draft",
      description: "Leave the switch on Draft and click Save. Drafts are only visible to admins, so you can finish later.",
    },
  },
  {
    element: '[data-tour="stat-published"]',
    popover: {
      title: "4. Publish",
      description: "Switch to Published and save. It appears on the website within a minute.",
    },
  },
  {
    element: '[data-tour="nav-events"]',
    popover: {
      title: "5. Edit or delete",
      description: "Open Events or News any time to edit, unpublish or delete. Need a refresher? Replay this tour from Help.",
    },
  },
];

/** Stops the first-login tour from restarting on later visits to Overview this session. */
let autoTourShown = false;

/** First-login guided tour (Driver.js), replayable from Help with ?tour=1. */
export function AdminTour({ autoStart }: { autoStart: boolean }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const replay = params.get("tour") === "1";

  useEffect(() => {
    if (pathname !== "/admin" || (!replay && (!autoStart || autoTourShown))) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    const timer = window.setTimeout(async () => {
      const { driver } = await import("driver.js");
      if (cancelled) return;
      const tour = driver({
        // Targets hidden on small screens (like the sidebar) fall back to a centred popover.
        steps: steps.map((s) => (document.querySelector(s.element)?.getClientRects().length ? s : { popover: s.popover })),
        showProgress: true,
        progressText: "{{current}} of {{total}}",
        nextBtnText: "Next",
        prevBtnText: "Back",
        doneBtnText: "Done",
        popoverClass: "mubil-tour",
        overlayOpacity: 0.45,
        stagePadding: 6,
        stageRadius: 20,
        onDestroyed: () => {
          if (autoStart) void completeTour();
          if (replay) router.replace("/admin");
        },
      });
      if (!replay) autoTourShown = true;
      tour.drive();
      destroy = () => tour.destroy();
    }, 600);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      destroy?.();
    };
  }, [pathname, autoStart, replay, router]);

  return null;
}
