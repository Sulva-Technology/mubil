import { dateParts } from "@/lib/format";
import { cn } from "@/lib/cn";

/** Big day number over the short month. */
export function DateBlock({ date, className }: { date: string; className?: string }) {
  const { day, month } = dateParts(date);
  return (
    <span className={cn("flex w-16 shrink-0 flex-col items-center leading-none", className)}>
      <span className="font-display text-[2.5rem] font-semibold tracking-[-0.04em] tabular-nums">{day}</span>
      <span className="mt-1 text-eyebrow font-semibold uppercase text-brand">{month}</span>
    </span>
  );
}
