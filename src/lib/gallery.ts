import { unstable_noStore as noStore } from "next/cache";
import type { HeroSlide } from "@/data/hero";
import { getHeroSlides as getStaticHeroSlides } from "@/data/hero";
import type { BentoAspect } from "@/lib/bentoGrid";

export type GalleryMediaItem = {
  id: string;
  src: string;
  alt: string;
  aspect: BentoAspect;
  width?: number;
  height?: number;
};

export type DisplayAspect = "auto" | "portrait" | "landscape";

export function aspectFromDimensions(
  width?: number | null,
  height?: number | null,
): BentoAspect {
  if (!width || !height || width <= 0 || height <= 0) {
    return "portrait";
  }
  const ratio = width / height;
  if (ratio >= 1.2) return "landscape";
  if (ratio <= 0.85) return "portrait";
  return "square";
}

export function resolveDisplayAspect(
  displayAspect: DisplayAspect | string | null | undefined,
  width?: number | null,
  height?: number | null,
): BentoAspect {
  if (displayAspect === "portrait" || displayAspect === "landscape") {
    return displayAspect;
  }
  return aspectFromDimensions(width, height);
}

export async function getSelectedHeroSlides(): Promise<HeroSlide[]> {
  noStore();

  try {
    if (!process.env.MONGODB_URI) {
      return getStaticHeroSlides();
    }

    const { connectDb } = await import("@/lib/db");
    const { GalleryImage } = await import("@/models/GalleryImage");
    await connectDb();

    const images = await GalleryImage.find({
      folder: "hero",
      selected: true,
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    if (images.length === 0) {
      return getStaticHeroSlides();
    }

    return images.map((image, index) => ({
      id: String(image._id),
      desktop: image.secureUrl,
      mobile: image.secureUrl,
      alt: image.alt || `Hero image ${index + 1}`,
      desktopPosition: image.desktopPosition || undefined,
      mobilePosition: image.mobilePosition || undefined,
    }));
  } catch (error) {
    console.error("Failed to load hero images from database:", error);
    return getStaticHeroSlides();
  }
}

export async function getSelectedWorkImages() {
  noStore();

  try {
    if (!process.env.MONGODB_URI) return null;

    const { connectDb } = await import("@/lib/db");
    const { GalleryImage } = await import("@/models/GalleryImage");
    await connectDb();

    const images = await GalleryImage.find({
      folder: "work",
      selected: true,
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    if (images.length === 0) return null;

    return images.map((image, index) => ({
      id: String(image._id),
      src: image.secureUrl,
      alt: image.alt || `Portfolio image ${index + 1}`,
      category: "photography" as const,
      aspect: resolveDisplayAspect(
        image.displayAspect,
        image.width,
        image.height,
      ),
    }));
  } catch (error) {
    console.error("Failed to load work images from database:", error);
    return null;
  }
}

export async function getSelectedCreatives(): Promise<GalleryMediaItem[]> {
  noStore();

  try {
    if (!process.env.MONGODB_URI) return [];

    const { connectDb } = await import("@/lib/db");
    const { GalleryImage } = await import("@/models/GalleryImage");
    await connectDb();

    const images = await GalleryImage.find({
      folder: "creatives",
      selected: true,
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return images.map((image, index) => ({
      id: String(image._id),
      src: image.secureUrl,
      alt: image.alt || `Creative ${index + 1}`,
      aspect: resolveDisplayAspect(
        image.displayAspect,
        image.width,
        image.height,
      ),
      width: image.width,
      height: image.height,
    }));
  } catch (error) {
    console.error("Failed to load creatives from database:", error);
    return [];
  }
}

export async function getSelectedInvitations(): Promise<GalleryMediaItem[]> {
  noStore();

  try {
    if (!process.env.MONGODB_URI) return [];

    const { connectDb } = await import("@/lib/db");
    const { GalleryImage } = await import("@/models/GalleryImage");
    await connectDb();

    const images = await GalleryImage.find({
      folder: "invitations",
      selected: true,
    })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return images.map((image, index) => ({
      id: String(image._id),
      src: image.secureUrl,
      alt: image.alt || `Invitation ${index + 1}`,
      aspect: resolveDisplayAspect(
        image.displayAspect,
        image.width,
        image.height,
      ),
      width: image.width,
      height: image.height,
    }));
  } catch (error) {
    console.error("Failed to load invitations from database:", error);
    return [];
  }
}
