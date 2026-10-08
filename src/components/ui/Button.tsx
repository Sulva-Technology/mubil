import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none " +
  "transition-[transform,background-color,box-shadow,color] duration-500 ease-soft " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<ButtonVariant, string> = {
  primary: "rounded-full bg-brand text-white hover:bg-brand-deep hover:shadow-glow",
  secondary: "glass rounded-full text-ink hover:bg-white/70",
  tertiary: "rounded-full text-brand-text hover:text-brand-deep",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-body",
};

function Content({ variant, children }: { variant: ButtonVariant; children: ReactNode }) {
  if (variant !== "tertiary") return <>{children}</>;
  return (
    <>
      <span>{children}</span>
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-500 ease-soft group-hover/btn:translate-x-1"
        strokeWidth={2}
      />
    </>
  );
}

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;
type ButtonAsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(base, variants[variant], variant === "tertiary" ? "h-auto px-0" : sizes[size], className);
}

/** Pill button. Pass `href` to render a Next.js link. */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = buttonClasses(variant, size, className);

  if (props.href !== undefined) {
    const { variant: _v, size: _s, className: _c, children: _ch, href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        <Content variant={variant}>{children}</Content>
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, type = "button", ...rest } = props;
  return (
    <button type={type} className={classes} {...rest}>
      <Content variant={variant}>{children}</Content>
    </button>
  );
}
