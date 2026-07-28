import { photographyItems } from "./photography";
import { invitationProjects } from "./invitations";
import { pastSites } from "./web";

export type WorkCategory =
  | "photography"
  | "websites&portfolios"
  | "invitations&creatives"

export const workCategories: { id: WorkCategory; label: string }[] = [
  { id: "photography", label: "Dance Photography" },
  { id: "websites&portfolios", label: "Websites & Portfolios" },
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
    category: "websites&portfolios" as const,
    alt: item.alt,
    src: item.src,
    aspect: "landscape" as const,
    href: item.href,
  })),
];

export const featuredWork = workItems.filter((item) =>
  ["w-s1", "w-s2", "w-s3", "w-s4"].includes(item.id),
);
