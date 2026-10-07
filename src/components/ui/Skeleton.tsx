import { cn } from "@/lib/cn";

/** Loading placeholder with a soft shimmer. Static when motion is reduced. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-chip bg-ice bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.7)_50%,transparent_70%)] bg-[length:200%_100%] motion-safe:animate-[shimmer_1.6s_var(--ease-soft)_infinite]",
        className,
      )}
    />
  );
}
