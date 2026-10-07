import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Programme } from "@/content";
import { cn } from "@/lib/cn";
import { Glass } from "@/components/ui/Glass";

/** Tall image card with a glass panel along the bottom. */
export function ProgrammeCard({
  programme,
  className,
  sizes = "(min-width: 1024px) 420px, 80vw",
}: {
  programme: Programme;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={`/programmes/${programme.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-panel bg-brand-deep shadow-card transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <Image
        src={programme.image}
        alt={programme.imageAlt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/55 to-transparent" />
      <Glass
        variant="strong"
        className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-4 rounded-card p-5 transition-[background-color] duration-500 group-hover:bg-white/85"
      >
        <div>
          <h3 className="font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
            {programme.title}
          </h3>
          <p className="mt-1.5 text-small text-ink-2">{programme.summary}</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white transition-transform duration-500 ease-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight aria-hidden className="size-5" strokeWidth={2} />
        </span>
      </Glass>
    </Link>
  );
}
