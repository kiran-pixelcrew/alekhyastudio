import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  Payment,
} from "@/models/Payment";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const bookingId = searchParams.get("bookingId");
  const filter: Record<string, unknown> = {};

  if (status && (PAYMENT_STATUSES as readonly string[]).includes(status)) {
    filter.status = status;
  }
  if (bookingId) {
    filter.bookingId = bookingId;
  }

  const payments = await Payment.find(filter)
    .populate("bookingId", "clientName service eventDate status amountQuoted")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ payments });
}

export async function POST(request: Request) {
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
  const clientName =
    typeof data.clientName === "string" ? data.clientName.trim() : "";
  const amount = typeof data.amount === "number" ? data.amount : Number.NaN;

  if (!clientName || !Number.isFinite(amount) || amount < 0) {
    return jsonError("Client name and a valid amount are required.");
  }

  const status =
    typeof data.status === "string" &&
    (PAYMENT_STATUSES as readonly string[]).includes(data.status)
      ? data.status
      : "pending";
  const method =
    typeof data.method === "string" &&
    (PAYMENT_METHODS as readonly string[]).includes(data.method)
      ? data.method
      : "upi";

  const hasPaidDate =
    typeof data.paidAt === "string" && Boolean(data.paidAt);
  const isSettled = status === "paid" || status === "partial";

  const payment = await Payment.create({
    clientName,
    email: typeof data.email === "string" ? data.email.trim().toLowerCase() : "",
    amount,
    currency: typeof data.currency === "string" ? data.currency : "INR",
    method,
    status,
    // Pending/refunded should not carry a paid date.
    paidAt: isSettled
      ? hasPaidDate
        ? new Date(data.paidAt as string)
        : status === "paid"
          ? new Date()
          : undefined
      : undefined,
    reference: typeof data.reference === "string" ? data.reference.trim() : "",
    notes: typeof data.notes === "string" ? data.notes.trim() : "",
    bookingId:
      typeof data.bookingId === "string" && data.bookingId
        ? data.bookingId
        : null,
  });

  return NextResponse.json({ payment }, { status: 201 });
}
