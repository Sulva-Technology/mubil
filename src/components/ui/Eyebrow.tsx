import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-eyebrow font-semibold uppercase",
        tone === "dark" ? "text-aqua" : "text-brand-text",
        className,
      )}
    >
      {children}
    </p>
  );
}
