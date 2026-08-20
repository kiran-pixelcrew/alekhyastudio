import { Schema, models, model, type InferSchemaType } from "mongoose";
import { GALLERY_FOLDERS } from "@/lib/gallery-folders";

const GalleryImageSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    folder: {
      type: String,
      enum: GALLERY_FOLDERS,
      default: "general",
    },
    alt: { type: String, trim: true, default: "" },
    width: { type: Number },
    height: { type: Number },
    format: { type: String, default: "" },
    bytes: { type: Number },
    /** When true, image is shown on the public site for its folder. */
    selected: { type: Boolean, default: false },
    /**
     * Bento tile shape on the site.
     * auto = infer from width/height; portrait = 9:16; landscape = 16:9.
     */
    displayAspect: {
      type: String,
      enum: ["auto", "portrait", "landscape"],
      default: "auto",
    },
    sortOrder: { type: Number, default: 0 },
    desktopPosition: { type: String, default: "" },
    mobilePosition: { type: String, default: "" },
  },
  { timestamps: true },
);

GalleryImageSchema.index({ folder: 1, selected: 1, sortOrder: 1 });

export type GalleryImageDocument = InferSchemaType<
  typeof GalleryImageSchema
> & {
  _id: Schema.Types.ObjectId;
};

// Hot reload can keep a stale compiled model without new paths — rebuild if needed.
const existing = models.GalleryImage;
if (existing && !existing.schema.path("displayAspect")) {
  delete models.GalleryImage;
}

export const GalleryImage =
  models.GalleryImage || model("GalleryImage", GalleryImageSchema);
