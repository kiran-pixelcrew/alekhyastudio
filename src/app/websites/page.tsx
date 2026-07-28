import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  PricingTiers,
  ProcessSteps,
  TechStack,
} from "@/components/web/WebSections";
import { CTABanner } from "@/components/shared/CTABanner";
import { getService } from "@/data/services";
import { pastSites } from "@/data/web";
import { site } from "@/data/site";
import { withBustedSrc } from "@/lib/publicAsset";

const service = getService("websites");

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
};

export default function WebsitesPage() {
  const sites = withBustedSrc(pastSites);

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title="You've spent years building your art. Your website shouldn't look like it took ten minutes."
        description={service.description}
      >
        <div className="flex flex-wrap gap-3">
          <Button href={service.cta.href} variant="primary" size="lg">
            {service.cta.label}
          </Button>
          <Button href={site.whatsapp} external variant="secondary" size="lg">
            WhatsApp
          </Button>
        </div>
      </PageHero>

      <section className="px-5 py-12 md:px-8">
        <FadeIn className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What's included"
            title="A portfolio that works as hard as you do"
          />
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {service.highlights.map((item) => (
              <li
                key={item}
                className="border border-charcoal/10 bg-cream-soft p-6"
              >
                <p className="text-charcoal-muted">{item}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl space-y-20">
          <div>
            <FadeIn>
              <SectionHeading
                eyebrow="Sample sites"
                title="Portfolio websites & case studies"
                description="For dancers, choreographers, gurus, and dance schools."
              />
            </FadeIn>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {sites.map((item, i) => (
                <FadeIn key={item.id} delay={i * 70}>
                  <article>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="img-zoom relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover object-top"
                          loading="lazy"
                          unoptimized
                        />
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-charcoal-muted">
                        {item.category}
                      </p>
                      <h3 className="font-display text-2xl text-charcoal transition group-hover:text-terracotta">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-charcoal-muted">
                        {item.description}
                      </p>
                      <p className="mt-2 text-sm font-medium text-teal">
                        Visit site →
                      </p>
                    </a>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>

          <div>
            <FadeIn>
              <SectionHeading
                eyebrow="Process"
                title="How we build artist websites"
                description="A clear four-step journey from discovery to launch."
              />
            </FadeIn>
            <div className="mt-12">
              <ProcessSteps />
            </div>
          </div>

          <div>
            <FadeIn>
              <SectionHeading eyebrow="Stack" title="Modern, maintainable tools" />
            </FadeIn>
            <FadeIn className="mt-8">
              <TechStack />
            </FadeIn>
          </div>

          <div>
            <FadeIn>
              <SectionHeading
                eyebrow="Investment"
                title="Website packages"
                description="Transparent starting points — every project is scoped to your art and audience."
              />
            </FadeIn>
            <div className="mt-12">
              <PricingTiers />
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Ready for a portfolio that matches your stage presence?"
        description="Get a quote for dancer, choreographer, guru, or academy websites built for enquiries."
        primary={{ href: "/contact?service=web", label: "Build My Portfolio" }}
        secondary={{ href: site.whatsapp, label: "WhatsApp Us", external: true }}
      />
    </>
  );
}
