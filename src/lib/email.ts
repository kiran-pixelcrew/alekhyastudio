import nodemailer from "nodemailer";
import { site } from "@/data/site";

export type ContactEmailPayload = {
  name: string;
  email: string;
  services: string[];
  eventDate?: string;
  about: string;
  instagram?: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP credentials are not configured.");
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
}

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

export async function sendContactEmail(payload: ContactEmailPayload) {
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  if (!from) {
    throw new Error("SMTP sender address is not configured.");
  }

  const transporter = nodemailer.createTransport(getSmtpConfig());
  const { text, html } = formatContactEmail(payload);

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `New inquiry from ${payload.name} · ${site.displayName}`,
    text,
    html,
  });
}
