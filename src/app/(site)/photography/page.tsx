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
            eyebrow="What We Capture"
            title="Every performance has a story. We preserve the moments that tell it."
            description="We specialize in Indian classical dance photography, capturing the emotion, precision, and energy behind every performance. From expressive abhinaya to powerful nritta, we document the moments that matter most."
          />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {service.highlights.map((item) => (
              <li
                key={item}
                className="border border-charcoal/10 bg-cream-soft p-6"
              >
                <h3 className="font-display text-xl text-charcoal md:text-2xl">
                  {item}
                </h3>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl text-lg leading-relaxed text-charcoal-muted">
            Whether it&apos;s an intimate solo recital, a grand arangetram, or a
            thoughtfully crafted portrait session, every image is created with
            an understanding of the art—not just the camera.
          </p>
          <p className="mt-6 max-w-2xl text-charcoal-muted leading-relaxed">
            Browse our photography in{" "}
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
