import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Friendly empty state with one clear next step. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-panel border border-dashed border-line bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      <span className="mb-5 grid size-14 place-items-center rounded-full bg-ice text-brand">
        <Icon aria-hidden className="size-6" strokeWidth={1.75} />
      </span>
      <h3 className="text-h3 font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-[42ch] text-ink-2">{description}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
