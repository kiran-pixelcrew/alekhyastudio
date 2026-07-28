import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/shared/Button";
import { FilterableGallery } from "@/components/photography/FilterableGallery";
import { CTABanner } from "@/components/shared/CTABanner";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getService } from "@/data/services";
import { photographyItems } from "@/data/photography";
import { site } from "@/data/site";
import { withBustedSrc } from "@/lib/publicAsset";

const service = getService("photography");

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
};

export default function PhotographyPage() {
  const items = withBustedSrc(photographyItems);

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title="We don't wait for the pose. We wait for the feeling."
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
            eyebrow="What we shoot"
            title="Performance, portraits, and sabha coverage"
          />
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
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
      </section>

      <section className="px-5 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <FilterableGallery items={items} />
        </div>
      </section>

      <CTABanner
        title="Planning an arangetram or recital?"
        description="Book photography and pair it with invitation design — one studio, one vision."
        primary={{ href: "/contact?service=photo", label: "Book a Shoot" }}
        secondary={{ href: "/invitations", label: "See invitation design" }}
      />
    </>
  );
}
