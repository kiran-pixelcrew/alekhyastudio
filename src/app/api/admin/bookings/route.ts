import { NextResponse } from "next/server";
import { jsonError, requireAdmin } from "@/lib/admin-api";
import { BOOKING_STATUSES, Booking } from "@/models/Booking";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const filter =
    status && (BOOKING_STATUSES as readonly string[]).includes(status)
      ? { status }
      : {};

  const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ bookings });
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
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const service = typeof data.service === "string" ? data.service.trim() : "";

  if (!clientName || !email || !service) {
    return jsonError("Client name, email, and service are required.");
  }

  const status =
    typeof data.status === "string" &&
    (BOOKING_STATUSES as readonly string[]).includes(data.status)
      ? data.status
      : "inquiry";

  const booking = await Booking.create({
    clientName,
    email,
    phone: typeof data.phone === "string" ? data.phone.trim() : "",
    service,
    eventDate:
      typeof data.eventDate === "string" && data.eventDate
        ? new Date(data.eventDate)
        : undefined,
    location: typeof data.location === "string" ? data.location.trim() : "",
    status,
    notes: typeof data.notes === "string" ? data.notes.trim() : "",
    amountQuoted:
      typeof data.amountQuoted === "number" ? data.amountQuoted : undefined,
    source: "manual",
  });

  return NextResponse.json({ booking }, { status: 201 });
}
