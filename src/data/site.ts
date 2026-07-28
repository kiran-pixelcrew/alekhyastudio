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
  eyebrow: "Dance Photography · Videography · Invitation & Creatives · Artistic Portfolio Websites · Social Media",
  headline: "",
  subheadline:
    "From designing your invitation to capturing your performance, building your portfolio or creating your website — everything comes together seamlessly, under one creative roof.",
  primaryCta: { label: "Start Your Creative Journey →", href: "/contact" },
  secondaryCta: { label: "Explore Our Work", href: "/work" },
} as const;

export const whyAlekhya = {
  eyebrow: "Why Alekhya",
  title: "Why Alekhya is different",
  description: "Because your art deserves to be understood before it is captured.",
  points: [
    {
      title: "Beyond the lens",
      text: "We recognize the rhythm, emotion, and storytelling hidden within every movement.",
    },
    {
      title: "A unified visual journey",
      text: "Your memories, celebrations, and digital presence are crafted with one thoughtful creative direction.",
    },
    {
      title: "Rooted in the art form",
      text: "Led by a dancer and choreographer, Alekhya brings an insider's perspective to every frame.",
    },
  ],
} as const;

export const threeCrafts = {
  eyebrow: "Services",
  title: "One creative studio. Every piece your art deserves.",
  intro:
    "Dance photography, videography, invitation design, social media creatives, and portfolio websites—all crafted by artists who understand the stage, not just the software.",
  closing:
    "Created by artists, for artists—because great art deserves people who already speak its language",
  cards: [
    {
      title: "Dance Photography",
      tagline: "We don't capture dancers. We capture the art they leave behind.",
      description:
        "Dance photography that captures expression, movement, emotion, and every moment worth reliving—from rehearsals to standing ovations.",
      cta: { label: "See Photography", href: "/photography" },
    },
    {
      title: "Videography",
      tagline: "Every performance deserves an encore.",
      description:
        "Cinematic dance videography, performance films, highlight reels, and event coverage that keep your art moving long after the curtain falls.",
      cta: { label: "Watch Our Films", href: "/videography" },
    },
    {
      title: "Portfolio Websites",
      tagline: "Your talent deserves more than a Link in Bio.",
      description:
        "Beautiful portfolio websites for dancers, choreographers, teachers, and artists—designed to showcase your journey and help people discover your work.",
      cta: { label: "Explore Websites", href: "/websites" },
    },
    {
      title: "Social Media",
      tagline: "Turn every scroll into a front-row seat.",
      description:
        "Reels, posters, event promotions, and branded social media content that keeps your audience engaged before and after every performance.",
      cta: { label: "Explore Social Media", href: "/social-media" },
    },
    {
      title: "Invitation & Creatives",
      tagline: "The first applause begins with great design.",
      description:
        "Elegant invitation designs, event posters, and creative branding for arangetrams, rangapraveshas, recitals, and cultural events.",
      cta: { label: "View Design Work", href: "/invitations" },
    },
  ],
} as const;

export const serviceNavLinks = [
  { href: "/photography", label: "Dance Photography" },
  { href: "/websites", label: "Portfolio Websites" },
  { href: "/videography", label: "Videography" },
  { href: "/social-media", label: "Social Media" },
  { href: "/invitations", label: "Invitations & Creatives" },
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
      { href: "/websites", label: "Portfolio Websites" },
      { href: "/videography", label: "Videography" },
      { href: "/invitations", label: "Invitations & Creatives" },
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
