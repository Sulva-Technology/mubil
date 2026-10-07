import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type GlassVariant = "subtle" | "regular" | "strong" | "dark";

const variantClass: Record<GlassVariant, string> = {
  subtle: "glass glass-subtle",
  regular: "glass",
  strong: "glass glass-strong",
  dark: "glass glass-dark",
};

type GlassProps<T extends ElementType> = {
  as?: T;
  variant?: GlassVariant;
  /** Force the no-backdrop-filter fallback (used in /styleguide). */
  fallback?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Liquid glass surface. Use only on floating layers: navbar, cards over
 * imagery, modals, side panels, tooltips, stat pills, admin sidebar.
 */
export function Glass<T extends ElementType = "div">({
  as,
  variant = "regular",
  fallback = false,
  className,
  children,
  ...rest
}: GlassProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component className={cn(variantClass[variant], fallback && "glass-fallback", className)} {...rest}>
      {children}
    </Component>
  );
}
