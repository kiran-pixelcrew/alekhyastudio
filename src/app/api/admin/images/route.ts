import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import { GALLERY_FOLDERS } from "@/lib/cloudinary";
import { GalleryImage } from "@/models/GalleryImage";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder");
  const selected = searchParams.get("selected");

  const filter: Record<string, unknown> = {};
  if (folder && (GALLERY_FOLDERS as readonly string[]).includes(folder)) {
    filter.folder = folder;
  }
  if (selected === "true") filter.selected = true;
  if (selected === "false") filter.selected = false;

  const images = await GalleryImage.find(filter)
    .sort({ selected: -1, sortOrder: 1, createdAt: -1 })
    .lean();

  return NextResponse.json({ images });
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
  if (!id) return jsonError("Image id is required.");

  const updates: Record<string, unknown> = {};
  if (typeof data.selected === "boolean") updates.selected = data.selected;
  if (typeof data.alt === "string") updates.alt = data.alt.trim();
  if (typeof data.sortOrder === "number") updates.sortOrder = data.sortOrder;
  if (
    typeof data.folder === "string" &&
    (GALLERY_FOLDERS as readonly string[]).includes(data.folder)
  ) {
    updates.folder = data.folder;
  }
  if (typeof data.desktopPosition === "string") {
    updates.desktopPosition = data.desktopPosition.trim();
  }
  if (typeof data.mobilePosition === "string") {
    updates.mobilePosition = data.mobilePosition.trim();
  }

  const image = await GalleryImage.findByIdAndUpdate(id, updates, {
    new: true,
  }).lean();

  if (!image) return jsonError("Image not found.", 404);
  return NextResponse.json({ image });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return jsonError("Image id is required.");

  const image = await GalleryImage.findById(id);
  if (!image) return jsonError("Image not found.", 404);

  try {
    const { getCloudinary } = await import("@/lib/cloudinary");
    await getCloudinary().uploader.destroy(image.publicId);
  } catch (cloudError) {
    console.error("Cloudinary delete failed:", cloudError);
  }

  await image.deleteOne();
  return NextResponse.json({ ok: true });
}
