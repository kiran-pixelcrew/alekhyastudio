import { NextResponse } from "next/server";
import { contactServices } from "@/components/shared/ContactForm";
import { sendContactEmail } from "@/lib/email";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const about = typeof data.about === "string" ? data.about.trim() : "";
  const eventDate =
    typeof data.eventDate === "string" ? data.eventDate.trim() : undefined;
  const instagram =
    typeof data.instagram === "string" ? data.instagram.trim() : undefined;
  const services = Array.isArray(data.services)
    ? data.services.filter(
        (service): service is (typeof contactServices)[number] =>
          typeof service === "string" &&
          (contactServices as readonly string[]).includes(service),
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

  try {
    await sendContactEmail({
      name,
      email,
      services,
      eventDate,
      about,
      instagram,
    });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try WhatsApp." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
