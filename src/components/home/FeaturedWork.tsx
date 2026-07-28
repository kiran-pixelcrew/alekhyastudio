import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";
import { featuredWork } from "@/data/work";
import { getBentoImageClass, getFeaturedBentoClass } from "@/lib/bentoGrid";
import { withBustedSrc } from "@/lib/publicAsset";
import { ImageWatermark } from "@/components/shared/ImageWatermark";

export function FeaturedWork() {
  const items = withBustedSrc(featuredWork);

  if (items.length === 0) return null;

  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Featured work"
              title="One eye, three outputs"
              description="Photography, poster design, and portfolio websites — shown together, because that's how we work."
            />
            <Button href="/work" variant="ghost" className="shrink-0 self-start">
              See the Full Portfolio
            </Button>
          </div>
        </FadeIn>

        <div className="bento-grid">
          {items.map((item, index) => {
            const spanClass = getFeaturedBentoClass(index, items.length, item.aspect);
            const imageClass = getBentoImageClass(spanClass, item.aspect);

            return (
              <FadeIn
                key={item.id}
                delay={index * 50}
                className={["bento-item", spanClass].join(" ")}
              >
                <Link
                  href="/work"
                  className={[
                    "img-zoom group relative block h-full overflow-hidden",
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
                        : "(max-width: 768px) 100vw, 25vw"
                    }
                    className="object-cover object-center"
                    loading="lazy"
                    unoptimized={item.src.startsWith("/images/")}
                  />
                  <ImageWatermark />
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
