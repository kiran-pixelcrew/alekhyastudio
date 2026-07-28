import { CTABanner } from "@/components/shared/CTABanner";
import { site } from "@/data/site";

export function FinalCTA() {
  return (
    <CTABanner
      title="Start Your Creative Journey"
      description="Tell us what you're creating—we'll take care of the rest. Whether it's dance photography, videography, invitation design, a portfolio website, or a complete creative identity, we're here to make the journey seamless—from your first idea to the final applause."
      primary={{ href: "/contact", label: "Start a Project →" }}
      secondary={{ href: site.whatsapp, label: "WhatsApp Us", external: true }}
    />
  );
}
