import { unstable_noStore as noStore } from "next/cache";
import type { HeroSlide } from "@/data/hero";
import { getHeroSlides as getStaticHeroSlides } from "@/data/hero";

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
    }));
  } catch (error) {
    console.error("Failed to load work images from database:", error);
    return null;
  }
}
