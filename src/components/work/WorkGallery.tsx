"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  workCategories,
  type WorkCategory,
  type WorkItem,
} from "@/data/work";
import { Button } from "@/components/shared/Button";
import { ImageWatermark } from "@/components/shared/ImageWatermark";
import { getBentoImageClass, getFeaturedBentoClass } from "@/lib/bentoGrid";
import { GalleryLightbox } from "@/components/work/GalleryLightbox";

type WorkGalleryProps = {
  items: WorkItem[];
};

export function WorkGallery({ items }: WorkGalleryProps) {
  const [active, setActive] = useState<WorkCategory>("photography");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const useBento = active === "photography";
  const isInvitations = active === "invitations&creatives";

  const filtered = useMemo(
    () => items.filter((item) => item.category === active),
    [active, items],
  );

  const closeLightbox = () => setLightboxIndex(null);

  return (
    <div>
      <div
        className="mb-10 flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Filter work by category"
      >
        {workCategories.map((category) => {
          const selected = active === category.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={[
                "shrink-0 rounded-sm px-4 py-2 text-sm tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
                selected
                  ? "bg-button text-cream-soft"
                  : "bg-cream-deep text-charcoal-muted hover:text-charcoal",
              ].join(" ")}
              onClick={() => {
                setActive(category.id);
                setLightboxIndex(null);
              }}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <ul
        className={
          useBento
            ? "bento-grid"
            : isInvitations
              ? "grid grid-cols-1 justify-items-center"
              : "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {filtered.map((item, index) => {
          const isInvitation = item.category === "invitations&creatives";
          const canLightbox = !item.href;
          const spanClass = useBento
            ? getFeaturedBentoClass(index, filtered.length, item.aspect)
            : "";
          const imageClass = useBento
            ? getBentoImageClass(spanClass, item.aspect)
            : isInvitation
              ? "aspect-[32/15] bg-charcoal/5"
              : "aspect-[16/10]";

          return (
            <li
              key={item.id}
              className={[
                useBento ? "bento-item" : undefined,
                spanClass || undefined,
                isInvitation ? "w-full max-w-5xl" : undefined,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <article className="group h-full">
                {canLightbox ? (
                  <button
                    type="button"
                    className={[
                      "img-zoom relative block w-full overflow-hidden text-left",
                      useBento ? "h-full" : undefined,
                      imageClass,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`View ${item.title} fullscreen`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes={
                        isInvitation
                          ? "(max-width: 1024px) 100vw, 1024px"
                          : useBento
                            ? spanClass.includes("featured") ||
                              spanClass.includes("wide")
                              ? "(max-width: 1024px) 100vw, 50vw"
                              : "(max-width: 768px) 100vw, 25vw"
                            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      }
                      className={
                        isInvitation
                          ? "object-contain"
                          : "object-cover object-center"
                      }
                      loading="lazy"
                      unoptimized={item.src.startsWith("/images/")}
                    />
                    {!isInvitation ? <ImageWatermark /> : null}
                    <span className="pointer-events-none absolute inset-0 bg-charcoal/0 transition group-hover:bg-charcoal/15" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={[
                      "img-zoom relative block overflow-hidden",
                      useBento ? "h-full" : undefined,
                      imageClass,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={`Visit ${item.title} website`}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top"
                      loading="lazy"
                      unoptimized={item.src.startsWith("/images/")}
                    />
                    <ImageWatermark />
                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent pb-5 opacity-100 transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                      <span className="inline-flex items-center justify-center rounded-sm bg-button px-5 py-2.5 text-sm font-medium text-cream-soft">
                        Visit Website
                      </span>
                    </div>
                  </a>
                )}
              </article>
            </li>
          );
        })}
      </ul>

      {lightboxIndex !== null ? (
        <GalleryLightbox
          items={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onChange={setLightboxIndex}
        />
      ) : null}

      <div className="mt-14 text-center">
        <Button href="/contact" variant="primary" size="lg">
          Enquire about a project
        </Button>
      </div>
    </div>
  );
}
