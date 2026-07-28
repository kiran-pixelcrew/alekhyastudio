import type { ReactNode } from "react";
import { FadeIn } from "@/components/shared/FadeIn";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="theme-page-hero relative overflow-hidden px-5 pb-16 pt-32 md:px-8 md:pb-20 md:pt-40">
      <div
        aria-hidden
        className="theme-page-hero-glow pointer-events-none absolute inset-0 opacity-40"
      />
      <div className="relative mx-auto max-w-7xl">
        <FadeIn>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta-soft">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-cream-soft sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-cream/75 md:text-lg">
            {description}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </FadeIn>
      </div>
    </section>
  );
}
