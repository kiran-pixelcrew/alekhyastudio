import type { Metadata } from "next";
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
import { site } from "@/data/site";

const service = getService("websites&portfolios");

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
};

export default function WebsitesPage() {
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
          <Button href="/work" variant="secondary" size="lg">
            See Our Work
          </Button>
        </div>
      </PageHero>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl space-y-20">
          <FadeIn>
            <SectionHeading
              eyebrow="What's included"
              title="A portfolio that works as hard as you do"
              description="Custom websites for dancers, choreographers, gurus, and academies — built to showcase your journey and make enquiries easy."
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {service.highlights.map((item) => (
                <li
                  key={item}
                  className="border border-charcoal/10 bg-cream-soft p-6"
                >
                  <p className="text-charcoal-muted">{item}</p>
                </li>
              ))}
            </ul>
            <p className="mt-10 max-w-2xl text-charcoal-muted leading-relaxed">
              Browse live portfolio websites we&apos;ve built in{" "}
              <a
                href="/work"
                className="font-medium text-button underline-offset-4 hover:underline"
              >
                Our Work
              </a>
              .
            </p>
          </FadeIn>

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
