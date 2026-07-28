import { CTABanner } from "@/components/shared/CTABanner";
import { site } from "@/data/site";

export function FinalCTA() {
  return (
    <CTABanner
      title="Have a show coming up? A portfolio that needs to catch up to your talent?"
      description="Let's talk."
      primary={{ href: "/contact", label: "Start a Project" }}
      secondary={{ href: site.whatsapp, label: "WhatsApp Us", external: true }}
    />
  );
}
