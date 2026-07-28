import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "teal";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-button text-cream-soft hover:bg-button-deep focus-visible:outline-button",
  secondary:
    "bg-transparent text-cream-soft border border-cream-soft/50 hover:bg-cream-soft/10 focus-visible:outline-cream",
  ghost:
    "bg-transparent text-charcoal border border-charcoal/20 hover:border-button hover:text-button focus-visible:outline-button",
  teal: "bg-teal text-cream-soft hover:bg-teal-soft focus-visible:outline-teal",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm tracking-wide",
  lg: "px-8 py-3.5 text-base tracking-wide",
};

type Common = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = Common &
  Omit<ComponentProps<"button">, "children" | "className"> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  external?: boolean;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
  } = props;

  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors duration-300",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <a
          href={props.href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
