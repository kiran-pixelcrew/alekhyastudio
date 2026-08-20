import { v2 as cloudinary } from "cloudinary";

export {
  GALLERY_FOLDERS,
  GALLERY_FOLDER_LABELS,
  type GalleryFolder,
} from "@/lib/gallery-folders";

let configured = false;

export function getCloudinary() {
  if (!configured) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials are not configured.");
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }

  return cloudinary;
}

export const VIDEO_UPLOAD_FOLDER = "alekhyastudio/videography";
export const VIDEO_UPLOAD_PRESET = "alekhya_videography_unsigned";

/** Poster frame URL for a Cloudinary video public_id. */
export function cloudinaryVideoThumbnail(publicId: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_1280,h_720,c_fill,q_auto,f_jpg/${publicId}.jpg`;
}

/**
 * Ensure an unsigned upload preset exists so the browser can upload
 * directly to Cloudinary (one hop — much faster than proxying via Next.js).
 */
export async function ensureVideoUploadPreset() {
  const cloudinary = getCloudinary();
  const name =
    process.env.CLOUDINARY_VIDEO_UPLOAD_PRESET?.trim() || VIDEO_UPLOAD_PRESET;

  try {
    await cloudinary.api.upload_preset(name);
  } catch {
    await cloudinary.api.create_upload_preset({
      name,
      unsigned: true,
      folder: VIDEO_UPLOAD_FOLDER,
      allowed_formats: "mp4,mov,webm,m4v",
    });
  }

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    uploadPreset: name,
  };
}
