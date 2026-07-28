"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlide } from "@/data/hero";
import { heroContent } from "@/data/site";
import { Button } from "@/components/shared/Button";

type HeroProps = {
  slides: HeroSlide[];
};

export function Hero({ slides }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [mobileReady, setMobileReady] = useState<boolean[]>(() =>
    slides.map(() => false),
  );

  useEffect(() => {
    if (slides.length === 0) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    let cancelled = false;

    slides.forEach((slide, i) => {
      const img = new window.Image();
      img.onload = () => {
        if (!cancelled) {
          setMobileReady((current) => {
            const next = [...current];
            next[i] = true;
            return next;
          });
        }
      };
      img.onerror = () => {
        // Keep desktop fallback when Mimg* is not present yet
      };
      img.src = slide.mobile;
    });

    return () => {
      cancelled = true;
    };
  }, [slides]);

  if (slides.length === 0) return null;

  const slideDots = (
    <div
      className="flex items-center gap-2"
      role="tablist"
      aria-label="Showreel slides"
    >
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          type="button"
          role="tab"
          aria-selected={i === index}
          aria-label={`Show slide ${i + 1}`}
          className={[
            "h-1.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            i === index
              ? "w-8 bg-button"
              : "w-3 bg-charcoal/25 hover:bg-charcoal/45 md:bg-cream/40 md:hover:bg-cream/70",
            i === index ? "md:bg-terracotta-soft" : "",
          ].join(" ")}
          onClick={() => setIndex(i)}
        />
      ))}
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-cream md:min-h-[100svh] md:bg-charcoal">
      {/* Desktop full-bleed slideshow */}
      <div className="absolute inset-0 hidden md:block" aria-hidden>
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide absolute inset-0 ${i === index ? "is-active" : ""}`}
          >
            <Image
              src={slide.desktop}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              unoptimized
              className="object-cover"
              style={
                slide.desktopPosition
                  ? { objectPosition: slide.desktopPosition }
                  : undefined
              }
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/92 via-charcoal/45 to-charcoal/25" />
      </div>

      <div className="sr-only" aria-live="polite">
        {slides[index].alt}
      </div>

      {/* Mobile: stacked rounded image + text (mockup layout) */}
      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-20 md:hidden">
        <div className="relative aspect-[3/4] max-h-[70svh] w-full overflow-hidden rounded-3xl bg-charcoal/10 sm:aspect-[4/5]">
          {slides.map((slide, i) => {
            const mobileSrc = mobileReady[i] ? slide.mobile : slide.desktop;

            return (
              <div
                key={slide.id}
                className={`hero-slide absolute inset-0 ${i === index ? "is-active" : ""}`}
              >
                <Image
                  src={mobileSrc}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  unoptimized
                  className="object-cover"
                  style={
                    slide.mobilePosition
                      ? { objectPosition: slide.mobilePosition }
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center">{slideDots}</div>

        <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-charcoal-muted">
          {heroContent.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-[2.15rem] leading-[1.12] font-semibold text-charcoal">
          We understand your art{" "}
          <span className="block text-button">because we live it too.</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-charcoal-muted">
          {heroContent.subheadline}
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-4">
          <Button
            href={heroContent.primaryCta.href}
            variant="primary"
            size="lg"
            className="w-full rounded-xl"
          >
            {heroContent.primaryCta.label}
          </Button>
          <a
            href={heroContent.secondaryCta.href}
            className="inline-flex items-center justify-center py-2 text-base font-medium text-button transition hover:text-button-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button"
          >
            {heroContent.secondaryCta.label}
          </a>
        </div>
      </div>

      {/* Desktop: overlay copy on full-bleed image */}
      <div className="relative mx-auto hidden min-h-[100svh] max-w-7xl flex-col justify-end px-8 pb-28 pt-28 md:flex">
        <p className="mb-4 max-w-xl text-nowrap text-xs font-medium uppercase tracking-[0.22em] text-cream/70">
          {heroContent.eyebrow}
        </p>
        <h1 className="max-w-7xl text-nowrap font-display text-5xl leading-[1.05] font-semibold text-cream-soft sm:text-6xl md:text-7xl lg:text-8xl">
          We understand your art <br />{" "}
          <span className="text-button-soft">because we live it too.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base text-cream/80 md:text-lg">
          {heroContent.subheadline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={heroContent.primaryCta.href} variant="primary" size="lg">
            {heroContent.primaryCta.label}
          </Button>
          <Button href={heroContent.secondaryCta.href} variant="secondary" size="lg">
            {heroContent.secondaryCta.label}
          </Button>
        </div>

        <div className="mt-12">{slideDots}</div>
      </div>
    </section>
  );
}
