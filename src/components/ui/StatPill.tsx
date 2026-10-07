import { cn } from "@/lib/cn";
import { Glass } from "./Glass";

/** Compact glass pill: big value with a short label. */
export function StatPill({
  value,
  label,
  tone = "light",
  className,
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Glass
      variant={tone === "dark" ? "dark" : "strong"}
      className={cn("inline-flex items-baseline gap-3 rounded-full px-5 py-3", className)}
    >
      <span className="font-display text-h3 font-semibold tabular-nums">{value}</span>
      <span className={cn("text-small", tone === "dark" ? "text-white/75" : "text-ink-2")}>{label}</span>
    </Glass>
  );
}
