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
