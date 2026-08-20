import { createWriteStream } from "fs";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import {
  VIDEO_UPLOAD_FOLDER,
  cloudinaryVideoThumbnail,
  getCloudinary,
} from "@/lib/cloudinary";
import { GalleryVideo } from "@/models/GalleryVideo";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_BYTES = 100 * 1024 * 1024; // Cloudinary Free plan max video size
const CHUNK_SIZE = 6_000_000; // Cloudinary docs: min ~5MB for chunked video

type CloudinaryVideoResult = {
  public_id: string;
  url: string;
  secure_url: string;
  duration?: number;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

/**
 * Cloudinary-recommended chunked upload for large videos.
 * @see https://cloudinary.com/documentation/node_image_and_video_upload
 */
function uploadVideoFile(filePath: string): Promise<CloudinaryVideoResult> {
  const cloudinary = getCloudinary();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_chunked(
      filePath,
      {
        resource_type: "video",
        folder: VIDEO_UPLOAD_FOLDER,
        chunk_size: CHUNK_SIZE,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary returned no result."));
          return;
        }
        resolve({
          public_id: result.public_id,
          url: result.url,
          secure_url: result.secure_url,
          duration: result.duration,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );
  });
}

async function writeUploadToTemp(file: File) {
  const dir = await mkdtemp(join(tmpdir(), "alekhya-video-"));
  const safeName = file.name.replace(/[^\w.\-]+/g, "_") || "upload.mp4";
  const filePath = join(dir, safeName);

  // Stream to disk to avoid holding the whole video twice in RAM.
  const nodeStream = Readable.fromWeb(
    file.stream() as unknown as import("stream/web").ReadableStream,
  );
  await pipeline(nodeStream, createWriteStream(filePath));

  return { dir, filePath };
}

/** Upload video via our server → Cloudinary (chunked, avoids browser CORS). */
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (parseError) {
    console.error("Video FormData parse failed:", parseError);
    return jsonError(
      "Could not read the upload. Restart the dev server after the body-size config change, then try again.",
    );
  }

  const file = formData.get("file");
  const titleRaw = formData.get("title");
  const descriptionRaw = formData.get("description");
  const selectedRaw = formData.get("selected");

  if (!(file instanceof File)) {
    return jsonError("A video file is required.");
  }

  const title = typeof titleRaw === "string" ? titleRaw.trim() : "";
  if (!title) {
    return jsonError("A title is required.");
  }

  if (file.size <= 0) {
    return jsonError("The uploaded file is empty.");
  }

  if (file.size > MAX_BYTES) {
    return jsonError(
      "Video must be 100MB or smaller on the Cloudinary Free plan. Compress it, or upgrade Cloudinary to upload larger files.",
    );
  }

  let tempDir: string | null = null;

  try {
    const temp = await writeUploadToTemp(file);
    tempDir = temp.dir;

    const result = await uploadVideoFile(temp.filePath);

    const maxOrder = await GalleryVideo.findOne()
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();

    const video = await GalleryVideo.create({
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      thumbnailUrl: cloudinaryVideoThumbnail(result.public_id),
      title,
      description:
        typeof descriptionRaw === "string" ? descriptionRaw.trim() : "",
      duration: result.duration,
      width: result.width,
      height: result.height,
      format: result.format ?? "",
      bytes: result.bytes,
      selected: selectedRaw === "true",
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    });

    return NextResponse.json({ video }, { status: 201 });
  } catch (uploadError) {
    console.error("Video upload failed:", uploadError);
    const rawMessage =
      uploadError &&
      typeof uploadError === "object" &&
      "message" in uploadError &&
      typeof uploadError.message === "string"
        ? uploadError.message
        : "";

    const message = /file size too large/i.test(rawMessage)
      ? "Cloudinary rejected this file — Free plan max is 100MB. Compress the video under 100MB, or upgrade Cloudinary (Plus allows up to 2GB)."
      : rawMessage || "Unable to upload video right now.";

    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
