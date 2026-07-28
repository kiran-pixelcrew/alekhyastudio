"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { WorkItem } from "@/data/work";

type GalleryLightboxProps = {
  items: WorkItem[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function GalleryLightbox({
  items,
  index,
  onClose,
  onChange,
}: GalleryLightboxProps) {
  const item = items[index];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        onChange((index - 1 + items.length) % items.length);
        return;
      }
      if (event.key === "ArrowRight") {
        onChange((index + 1) % items.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [index, items.length, onChange, onClose]);

  if (!item) return null;

  const hasMultiple = items.length > 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt || item.title}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 rounded-sm bg-cream/10 px-3 py-2 text-sm text-cream-soft transition hover:bg-cream/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream md:right-8 md:top-8"
        onClick={onClose}
        aria-label="Close gallery"
      >
        Close
      </button>

      {hasMultiple ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream-soft transition hover:bg-cream/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream md:left-6"
            onClick={(event) => {
              event.stopPropagation();
              onChange((index - 1 + items.length) % items.length);
            }}
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream-soft transition hover:bg-cream/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream md:right-6"
            onClick={(event) => {
              event.stopPropagation();
              onChange((index + 1) % items.length);
            }}
            aria-label="Next image"
          >
            →
          </button>
        </>
      ) : null}

      <div
        className="relative h-[80vh] w-full max-w-6xl md:h-[85vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          key={item.id}
          src={item.src}
          alt={item.alt}
          fill
          sizes="100vw"
          className="object-contain"
          unoptimized={item.src.startsWith("/images/")}
          priority
        />
      </div>
    </div>
  );
}
