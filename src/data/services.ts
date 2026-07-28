export type ServiceId =
  | "photography"
  | "invitations"
  | "websites";

export type Service = {
  id: ServiceId;
  href: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
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
    eyebrow: "Photography",
    summary:
      "Performance photography, portrait sessions, and event coverage that capture abhinaya, energy, and expression.",
    description:
      "Every dance form has a thousand small moments most cameras miss — the breath before a jump, the exact frame where abhinaya turns into emotion, the split second a guru's eyes soften watching their student. That's what we shoot for.",
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
    id: "invitations",
    href: "/invitations",
    title: "Invitation & Event Poster Design",
    shortTitle: "Design Studio",
    eyebrow: "Design Studio",
    summary:
      "Invitations and posters that carry the same emotion as your performance — rooted in classical aesthetics, sharp enough for a WhatsApp forward and a printed card both.",
    description:
      "We design invitations and posters that carry the same emotion as your performance — rooted in classical aesthetics, but sharp enough for a WhatsApp forward and a printed card both.",
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
  {
    id: "websites",
    href: "/websites",
    title: "Artist Portfolio Websites",
    shortTitle: "Portfolio Websites",
    eyebrow: "Portfolio Websites",
    summary:
      "Custom portfolio websites for dancers, choreographers, and gurus — built to showcase your journey the way it deserves to be seen.",
    description:
      "A proper portfolio website means event organizers, students, and collaborators find you and understand your work in one visit — no scrolling through 400 Instagram posts to figure out what you do.",
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
];

export function getService(id: ServiceId) {
  return services.find((service) => service.id === id)!;
}
