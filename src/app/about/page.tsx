import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { FadeIn } from "@/components/shared/FadeIn";
import { Button } from "@/components/shared/Button";
import { CTABanner } from "@/components/shared/CTABanner";
import { about } from "@/data/about";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Founded by a dancer, choreographer, photographer, and designer, Alekhya Studio brings every creative service under one artistic vision.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About Alekhya Studio"
        description="Artists creating for artists—bringing your performances, milestones, and creative journey to life through photography, films, design, and digital experiences."
      />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="space-y-6 text-lg leading-relaxed text-charcoal-muted">
              {about.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>

          <FadeIn>
            <p className="mt-10 font-display text-3xl leading-snug text-charcoal md:text-4xl">
              {about.headline}
            </p>
          </FadeIn>

          <FadeIn>
            <div className="mt-10 space-y-6 text-lg leading-relaxed text-charcoal-muted">
              {about.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>

          <FadeIn className="mt-16">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta">
              How We Work
            </p>
            <ul className="mt-6 space-y-8">
              {about.howWeWork.map((item) => (
                <li key={item.title} className="border-l-2 border-teal/40 pl-5">
                  <h2 className="font-display text-2xl text-charcoal md:text-3xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-lg leading-relaxed text-charcoal-muted">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-10 border-t border-charcoal/10 pt-8 font-display text-2xl leading-snug text-charcoal md:text-3xl">
              {about.closing}
            </p>
          </FadeIn>

          <FadeIn className="mt-12">
            <Button href="/contact" variant="primary">
              Start a Project
            </Button>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Work with Alekhya Studio"
        description={`Based in ${site.location} — serving dancers, choreographers, gurus, and academies across India.`}
        primary={{ href: "/contact", label: "Get in touch" }}
        secondary={{ href: site.whatsapp, label: "WhatsApp Us", external: true }}
      />
    </>
  );
}
