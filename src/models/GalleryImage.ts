import { Schema, models, model, type InferSchemaType } from "mongoose";
import { GALLERY_FOLDERS } from "@/lib/cloudinary";

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

export const GalleryImage =
  models.GalleryImage || model("GalleryImage", GalleryImageSchema);
