import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import {
  cloudinaryVideoThumbnail,
  getCloudinary,
} from "@/lib/cloudinary";
import { GalleryVideo } from "@/models/GalleryVideo";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const videos = await GalleryVideo.find()
    .sort({ selected: -1, sortOrder: 1, createdAt: -1 })
    .lean();

  return NextResponse.json({ videos });
}

/** Save metadata after a direct Cloudinary video upload. */
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  if (!body || typeof body !== "object") {
    return jsonError("Invalid request body.");
  }

  const data = body as Record<string, unknown>;
  const publicId =
    typeof data.publicId === "string" ? data.publicId.trim() : "";
  const secureUrl =
    typeof data.secureUrl === "string" ? data.secureUrl.trim() : "";
  const url = typeof data.url === "string" ? data.url.trim() : secureUrl;
  const title = typeof data.title === "string" ? data.title.trim() : "";

  if (!publicId || !secureUrl || !title) {
    return jsonError("publicId, secureUrl, and title are required.");
  }

  const selected = data.selected === true;
  const maxOrder = await GalleryVideo.findOne()
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();

  const video = await GalleryVideo.create({
    publicId,
    url,
    secureUrl,
    thumbnailUrl:
      typeof data.thumbnailUrl === "string" && data.thumbnailUrl
        ? data.thumbnailUrl
        : cloudinaryVideoThumbnail(publicId),
    title,
    description:
      typeof data.description === "string" ? data.description.trim() : "",
    duration: typeof data.duration === "number" ? data.duration : undefined,
    width: typeof data.width === "number" ? data.width : undefined,
    height: typeof data.height === "number" ? data.height : undefined,
    format: typeof data.format === "string" ? data.format : "",
    bytes: typeof data.bytes === "number" ? data.bytes : undefined,
    selected,
    sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
  });

  return NextResponse.json({ video }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body.");
  }

  if (!body || typeof body !== "object") {
    return jsonError("Invalid request body.");
  }

  const data = body as Record<string, unknown>;
  const id = typeof data.id === "string" ? data.id : "";
  if (!id) return jsonError("Video id is required.");

  const updates: Record<string, unknown> = {};
  if (typeof data.selected === "boolean") updates.selected = data.selected;
  if (typeof data.title === "string") updates.title = data.title.trim();
  if (typeof data.description === "string") {
    updates.description = data.description.trim();
  }
  if (typeof data.sortOrder === "number") updates.sortOrder = data.sortOrder;

  const video = await GalleryVideo.findByIdAndUpdate(id, updates, {
    new: true,
  }).lean();

  if (!video) return jsonError("Video not found.", 404);
  return NextResponse.json({ video });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("Video id is required.");

  const video = await GalleryVideo.findById(id);
  if (!video) return jsonError("Video not found.", 404);

  try {
    await getCloudinary().uploader.destroy(video.publicId, {
      resource_type: "video",
    });
  } catch (cloudError) {
    console.error("Cloudinary video delete failed:", cloudError);
  }

  await video.deleteOne();
  return NextResponse.json({ ok: true });
}
