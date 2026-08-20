import { Schema, models, model, type InferSchemaType } from "mongoose";

const GalleryVideoSchema = new Schema(
  {
    publicId: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    /** Poster / thumbnail image URL (Cloudinary frame). */
    thumbnailUrl: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    duration: { type: Number },
    width: { type: Number },
    height: { type: Number },
    format: { type: String, default: "" },
    bytes: { type: Number },
    /** When true, video appears on the public videography page. */
    selected: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

GalleryVideoSchema.index({ selected: 1, sortOrder: 1, createdAt: -1 });

export type GalleryVideoDocument = InferSchemaType<
  typeof GalleryVideoSchema
> & {
  _id: Schema.Types.ObjectId;
};

export const GalleryVideo =
  models.GalleryVideo || model("GalleryVideo", GalleryVideoSchema);
