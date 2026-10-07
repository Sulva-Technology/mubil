import { cn } from "@/lib/cn";
import { site } from "@/content";

/** Text wordmark until the Foundation's logo arrives. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap font-display font-semibold tracking-[-0.03em]", className)}>
      <span aria-hidden className="relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-brand">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,var(--sky),transparent_60%)] opacity-90" />
        <span className="absolute -bottom-2 -right-1 size-5 rounded-full bg-aqua/70 blur-[3px]" />
      </span>
      <span>{site.name}</span>
    </span>
  );
}
