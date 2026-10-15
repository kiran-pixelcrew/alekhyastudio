export const GALLERY_FOLDERS = [
  "hero",
  "work",
  "invitations",
  "creatives",
  "websites",
  "general",
] as const;

export type GalleryFolder = (typeof GALLERY_FOLDERS)[number];

export const GALLERY_FOLDER_LABELS: Record<GalleryFolder, string> = {
  hero: "Hero",
  work: "Work",
  invitations: "Invitations",
  creatives: "Creatives",
  websites: "Websites",
  general: "General",
};

/** Desktop and mobile heroes are separate. A file is never used on both. */
export function heroScreenForImage(image: {
  heroTarget?: string | null;
  width?: number | null;
  height?: number | null;
}): "desktop" | "mobile" {
  if (image.heroTarget === "mobile" || image.heroTarget === "desktop") {
    return image.heroTarget;
  }
  if (image.width && image.height && image.height > image.width) {
    return "mobile";
  }
  return "desktop";
}
