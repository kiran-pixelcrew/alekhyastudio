import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { WorkGallery } from "@/components/work/WorkGallery";
import { CTABanner } from "@/components/shared/CTABanner";
import { site } from "@/data/site";
import { workItems, type WorkItem } from "@/data/work";
import { withBustedSrc } from "@/lib/publicAsset";
import {
  getSelectedCreatives,
  getSelectedInvitations,
  getSelectedWorkImages,
} from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Portfolio of dance photography, invitation design, and portfolio websites by Alekhya Studio — one artistic eye, three outputs.",
};

export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const [selectedWork, selectedInvitations, selectedCreatives] =
    await Promise.all([
      getSelectedWorkImages(),
      getSelectedInvitations(),
      getSelectedCreatives(),
    ]);

  const staticItems = withBustedSrc(workItems);
  let items: WorkItem[] = staticItems;

  if (selectedWork && selectedWork.length > 0) {
    const nonPhoto = items.filter((item) => item.category !== "photography");
    const photoItems: WorkItem[] = selectedWork.map((image) => ({
      id: image.id,
      title: image.alt,
      category: "photography",
      alt: image.alt,
      src: image.src,
      aspect: image.aspect,
    }));
    items = [...photoItems, ...nonPhoto];
  }

  const dbInviteCreatives: WorkItem[] = [
    ...selectedInvitations.map((image) => ({
      id: image.id,
      title: image.alt,
      category: "invitations&creatives" as const,
      alt: image.alt,
      src: image.src,
      aspect: image.aspect,
      width: image.width,
      height: image.height,
    })),
    ...selectedCreatives.map((image) => ({
      id: image.id,
      title: image.alt,
      category: "invitations&creatives" as const,
      alt: image.alt,
      src: image.src,
      aspect: image.aspect,
      width: image.width,
      height: image.height,
    })),
  ];

  // Keep existing static samples and add admin uploads in front.
  if (dbInviteCreatives.length > 0) {
    const staticInviteCreatives = items.filter(
      (item) => item.category === "invitations&creatives",
    );
    const otherItems = items.filter(
      (item) => item.category !== "invitations&creatives",
    );
    items = [...otherItems, ...dbInviteCreatives, ...staticInviteCreatives];
  }

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Our Work"
        description="Photography, invitations, posters, and portfolio websites — filterable across all three crafts."
      />
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<p className="text-charcoal-muted">Loading work…</p>}>
            <WorkGallery items={items} />
          </Suspense>
        </div>
      </section>
      <CTABanner
        title="Have a show coming up? A portfolio that needs to catch up to your talent?"
        description="Let's talk."
        primary={{ href: "/contact", label: "Start a Project" }}
        secondary={{ href: site.whatsapp, label: "WhatsApp Us", external: true }}
      />
    </>
  );
}
