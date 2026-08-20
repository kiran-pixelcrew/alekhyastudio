import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  Payment,
} from "@/models/Payment";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  if (!isValidObjectId(id)) return jsonError("Invalid payment id.");

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
  const updates: Record<string, unknown> = {};

  if (typeof data.clientName === "string") {
    updates.clientName = data.clientName.trim();
  }
  if (typeof data.email === "string") {
    updates.email = data.email.trim().toLowerCase();
  }
  if (typeof data.amount === "number") updates.amount = data.amount;
  if (typeof data.currency === "string") updates.currency = data.currency;
  if (typeof data.reference === "string") {
    updates.reference = data.reference.trim();
  }
  if (typeof data.notes === "string") updates.notes = data.notes.trim();
  if (typeof data.paidAt === "string") {
    updates.paidAt = data.paidAt ? new Date(data.paidAt) : null;
  }
  if (
    typeof data.method === "string" &&
    (PAYMENT_METHODS as readonly string[]).includes(data.method)
  ) {
    updates.method = data.method;
  }
  if (
    typeof data.status === "string" &&
    (PAYMENT_STATUSES as readonly string[]).includes(data.status)
  ) {
    updates.status = data.status;
    if (data.status === "pending" && data.paidAt === undefined) {
      updates.paidAt = null;
    } else if (
      (data.status === "paid" || data.status === "partial") &&
      data.paidAt === undefined
    ) {
      const existing = await Payment.findById(id).select("paidAt").lean();
      if (!existing?.paidAt) {
        updates.paidAt = new Date();
      }
    }
  }
  if (typeof data.bookingId === "string") {
    updates.bookingId = data.bookingId || null;
  }

  const payment = await Payment.findByIdAndUpdate(id, updates, {
    new: true,
  }).lean();

  if (!payment) return jsonError("Payment not found.", 404);
  return NextResponse.json({ payment });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  if (!isValidObjectId(id)) return jsonError("Invalid payment id.");

  const payment = await Payment.findByIdAndDelete(id).lean();
  if (!payment) return jsonError("Payment not found.", 404);
  return NextResponse.json({ ok: true });
}
