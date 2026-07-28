import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/shared/Button";
import { CTABanner } from "@/components/shared/CTABanner";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getService } from "@/data/services";
import { marketingOffers, marketingProcess } from "@/data/marketing";
import { site } from "@/data/site";

const service = getService("social-media");

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
};

export default function SocialMediaPage() {
  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title="Your feed should feel like your stage — not a generic template."
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
              eyebrow="What we create"
              title="Branding, content, and promotion for performing artists"
              description="A calm, cultural content system so you show up consistently — for classes, shows, and milestones — without losing your artistic identity."
            />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {service.highlights.map((item) => (
                <li
                  key={item}
                  className="border border-charcoal/10 bg-cream-soft p-6"
                >
                  <h3 className="font-display text-xl text-charcoal">{item}</h3>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn>
            <SectionHeading
              eyebrow="How we help"
              title="Built around your art and audience"
            />
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {marketingOffers.map((offer) => (
                <li
                  key={offer.title}
                  className="border border-charcoal/10 bg-cream-soft p-6"
                >
                  <h3 className="font-display text-2xl text-charcoal">
                    {offer.title}
                  </h3>
                  <p className="mt-3 text-charcoal-muted leading-relaxed">
                    {offer.text}
                  </p>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn>
            <SectionHeading
              eyebrow="Process"
              title="From audit to a living content system"
            />
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {marketingProcess.map((step, index) => (
                <li key={step} className="list-none">
                  <p className="font-display text-3xl text-terracotta">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm text-charcoal-muted leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-2xl text-charcoal-muted leading-relaxed">
              Creative samples and campaign work live in{" "}
              <a
                href="/work"
                className="font-medium text-button underline-offset-4 hover:underline"
              >
                Our Work
              </a>
              .
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={service.cta.href} variant="primary" size="lg">
                {service.cta.label}
              </Button>
              <Button href={site.whatsapp} external variant="ghost" size="lg">
                WhatsApp
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTABanner
        title="Ready for a feed that matches your stage presence?"
        description="Tell us about your art form, upcoming shows, and where you need help — branding, reels, or event promotion."
        primary={{ href: "/contact?service=social", label: "Plan My Content" }}
        secondary={{ href: site.whatsapp, label: "WhatsApp Us", external: true }}
      />
    </>
  );
}
