"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  photoCategories,
  type PhotoCategory,
  type PhotoItem,
} from "@/data/photography";
import { Button } from "@/components/shared/Button";
import { site } from "@/data/site";
import { getBentoImageClass, getBentoItemClass } from "@/lib/bentoGrid";

type FilterableGalleryProps = {
  items: PhotoItem[];
};

export function FilterableGallery({ items }: FilterableGalleryProps) {
  const [active, setActive] = useState<PhotoCategory>("all");

  const filtered = useMemo(
    () =>
      active === "all"
        ? items
        : items.filter((item) => item.category === active),
    [active, items],
  );

  return (
    <div>
      <div
        className="mb-10 flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="Filter gallery by category"
      >
        {photoCategories.map((category) => {
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
              onClick={() => setActive(category.id)}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <ul className="bento-grid">
        {filtered.map((item, index) => {
          const spanClass = getBentoItemClass({
            aspect: item.aspect,
            index,
            total: filtered.length,
          });
          const imageClass = getBentoImageClass(spanClass, item.aspect);

          return (
            <li key={item.id} className={["bento-item", spanClass].join(" ")}>
              <article className="flex h-full flex-col">
                <div
                  className={[
                    "img-zoom relative overflow-hidden",
                    imageClass,
                  ].join(" ")}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={
                      spanClass.includes("featured") || spanClass.includes("wide")
                        ? "(max-width: 1024px) 100vw, 50vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    }
                    className="object-cover object-top"
                    loading="lazy"
                    unoptimized={item.src.startsWith("/images/")}
                  />
                </div>
                <div className="mt-3 shrink-0">
                  <h3 className="font-display text-xl text-charcoal">{item.title}</h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-charcoal-muted">
                    {photoCategories.find((c) => c.id === item.category)?.label}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <div className="mt-14 flex flex-wrap justify-center gap-3">
        <Button href="/contact?service=photo" variant="primary" size="lg">
          Book a Shoot
        </Button>
        <Button href={site.whatsapp} external variant="ghost" size="lg">
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
