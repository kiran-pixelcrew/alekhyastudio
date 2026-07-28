"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ContactForm, type ContactService } from "./ContactForm";

const serviceMap: Record<string, ContactService> = {
  photo: "Photography",
  video: "Videography",
  invite: "Invitation / Poster",
  web: "Portfolio Website",
  social: "Social Media",
};

function FormInner() {
  const params = useSearchParams();
  const key = params.get("service");
  const defaultServices =
    key && key in serviceMap ? [serviceMap[key]] : undefined;

  return <ContactForm defaultServices={defaultServices} />;
}

export function ContactFormWithParams() {
  return (
    <Suspense fallback={<ContactForm />}>
      <FormInner />
    </Suspense>
  );
}
