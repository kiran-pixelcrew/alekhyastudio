import { Schema, models, model, type InferSchemaType } from "mongoose";

export const BOOKING_STATUSES = [
  "inquiry",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

const BookingSchema = new Schema(
  {
    clientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    service: { type: String, required: true, trim: true },
    eventDate: { type: Date },
    location: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: "inquiry",
    },
    notes: { type: String, trim: true, default: "" },
    amountQuoted: { type: Number, min: 0 },
    source: {
      type: String,
      enum: ["contact", "manual", "whatsapp"],
      default: "manual",
    },
  },
  { timestamps: true },
);

BookingSchema.index({ eventDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });

export type BookingDocument = InferSchemaType<typeof BookingSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Booking = models.Booking || model("Booking", BookingSchema);
