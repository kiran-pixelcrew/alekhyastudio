"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  workCategories,
  type WorkCategory,
  type WorkItem,
} from "@/data/work";
import { Button } from "@/components/shared/Button";

type WorkGalleryProps = {
  items: WorkItem[];
};

export function WorkGallery({ items }: WorkGalleryProps) {
  const [active, setActive] = useState<WorkCategory>("all");

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
                  ? "bg-terracotta text-cream-soft"
                  : "bg-cream-deep text-charcoal-muted hover:text-charcoal",
              ].join(" ")}
              onClick={() => setActive(category.id)}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <ul
        className={[
          "grid gap-4",
          filtered.length === 1
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2",
        ].join(" ")}
      >
        {filtered.map((item) => {
          const isInvitation = item.category === "invitations";

          return (
            <li
              key={item.id}
              className={
                isInvitation ? "col-span-full mx-auto w-full max-w-5xl" : undefined
              }
            >
              <article className={isInvitation ? "text-center" : undefined}>
                <div
                  className={[
                    "img-zoom relative overflow-hidden",
                    isInvitation
                      ? "aspect-[32/15] bg-charcoal/5"
                      : item.aspect === "landscape"
                        ? "aspect-[4/3]"
                        : item.aspect === "square"
                          ? "aspect-square"
                          : "aspect-[3/4]",
                  ].join(" ")}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes={
                      isInvitation
                        ? "(max-width: 1024px) 100vw, 1024px"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    }
                    className={
                      isInvitation
                        ? "object-contain"
                        : "object-cover object-top"
                    }
                    loading="lazy"
                    unoptimized={item.src.startsWith("/images/")}
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-display text-xl text-charcoal">{item.title}</h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-charcoal-muted">
                    {workCategories.find((c) => c.id === item.category)?.label}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <div className="mt-14 text-center">
        <Button href="/contact" variant="primary" size="lg">
          Enquire about a project
        </Button>
      </div>
    </div>
  );
}
