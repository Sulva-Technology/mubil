import type { Metadata } from "next";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { Glass } from "@/components/ui/Glass";
import { Wordmark } from "@/components/layout/Wordmark";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/** Placeholder. Phase 8 builds the admin dashboard. */
export default function AdminPage() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden p-4">
      <AmbientBackground />
      <Glass variant="strong" className="relative z-10 w-full max-w-md rounded-panel p-8 text-center">
        <Wordmark className="justify-center text-[1.0625rem]" />
        <h1 className="mt-6 text-h3 font-semibold">Admin</h1>
        <p className="mt-2 text-ink-2">Sign-in arrives in Phase 8.</p>
      </Glass>
    </main>
  );
}
