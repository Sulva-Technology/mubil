"use client";

import { useSyncExternalStore } from "react";

function greetingNow() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Lagos" }).format(new Date()),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const noop = () => () => {};

/** Time-of-day greeting in Lagos time. Computed on the client to avoid hydration drift. */
export function Greeting() {
  return <>{useSyncExternalStore(noop, greetingNow, () => "Welcome back")}</>;
}
