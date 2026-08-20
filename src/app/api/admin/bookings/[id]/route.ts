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
  const $set: Record<string, unknown> = {};
  const $unset: Record<string, 1> = {};

  if (typeof data.clientName === "string") {
    const clientName = data.clientName.trim();
    if (!clientName) return jsonError("Client name is required.");
    $set.clientName = clientName;
  }
  if (typeof data.email === "string") {
    const email = data.email.trim().toLowerCase();
    if (!email) return jsonError("Email is required.");
    $set.email = email;
  }
  if (typeof data.phone === "string") $set.phone = data.phone.trim();
  if (typeof data.service === "string") {
    const service = data.service.trim();
    if (!service) return jsonError("Service is required.");
    $set.service = service;
  }
  if (typeof data.location === "string") {
    $set.location = data.location.trim();
  }
  if (typeof data.notes === "string") $set.notes = data.notes.trim();
  if (typeof data.amountQuoted === "number" && Number.isFinite(data.amountQuoted)) {
    $set.amountQuoted = data.amountQuoted;
  } else if (data.amountQuoted === null) {
    $unset.amountQuoted = 1;
  }
  if (typeof data.eventDate === "string") {
    if (data.eventDate) {
      $set.eventDate = new Date(data.eventDate);
    } else {
      $unset.eventDate = 1;
    }
  }
  if (
    typeof data.status === "string" &&
    (BOOKING_STATUSES as readonly string[]).includes(data.status)
  ) {
    $set.status = data.status;
  }

  if (Object.keys($set).length === 0 && Object.keys($unset).length === 0) {
    return jsonError("No valid fields to update.");
  }

  const update: Record<string, unknown> = {};
  if (Object.keys($set).length > 0) update.$set = $set;
  if (Object.keys($unset).length > 0) update.$unset = $unset;

  const booking = await Booking.findByIdAndUpdate(id, update, {
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
