"use client";

import Image from "@/components/ui/Img";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import type { Programme, ProgrammeStatus } from "@/content";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { EmptyState } from "@/components/ui/EmptyState";
import { Glass } from "@/components/ui/Glass";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type Filter = "all" | ProgrammeStatus;

const filters = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
] as const;

/** Bento pattern: a big card, then two stacked. A big card left alone spans the row. */
function spanFor(index: number, count: number) {
  const slot = index % 3;
  if (slot === 0) return index === count - 1 ? "md:col-span-6" : "md:col-span-4 md:row-span-2";
  if (slot === 1 && index === count - 1) return "md:col-span-2 md:row-span-2";
  return "md:col-span-2";
}

export function StatusPill({ status, className }: { status: ProgrammeStatus; className?: string }) {
  return (
    <Glass
      variant="strong"
      className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8125rem] font-medium text-ink", className)}
    >
      <span aria-hidden className={cn("size-2 rounded-full", status === "ongoing" ? "bg-success" : "bg-ink-2")} />
      {status === "ongoing" ? "Ongoing" : "Completed"}
    </Glass>
  );
}

export function ProgrammesGrid({ items }: { items: Programme[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? items : items.filter((p) => p.status === filter);

  return (
    <div>
      <SegmentedControl label="Filter programmes by status" options={filters} value={filter} onChange={setFilter} />

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} programmes
      </p>

      {visible.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={FolderOpen}
          title="No programmes here yet"
          description="Try another filter to see the rest of our work."
        />
      ) : (
        <ul className="mt-10 grid auto-rows-[minmax(260px,auto)] gap-5 md:grid-cols-6 md:auto-rows-[300px]">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((programme, i) => (
              <motion.li
                key={programme.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE }}
                className={cn("min-h-[340px] md:min-h-0", spanFor(i, visible.length))}
              >
                <Link
                  href={`/programmes/${programme.slug}`}
                  className="group relative block h-full overflow-hidden rounded-panel bg-brand-deep shadow-card transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-lift"
                >
                  <Image
                    src={programme.image}
                    alt={programme.imageAlt}
                    fill
                    sizes={i % 3 === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                    className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/30 to-transparent" />
                  <StatusPill status={programme.status} className="absolute left-4 top-4" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white md:p-7">
                    <div>
                      <h2 className={cn("font-display font-semibold tracking-[-0.02em]", i % 3 === 0 ? "text-h2" : "text-h3")}>
                        {programme.title}
                      </h2>
                      <p className="mt-2 max-w-[44ch] text-small text-white/85 md:text-body">{programme.summary}</p>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform duration-500 ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      <ArrowUpRight aria-hidden className="size-5" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
