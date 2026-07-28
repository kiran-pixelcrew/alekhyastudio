import { photographyItems } from "./photography";
import { invitationProjects } from "./invitations";
import { creativeProjects } from "./creative";
import { pastSites } from "./web";

export type WorkCategory =
  | "photography"
  | "websites"
  | "invitations&creatives"

export const workCategories: { id: WorkCategory; label: string }[] = [
  { id: "photography", label: "Photography" },
  { id: "websites", label: "Websites" },
  { id: "invitations&creatives", label: "Invitations & Creatives" },
];

export type WorkItem = {
  id: string;
  title: string;
  category: WorkCategory;
  alt: string;
  src: string;
  aspect: "portrait" | "landscape" | "square";
  href?: string;
};

export const workItems: WorkItem[] = [
  ...photographyItems.slice(0, 10).map((item) => ({
    id: `w-${item.id}`,
    title: item.title,
    category: "photography" as const,
    alt: item.alt,
    src: item.src,
    aspect: item.aspect,
  })),
  ...invitationProjects.map((item) => ({
    id: `w-${item.id}`,
    title: item.title,
    category: "invitations&creatives" as const,
    alt: item.alt,
    src: item.src,
    aspect: "landscape" as const,
  })),
  ...pastSites.map((item) => ({
    id: `w-${item.id}`,
    title: item.title,
    category: "websites" as const,
    alt: item.alt,
    src: item.src,
    aspect: "landscape" as const,
    href: item.href,
  })),
  {
    id: "w-m1",
    title: "Instagram Grid System",
    category: "invitations&creatives",
    alt: "Curated social media visual grid for an artist brand",
    src: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80",
    aspect: "square",
  },
  {
    id: "w-m2",
    title: "Event Promotion Kit",
    category: "invitations&creatives",
    alt: "Event promotion creative for a classical dance showcase",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    aspect: "landscape",
  },
  ...creativeProjects.map((item) => ({
    id: `w-${item.id}`,
    title: item.title,
    category: "invitations&creatives" as const,
    alt: item.alt,
    src: item.src,
    aspect: "square" as const,
  })),
];

export const featuredWork = workItems.filter((item) =>
  ["w-s1", "w-s2", "w-s3", "w-s4"].includes(item.id),
);
