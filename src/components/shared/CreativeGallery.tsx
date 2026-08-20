"use client";

import Image from "next/image";
import { useState } from "react";
import type { BentoAspect } from "@/lib/bentoGrid";
import { getCreativeFrameStyle } from "@/lib/bentoGrid";

export type CreativeImage = {
  id: string;
  src: string;
  alt: string;
  aspect?: BentoAspect;
  width?: number;
  height?: number;
};

export function CreativeGallery({
  images,
  title = "Selected creatives",
}: {
  images: CreativeImage[];
  title?: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-2xl text-charcoal md:text-3xl">
        {title}
      </h3>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => {
          const aspect = image.aspect ?? "portrait";
          const ratio =
            image.width && image.height && image.height > 0
              ? image.width / image.height
              : null;
          const isWide =
            aspect === "landscape" || (ratio !== null && ratio >= 1.2);
          const frameStyle = getCreativeFrameStyle({ ...image, aspect });

          return (
            <li
              key={image.id}
              className={isWide ? "sm:col-span-2 lg:col-span-4" : undefined}
            >
              <button
                type="button"
                className="img-zoom relative block w-full overflow-hidden border border-charcoal/10 bg-cream-deep text-left"
                style={frameStyle}
                onClick={() => setLightboxIndex(index)}
                aria-label={`View ${image.alt || "creative"} fullscreen`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  unoptimized={
                    image.src.startsWith("/images/") ||
                    image.src.includes("res.cloudinary.com")
                  }
                  className="object-contain object-center"
                  sizes={isWide ? "100vw" : "(max-width: 768px) 100vw, 25vw"}
                />
                <span className="pointer-events-none absolute inset-0 bg-charcoal/0 transition hover:bg-charcoal/10" />
              </button>
            </li>
          );
        })}
      </ul>

      {lightboxIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]?.src}
              alt={images[lightboxIndex]?.alt || "Creative"}
              className="max-h-[90vh] w-auto max-w-full object-contain"
            />
            <button
              type="button"
              className="absolute right-0 top-0 -translate-y-full rounded-md bg-cream px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-charcoal"
              onClick={() => setLightboxIndex(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
