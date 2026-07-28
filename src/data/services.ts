export type ServiceId =
  | "photography"
  | "invitations&creatives"
  | "websites&portfolios"
  | "videography"
  | "social-media";

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
    id: "videography",
    href: "/videography",
    title: "Dance Videography",
    shortTitle: "Videography",
    eyebrow: "Videography",
    summary:
      "Performance films, highlight reels, and multi-camera coverage that preserve rhythm, abhinaya, and stage energy in motion.",
    description:
      "Still frames freeze a moment. Video lets your audience feel the journey — the opening namaskaram, the build of a jathi, the silence after the last pose. We film classical dance with the same artistic eye as our photography: timing that respects the music, framing that honours abhinaya, and edits that feel like the performance itself.",
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
  {
    id: "social-media",
    href: "/social-media",
    title: "Social Media for Artists",
    shortTitle: "Social Media",
    eyebrow: "Social Media",
    summary:
      "Branded content systems, reels, and event promotion that help dancers and academies show up consistently — without looking generic.",
    description:
      "Your Instagram should feel like your stage presence, not a random feed of phone clips. We build social media systems for performing artists — visual direction, reels and stills around shows and classes, and campaign kits for arangetrams and festivals — so students and organisers recognise your art the moment they land on your profile.",
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
];

export function getService(id: ServiceId) {
  return services.find((service) => service.id === id)!;
}
