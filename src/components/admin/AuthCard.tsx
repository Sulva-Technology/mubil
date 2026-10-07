import type { ReactNode } from "react";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Glass } from "@/components/ui/Glass";
import { Wordmark } from "@/components/layout/Wordmark";

/** Centred glass card over ambient blobs, shared by the auth screens. */
export function AuthCard({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-4 py-16">
      <AmbientBackground />
      <Glass variant="strong" className="relative z-10 w-full max-w-md rounded-panel p-8 sm:p-10">
        <Wordmark className="text-[1.0625rem]" />
        <h1 className="mt-8 font-display text-h3 font-semibold">{title}</h1>
        {intro && <p className="mt-2 text-ink-2">{intro}</p>}
        <div className="mt-8">{children}</div>
      </Glass>
    </main>
  );
}

export const authInput =
  "block h-12 w-full rounded-chip border border-line bg-white/85 px-4 text-body text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-brand focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_14%,transparent)]";
