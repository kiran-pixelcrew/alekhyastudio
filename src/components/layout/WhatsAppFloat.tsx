import { site } from "@/data/site";

export function WhatsAppFloat() {
  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="theme-teal-float fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-sm bg-teal px-4 py-3 text-sm font-medium text-cream-soft transition hover:bg-teal-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta md:bottom-8 md:right-8"
      aria-label="Chat on WhatsApp"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-4 w-4 fill-current"
      >
        <path d="M20.5 3.5A11 11 0 0 0 2.1 17.3L1 23l5.9-1.5A11 11 0 0 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-3.5.9.9-3.4-.2-.3a9 9 0 1 1 7.7 4.3Zm5-6.7c-.3-.1-1.6-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.1-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c.5.2 1 .5 1.5.6a3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
      </svg>
      WhatsApp
    </a>
  );
}
