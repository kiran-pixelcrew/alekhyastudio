import { Schema, models, model, type InferSchemaType } from "mongoose";

export const EMAIL_STATUSES = ["sent", "failed"] as const;

const EmailLogSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["contact", "outbound"],
      default: "contact",
    },
    fromEmail: { type: String, trim: true, default: "" },
    toEmail: { type: String, required: true, trim: true },
    replyTo: { type: String, trim: true, default: "" },
    subject: { type: String, required: true, trim: true },
    preview: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: EMAIL_STATUSES,
      default: "sent",
    },
    errorMessage: { type: String, trim: true, default: "" },
    payload: {
      name: String,
      email: String,
      services: [String],
      eventDate: String,
      about: String,
      instagram: String,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  { timestamps: true },
);

EmailLogSchema.index({ createdAt: -1 });
EmailLogSchema.index({ status: 1 });

export type EmailLogDocument = InferSchemaType<typeof EmailLogSchema> & {
  _id: Schema.Types.ObjectId;
};

export const EmailLog = models.EmailLog || model("EmailLog", EmailLogSchema);
