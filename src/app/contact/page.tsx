import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { FadeIn } from "@/components/shared/FadeIn";
import { Button } from "@/components/shared/Button";
import { ContactFormWithParams } from "@/components/shared/ContactFormWithParams";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us what you're building — a show, a portfolio, or both. Dance photography, invitation design, and portfolio websites by Alekhya Studio in Bangalore.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Start a Project"
        title="Tell us what you're building — a show, a portfolio, or both."
        description="Photography, invitations, posters, portfolio websites — or not sure yet. We'll figure it out together."
      />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <FadeIn>
            <h2 className="font-display text-3xl text-charcoal">Studio details</h2>
            <dl className="mt-8 space-y-6 text-charcoal-muted">
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${site.email}`}
                    className="text-charcoal transition hover:text-terracotta"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="text-charcoal transition hover:text-terracotta"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.16em] text-charcoal/50">
                  Location
                </dt>
                <dd className="mt-1 text-charcoal">{site.location}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={site.whatsapp} external variant="teal" size="lg">
                WhatsApp Us
              </Button>
              <Button href={site.instagram} external variant="ghost">
                Instagram
              </Button>
            </div>

            <p className="mt-8 text-sm text-charcoal-muted leading-relaxed">
              Dancers, gurus, and event organizers tend to respond faster on
              WhatsApp — feel free to message us directly with your show date,
              art form, and what you need.
            </p>
          </FadeIn>

          <FadeIn delay={80}>
            <h2 className="mb-6 font-display text-3xl text-charcoal">
              Send a message
            </h2>
            <ContactFormWithParams />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
