"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Button } from "./Button";

export const contactServices = [
  "Photography",
  "Invitation / Poster",
  "Portfolio Website",
  "Not Sure Yet",
] as const;

export type ContactService = (typeof contactServices)[number];

const fieldClass =
  "w-full rounded-sm border border-charcoal/15 bg-cream-soft px-4 py-3 text-charcoal outline-none transition focus:border-terracotta focus:ring-2 focus:ring-terracotta/20";

type ContactFormProps = {
  defaultServices?: ContactService[];
};

export function ContactForm({ defaultServices = [] }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<ContactService[]>(
    defaultServices,
  );

  function toggleService(service: ContactService) {
    setSelectedServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim(),
          services: selectedServices,
          eventDate: String(formData.get("event-date") ?? "").trim() || undefined,
          about: String(formData.get("about") ?? "").trim(),
          instagram: String(formData.get("instagram") ?? "").trim() || undefined,
        }),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to send your message.");
      }

      setSubmitted(true);
      form.reset();
      setSelectedServices([]);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to send your message.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-sm border border-teal/20 bg-cream-soft p-8 text-center"
      >
        <p className="font-display text-2xl text-teal">Thank you</p>
        <p className="mt-2 text-charcoal-muted">
          Your message is on its way — we&apos;ll respond within 1–2 business
          days. For faster replies, message us on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error ? (
        <p
          role="alert"
          className="rounded-sm border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-charcoal"
        >
          {error}
        </p>
      ) : null}

      <Field label="Name" id="name" required>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className={fieldClass}
          placeholder="Your name"
        />
      </Field>

      <Field label="Email" id="email" required>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
          placeholder="you@example.com"
        />
      </Field>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-charcoal">
          What do you need? <span className="text-terracotta">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {contactServices.map((service) => (
            <label
              key={service}
              className="flex cursor-pointer items-center gap-3 rounded-sm border border-charcoal/15 bg-cream-soft px-4 py-3 text-sm text-charcoal transition has-[:checked]:border-terracotta has-[:checked]:bg-terracotta/5"
            >
              <input
                type="checkbox"
                name="services"
                value={service}
                checked={selectedServices.includes(service)}
                onChange={() => toggleService(service)}
                className="h-4 w-4 accent-terracotta"
              />
              {service}
            </label>
          ))}
        </div>
        {selectedServices.length === 0 ? (
          <p className="mt-1 text-xs text-charcoal/50">
            Select one or more — many clients need a bundle.
          </p>
        ) : null}
      </fieldset>

      <Field label="Event date" id="event-date">
        <input
          id="event-date"
          name="event-date"
          type="date"
          className={fieldClass}
        />
      </Field>

      <Field label="A little about your art" id="about" required>
        <textarea
          id="about"
          name="about"
          required
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder="Tell us about your art form, the show you're planning, or what you're hoping to build…"
        />
      </Field>

      <Field label="Instagram handle" id="instagram">
        <input
          id="instagram"
          name="instagram"
          className={fieldClass}
          placeholder="@yourhandle"
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full sm:w-auto"
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Send It Over"}
      </Button>
    </form>
  );
}

function Field({
  label,
  id,
  required,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-charcoal">
        {label}
        {required ? <span className="text-terracotta"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
