"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "charcoal"
  | "danger"
  | "dangerSoft"
  | "ghost"
  | "filter"
  | "filterActive";

type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-button text-cream shadow-sm shadow-button/20 hover:bg-button-deep hover:shadow-md hover:shadow-button/25 active:translate-y-px",
  secondary:
    "border border-charcoal/15 bg-cream text-charcoal hover:border-charcoal/30 hover:bg-cream-soft",
  charcoal:
    "bg-charcoal text-cream shadow-sm shadow-charcoal/15 hover:bg-charcoal/90 active:translate-y-px",
  danger:
    "bg-terracotta-deep text-cream shadow-sm shadow-terracotta/20 hover:bg-terracotta active:translate-y-px",
  dangerSoft:
    "border border-terracotta/20 bg-terracotta/10 text-terracotta-deep hover:bg-terracotta/20",
  ghost:
    "bg-transparent text-charcoal-muted hover:bg-charcoal/5 hover:text-charcoal",
  filter:
    "bg-cream-deep text-charcoal hover:bg-sand/80",
  filterActive:
    "bg-charcoal text-cream shadow-sm shadow-charcoal/20",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
  md: "px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.12em]",
  lg: "px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em]",
};

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function AdminButton({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}: AdminButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg transition duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
