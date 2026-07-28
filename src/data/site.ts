export const site = {
  name: "AlekhyaStudio",
  displayName: "Alekhya Studio",
  tagline: "One eye. Every frame of your art.",
  positioning: "One eye. Three outputs.",
  mission:
    "We see artists the way artists see their art — and we build everything around that: the photograph, the invitation, the poster, the portfolio.",
  description:
    "Alekhya Studio captures dance through photography, designs invitations & event posters, and builds portfolio websites for dancers, choreographers, and artists in Bangalore.",
  email: "saishashiby@gmail.com",
  phone: "+91 9986563999",
  whatsapp: "https://wa.me/9986563999",
  instagram: "https://www.instagram.com/alekhyadancephoto",
  location: "Bangalore, India",
  calendly: "https://calendly.com/",
} as const;

export const heroContent = {
  eyebrow: "Dance Photography · Invitation & Poster Design · Artist Portfolios",
  headline: "We make dancers look as good on paper (and pixels) as they do on stage.",
  subheadline:
    "Alekhya Studio is a crew of artistic eyes — we shoot your performances, design your invitations and event posters, and build portfolio websites that don't embarrass you in front of a sabha committee.",
  primaryCta: { label: "See Our Work", href: "/work" },
  secondaryCta: { label: "Let's Talk About Your Next Show", href: "/contact" },
} as const;

export const whyAlekhya = {
  eyebrow: "Why artists choose Alekhya",
  title: "We understand the art form — not just the camera.",
  points: [
    "Abhinaya, adavus, mudras, stage timing — we know what to wait for.",
    "One studio, one vision — your photography, invitation, and website all speak the same visual language.",
    "Built for performers, by performers — our founder is a dancer and choreographer too. We're not outsiders shooting a foreign art form.",
  ],
} as const;

export const threeCrafts = {
  eyebrow: "Services",
  title: "Three crafts. One artistic eye.",
  intro:
    "We don't just photograph your dance — we design the invitation that brings people to watch it, and the website that lets them find you long after the curtains close.",
  cards: [
    {
      title: "Dance Photography",
      tagline: "We freeze the moment before it disappears.",
      description:
        "Performance photography, portrait sessions, and event coverage that capture abhinaya, energy, and expression — not just a dancer mid-air.",
      cta: { label: "Explore Photography", href: "/photography" },
    },
    {
      title: "Artist Portfolio Websites",
      tagline: 'Because "DM me for my portfolio" isn\'t a portfolio.',
      description:
        "Clean, personal websites for dancers, choreographers, and gurus — built to showcase your journey the way it deserves to be seen.",
      cta: { label: "View Portfolio Sites", href: "/websites" },
    },
    {
      title: "Invitation & Event Poster Design",
      tagline: "The first impression of your show, before the show even begins.",
      description:
        "Elegant, culturally rooted invitation and poster designs for arangetrams, recitals, and festivals — designed to be shared, saved, and remembered.",
      cta: { label: "See Design Work", href: "/invitations" },
    },
  ],
} as const;

export const serviceNavLinks = [
  { href: "/photography", label: "Dance Photography" },
  { href: "/websites", label: "Portfolio Websites" },
  { href: "/social-media", label: "Social Media" },
  { href: "/invitations", label: "Invitations & Posters" },
] as const;

export const navLinks = [
  { href: "/work", label: "Our Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = [
  {
    title: "Services",
    links: [
      { href: "/photography", label: "Dance Photography" },
      { href: "/invitations", label: "Invitations & Posters" },
      { href: "/websites", label: "Portfolio Websites" },
      { href: "/social-media", label: "Social Media" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "/about", label: "About the Studio" },
      { href: "/work", label: "Our Work" },
      { href: "/contact", label: "Contact" },
      { href: site.instagram, label: "Instagram", external: true },
      { href: site.whatsapp, label: "WhatsApp", external: true },
    ],
  },
] as const;
