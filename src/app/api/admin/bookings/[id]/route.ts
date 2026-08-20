import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import { BOOKING_STATUSES, Booking } from "@/models/Booking";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  if (!isValidObjectId(id)) return jsonError("Invalid booking id.");

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
  if (typeof data.phone === "string") updates.phone = data.phone.trim();
  if (typeof data.service === "string") updates.service = data.service.trim();
  if (typeof data.location === "string") {
    updates.location = data.location.trim();
  }
  if (typeof data.notes === "string") updates.notes = data.notes.trim();
  if (typeof data.amountQuoted === "number") {
    updates.amountQuoted = data.amountQuoted;
  }
  if (typeof data.eventDate === "string") {
    updates.eventDate = data.eventDate ? new Date(data.eventDate) : null;
  }
  if (
    typeof data.status === "string" &&
    (BOOKING_STATUSES as readonly string[]).includes(data.status)
  ) {
    updates.status = data.status;
  }

  const booking = await Booking.findByIdAndUpdate(id, updates, {
    new: true,
  }).lean();

  if (!booking) return jsonError("Booking not found.", 404);
  return NextResponse.json({ booking });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  if (!isValidObjectId(id)) return jsonError("Invalid booking id.");

  const booking = await Booking.findByIdAndDelete(id).lean();
  if (!booking) return jsonError("Booking not found.", 404);
  return NextResponse.json({ ok: true });
}
