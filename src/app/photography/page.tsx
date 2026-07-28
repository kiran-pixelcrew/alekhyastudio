import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/shared/Button";
import { CTABanner } from "@/components/shared/CTABanner";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getService } from "@/data/services";
import { site } from "@/data/site";

const service = getService("photography");

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
};

export default function PhotographyPage() {
  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.tagline}
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
        <FadeIn className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What we shoot"
            title="Performance, portraits, and sabha coverage"
            description="We photograph Indian classical dance with the eye of someone who understands the art form — waiting for abhinaya, timing, and the moments that make a performance memorable."
          />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {service.highlights.map((item) => (
              <li
                key={item}
                className="border border-charcoal/10 bg-cream-soft p-6"
              >
                <h3 className="font-display text-xl text-charcoal">{item}</h3>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-charcoal-muted leading-relaxed">
            From arangetrams and recitals to studio portraits and concept
            shoots, we capture your art with care and cultural fluency. Browse
            our photography in{" "}
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
      </section>

      <CTABanner
        title="Planning an arangetram or recital?"
        description="Book photography and pair it with invitation design — one studio, one vision."
        primary={{ href: "/contact?service=photo", label: "Book a Shoot" }}
        secondary={{ href: "/work", label: "View photography work" }}
      />
    </>
  );
}
