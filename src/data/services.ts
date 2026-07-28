export type ServiceId =
  | "photography"
  | "videography"
  | "websites&portfolios"
  | "social-media"
  | "invitations&creatives";

export type Service = {
  id: ServiceId;
  href: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  tagline: string;
  summary: string;
  description: string;
  cta: { label: string; href: string };
  highlights: string[];
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    id: "photography",
    href: "/photography",
    title: "Dance Photography",
    shortTitle: "Photography",
    eyebrow: "Dance Photography",
    tagline: "We don't capture dancers. We capture the art they leave behind.",
    summary:
      "Dance photography that captures expression, movement, emotion, and every moment worth reliving—from rehearsals to standing ovations.",
    description:
      "Dance photography that captures expression, movement, emotion, and every moment worth reliving—from rehearsals to standing ovations.",
    cta: { label: "Book a Shoot", href: "/contact?service=photo" },
    highlights: [
      "Performance Photography",
      "Portrait & Concept Shoots",
      "Event & Sabha Coverage",
    ],
    seoTitle: "Dance Photography & Bharatanatyam Photographer",
    seoDescription:
      "Dance photography in Bangalore — Bharatanatyam photographer, Kathak performance photography, arangetram photography, classical dance photoshoots, and dance portrait sessions.",
  },
  {
    id: "videography",
    href: "/videography",
    title: "Dance Videography",
    shortTitle: "Videography",
    eyebrow: "Dance Videography",
    tagline: "Every performance deserves an encore.",
    summary:
      "Cinematic dance videography, performance films, highlight reels, and event coverage that keep your art moving long after the curtain falls.",
    description:
      "Cinematic dance videography, performance films, highlight reels, and event coverage that keep your art moving long after the curtain falls.",
    cta: { label: "Book Videography", href: "/contact?service=video" },
    highlights: [
      "Performance & Recital Films",
      "Highlight Reels & Show Trailers",
      "Multi-camera Stage Coverage",
      "Portrait & Concept Films",
    ],
    seoTitle: "Dance Videography & Performance Films",
    seoDescription:
      "Dance videography in Bangalore — Bharatanatyam performance films, arangetram videography, classical dance highlight reels, and multi-camera stage coverage for dancers and academies.",
  },
  {
    id: "websites&portfolios",
    href: "/websites",
    title: "Portfolio Websites",
    shortTitle: "Portfolio Websites",
    eyebrow: "Portfolio Websites",
    tagline: "Your talent deserves more than a Link in Bio.",
    summary:
      "Beautiful portfolio websites for dancers, choreographers, teachers, and artists—designed to showcase your journey and help people discover your work.",
    description:
      "Beautiful portfolio websites for dancers, choreographers, teachers, and artists—designed to showcase your journey and help people discover your work.",
    cta: { label: "Build My Portfolio", href: "/contact?service=web" },
    highlights: [
      "Custom design reflecting your artistic identity",
      "Performance reels, photo galleries, bio, and press",
      "Contact/booking-friendly layout for organizers",
      "Mobile-first (because that's how you'll be found)",
    ],
    seoTitle: "Portfolio Website for Dancers & Performing Artists",
    seoDescription:
      "Portfolio website for dancers, website design for performing artists, choreographer portfolio website, artist website designer India, and dance academy website design.",
  },
  {
    id: "social-media",
    href: "/social-media",
    title: "Social Media",
    shortTitle: "Social Media",
    eyebrow: "Social Media",
    tagline: "Turn every scroll into a front-row seat.",
    summary:
      "Reels, posters, event promotions, and branded social media content that keeps your audience engaged before and after every performance.",
    description:
      "Reels, posters, event promotions, and branded social media content that keeps your audience engaged before and after every performance.",
    cta: { label: "Plan My Content", href: "/contact?service=social" },
    highlights: [
      "Instagram Branding & Grid Direction",
      "Reels, Stills & Caption Systems",
      "Event & Arangetram Promotion Kits",
      "Monthly Content Planning",
    ],
    seoTitle: "Social Media for Dancers & Performing Artists",
    seoDescription:
      "Social media for dancers in Bangalore — Instagram branding, classical dance reels, arangetram promotion kits, and content systems for performing artists and dance academies.",
  },
  {
    id: "invitations&creatives",
    href: "/invitations",
    title: "Invitation & Creatives",
    shortTitle: "Design Studio",
    eyebrow: "Design Studio",
    tagline: "The first applause begins with great design.",
    summary:
      "Elegant invitation designs, event posters, and creative branding for arangetrams, rangapraveshas, recitals, and cultural events.",
    description:
      "Elegant invitation designs, event posters, and creative branding for arangetrams, rangapraveshas, recitals, and cultural events.",
    cta: { label: "Design My Invitation", href: "/contact?service=invite" },
    highlights: [
      "Arangetram & Recital Invitations",
      "Event & Show Posters",
      "Programme Booklets / Digital Invites",
    ],
    seoTitle: "Arangetram Invitation Design & Dance Event Posters",
    seoDescription:
      "Arangetram invitation design, dance event poster design, Indian classical dance invitations, recital invitation designer, and cultural event poster design.",
  },
];

export function getService(id: ServiceId) {
  return services.find((service) => service.id === id)!;
}
