import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/shared/Button";
import { CTABanner } from "@/components/shared/CTABanner";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { VideoShowcase } from "@/components/videography/VideoShowcase";
import { getService } from "@/data/services";
import { site } from "@/data/site";
import { getSelectedVideos } from "@/lib/videos";

const service = getService("videography");

export const metadata: Metadata = {
  title: service.seoTitle,
  description: service.seoDescription,
};

export default async function VideographyPage() {
  const videos = await getSelectedVideos();

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

      {videos.length > 0 ? (
        <section className="px-5 py-16 md:px-8 md:py-24">
          <FadeIn className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="On film"
              title="Recent performance films"
              description="Selected work from stages and studios — cinematic coverage that keeps the evening alive after the curtain."
            />
            <div className="mt-10">
              <VideoShowcase videos={videos} />
            </div>
          </FadeIn>
        </section>
      ) : null}

      <section className="px-5 py-16 md:px-8 md:py-24">
        <FadeIn className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="What we film"
            title="Performance films, reels, and stage coverage"
            description="We film Indian classical dance with cultural fluency — respecting music, mudra, and stage geography so the final cut feels true to the performance."
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
          <p className="mt-10 max-w-2xl text-charcoal-muted leading-relaxed">
            Whether you need a full recital film, a short show trailer, or
            multi-camera coverage for an arangetram, we plan angles and edits
            around your art form — not generic event videography. Browse related
            work in{" "}
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
        title="Want your next show on film?"
        description="Tell us the date, venue, and art form — we'll recommend a coverage plan that fits the evening."
        primary={{ href: "/contact?service=video", label: "Book Videography" }}
        secondary={{ href: "/photography", label: "Add photography" }}
      />
    </>
  );
}
