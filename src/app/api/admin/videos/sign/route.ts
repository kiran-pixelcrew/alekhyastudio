import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import { ensureVideoUploadPreset } from "@/lib/cloudinary";

/**
 * Returns Cloudinary unsigned-upload details so the browser can upload
 * the video directly (avoids the slow Next.js proxy hop).
 */
export async function POST() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const config = await ensureVideoUploadPreset();
    return NextResponse.json(config);
  } catch (signError) {
    console.error("Video upload preset failed:", signError);
    return jsonError(
      "Unable to prepare Cloudinary upload. Check API credentials and that unsigned presets are allowed.",
      500,
    );
  }
}
