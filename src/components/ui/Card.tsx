import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps<T extends ElementType> = {
  as?: T;
  /** Lift 4px with a deeper shadow on hover. */
  interactive?: boolean;
  padded?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/** Solid content card. Body content sits on solid surfaces, not glass. */
export function Card<T extends ElementType = "div">({
  as,
  interactive = false,
  padded = true,
  className,
  children,
  ...rest
}: CardProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={cn(
        "relative rounded-card border border-line bg-surface shadow-card",
        padded && "p-6 md:p-8",
        interactive &&
          "transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-lift focus-within:-translate-y-1 focus-within:shadow-lift",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
