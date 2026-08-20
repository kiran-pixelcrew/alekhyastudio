import { unstable_noStore as noStore } from "next/cache";

export type PublicVideo = {
  id: string;
  title: string;
  description: string;
  secureUrl: string;
  thumbnailUrl: string;
  duration?: number;
  width?: number;
  height?: number;
};

export async function getSelectedVideos(): Promise<PublicVideo[]> {
  noStore();

  try {
    if (!process.env.MONGODB_URI) return [];

    const { connectDb } = await import("@/lib/db");
    const { GalleryVideo } = await import("@/models/GalleryVideo");
    const { cloudinaryVideoThumbnail } = await import("@/lib/cloudinary");
    await connectDb();

    const videos = await GalleryVideo.find({ selected: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return videos.map((video) => ({
      id: String(video._id),
      title: video.title,
      description: video.description || "",
      secureUrl: video.secureUrl,
      thumbnailUrl:
        video.thumbnailUrl || cloudinaryVideoThumbnail(video.publicId),
      duration: video.duration,
      width: video.width,
      height: video.height,
    }));
  } catch (error) {
    console.error("Failed to load videos from database:", error);
    return [];
  }
}
