import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/shared/Button";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CTABanner } from "@/components/shared/CTABanner";
import { CreativeGallery } from "@/components/shared/CreativeGallery";
import { getService } from "@/data/services";
import { invitationProcess } from "@/data/invitations";
import { site } from "@/data/site";
import {
  getSelectedCreatives,
  getSelectedInvitations,
} from "@/lib/gallery";

const service = getService("invitations&creatives");

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
};

export const dynamic = "force-dynamic";

export default async function InvitationsPage() {
  const [creatives, invitations] = await Promise.all([
    getSelectedCreatives(),
    getSelectedInvitations(),
  ]);

  const hasGallery = invitations.length > 0 || creatives.length > 0;

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
        <div className="mx-auto max-w-7xl space-y-20">
          <FadeIn>
            <SectionHeading
              eyebrow="What we design"
              title="Invitations, posters, and programme booklets"
              description="Elegant, culturally rooted designs for arangetrams, recitals, and festivals — made for print and digital sharing."
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
              See invitation and creative samples in{" "}
              <a
                href="/work?category=invitations"
                className="font-medium text-button underline-offset-4 hover:underline"
              >
                Our Work
              </a>
              .
            </p>
          </FadeIn>

          {hasGallery ? (
            <div className="space-y-16">
              {invitations.length > 0 ? (
                <FadeIn>
                  <CreativeGallery
                    images={invitations}
                    title="Invitation designs"
                  />
                </FadeIn>
              ) : null}

              {creatives.length > 0 ? (
                <FadeIn>
                  <CreativeGallery
                    images={creatives}
                    title="Creatives & posters"
                  />
                </FadeIn>
              ) : null}
            </div>
          ) : null}

          <div>
            <FadeIn>
              <SectionHeading
                eyebrow="Process"
                title="How invitations are crafted"
              />
            </FadeIn>
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {invitationProcess.map((item, i) => (
                <FadeIn key={item.step} delay={i * 50}>
                  <li className="list-none">
                    <p className="font-display text-3xl text-terracotta">
                      {item.step}
                    </p>
                    <h3 className="mt-2 font-display text-xl text-charcoal">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-charcoal-muted">{item.text}</p>
                  </li>
                </FadeIn>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button href={service.cta.href} variant="primary" size="lg">
              {service.cta.label}
            </Button>
            <Button href={site.whatsapp} external variant="ghost" size="lg">
              WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <CTABanner
        title="Have a debut date?"
        description="Share your ceremony details — we'll propose invitation directions within a few days."
        primary={{
          href: "/contact?service=invite",
          label: "Design My Invitation",
        }}
        secondary={{ href: "/work", label: "View design work" }}
      />
    </>
  );
}
