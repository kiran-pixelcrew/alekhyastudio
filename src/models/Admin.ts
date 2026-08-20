import { Schema, models, model, type InferSchemaType } from "mongoose";

const AdminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export type AdminDocument = InferSchemaType<typeof AdminSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Admin = models.Admin || model("Admin", AdminSchema);
