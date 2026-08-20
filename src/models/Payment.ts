import { Schema, models, model, type InferSchemaType } from "mongoose";

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "partial",
  "refunded",
] as const;

export const PAYMENT_METHODS = [
  "upi",
  "bank_transfer",
  "cash",
  "card",
  "other",
] as const;

const PaymentSchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    clientName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    method: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "upi",
    },
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
    },
    paidAt: { type: Date },
    reference: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

export type PaymentDocument = InferSchemaType<typeof PaymentSchema> & {
  _id: Schema.Types.ObjectId;
};

export const Payment = models.Payment || model("Payment", PaymentSchema);
