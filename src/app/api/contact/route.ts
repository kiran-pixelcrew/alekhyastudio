import { NextResponse } from "next/server";
import { contactServices } from "@/data/contact";
import { sendContactEmail } from "@/lib/email";
import { connectDb } from "@/lib/db";
import { EmailLog } from "@/models/EmailLog";
import { Booking } from "@/models/Booking";
import { site } from "@/data/site";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;
    const name = typeof data.name === "string" ? data.name.trim() : "";
    const email = typeof data.email === "string" ? data.email.trim() : "";
    const about = typeof data.about === "string" ? data.about.trim() : "";
    const eventDate =
      typeof data.eventDate === "string" ? data.eventDate.trim() : undefined;
    const instagram =
      typeof data.instagram === "string" ? data.instagram.trim() : undefined;
    const allowedServices = contactServices as readonly string[];
    const services = Array.isArray(data.services)
      ? data.services.filter(
          (service): service is (typeof contactServices)[number] =>
            typeof service === "string" && allowedServices.includes(service),
        )
      : [];

    if (!name || !email || !about) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const payload = {
      name,
      email,
      services,
      eventDate,
      about,
      instagram,
    };

    const to = process.env.CONTACT_TO_EMAIL ?? site.email;
    const subject = `New inquiry from ${name} · ${site.displayName}`;
    let sendError: unknown = null;
    let bookingId: string | null = null;

    try {
      await sendContactEmail(payload);
    } catch (error) {
      sendError = error;
      console.error("Failed to send contact email:", error);
    }

    try {
      await connectDb();

      if (!sendError) {
        const booking = await Booking.create({
          clientName: name,
          email,
          service:
            services.length > 0 ? services.join(", ") : "General inquiry",
          eventDate: eventDate ? new Date(eventDate) : undefined,
          notes: [about, instagram ? `Instagram: ${instagram}` : ""]
            .filter(Boolean)
            .join("\n\n"),
          status: "inquiry",
          source: "contact",
        });
        bookingId = String(booking._id);
      }

      await EmailLog.create({
        type: "contact",
        fromEmail: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "",
        toEmail: to,
        replyTo: email,
        subject,
        preview: about.slice(0, 240),
        status: sendError ? "failed" : "sent",
        errorMessage: sendError
          ? sendError instanceof Error
            ? sendError.message
            : "Send failed"
          : "",
        payload,
        bookingId,
      });
    } catch (dbError) {
      console.error("Failed to persist contact submission:", dbError);
    }

    if (sendError) {
      return NextResponse.json(
        {
          error:
            "Unable to send your message right now. Please try WhatsApp.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected contact form failure:", error);
    return NextResponse.json(
      {
        error: "Unable to send your message right now. Please try WhatsApp.",
      },
      { status: 500 },
    );
  }
}
