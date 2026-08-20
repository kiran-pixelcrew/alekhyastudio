import { Resend } from "resend";
import { site } from "@/data/site";

export type ContactEmailPayload = {
  name: string;
  email: string;
  services: string[];
  eventDate?: string;
  about: string;
  instagram?: string;
};

function formatContactEmail(payload: ContactEmailPayload) {
  const services =
    payload.services.length > 0 ? payload.services.join(", ") : "Not specified";
  const eventDate = payload.eventDate || "Not provided";
  const instagram = payload.instagram || "Not provided";

  const text = [
    "New contact form submission",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Services: ${services}`,
    `Event date: ${eventDate}`,
    `Instagram: ${instagram}`,
    "",
    "Message:",
    payload.about,
  ].join("\n");

  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Services:</strong> ${escapeHtml(services)}</p>
    <p><strong>Event date:</strong> ${escapeHtml(eventDate)}</p>
    <p><strong>Instagram:</strong> ${escapeHtml(instagram)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(payload.about).replace(/\n/g, "<br />")}</p>
  `;

  return { text, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  return new Resend(apiKey);
}

export function getContactFromAddress() {
  return (
    process.env.RESEND_FROM ??
    `Alekhya Studio <onboarding@resend.dev>`
  );
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = getContactFromAddress();
  const resend = getResendClient();
  const { text, html } = formatContactEmail(payload);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: payload.email,
    subject: `New inquiry from ${payload.name} · ${site.displayName}`,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send email.");
  }
}
