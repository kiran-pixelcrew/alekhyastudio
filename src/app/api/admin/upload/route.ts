import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import { GALLERY_FOLDERS, getCloudinary, type GalleryFolder } from "@/lib/cloudinary";
import { GalleryImage } from "@/models/GalleryImage";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid form data.");
  }

  const file = formData.get("file");
  const folderRaw = formData.get("folder");
  const altRaw = formData.get("alt");
  const selectedRaw = formData.get("selected");
  const displayAspectRaw = formData.get("displayAspect");

  if (!(file instanceof File)) {
    return jsonError("A file is required.");
  }

  const folder =
    typeof folderRaw === "string" &&
    (GALLERY_FOLDERS as readonly string[]).includes(folderRaw)
      ? (folderRaw as GalleryFolder)
      : "general";

  const alt = typeof altRaw === "string" ? altRaw.trim() : "";
  const selected = selectedRaw === "true";
  const displayAspect =
    displayAspectRaw === "portrait" || displayAspectRaw === "landscape"
      ? displayAspectRaw
      : "auto";

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type || "image/jpeg"};base64,${bytes.toString("base64")}`;

  try {
    const cloudinary = getCloudinary();
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `alekhyastudio/${folder}`,
      resource_type: "image",
    });

    const maxOrder = await GalleryImage.findOne({ folder })
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();

    const image = await GalleryImage.create({
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      folder,
      alt: alt || file.name.replace(/\.[^.]+$/, ""),
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      selected,
      displayAspect,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (uploadError) {
    console.error("Upload failed:", uploadError);
    return NextResponse.json(
      { error: "Unable to upload image right now." },
      { status: 500 },
    );
  }
}
