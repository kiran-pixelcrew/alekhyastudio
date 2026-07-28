import Link from "next/link";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { threeCrafts } from "@/data/site";

export function ServicesOverview() {
  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow={threeCrafts.eyebrow}
            title={threeCrafts.title}
            description={threeCrafts.intro}
          />
        </FadeIn>

        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {threeCrafts.cards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 60}>
              <li className="flex h-full flex-col border border-charcoal/10 bg-cream-soft p-8">
                <h3 className="font-display text-2xl text-charcoal md:text-3xl">
                  {card.title}
                </h3>
                <p className="mt-3 font-display text-lg text-terracotta">
                  {card.tagline}
                </p>
                <p className="mt-4 flex-1 text-charcoal-muted leading-relaxed">
                  {card.description}
                </p>
                <Link
                  href={card.cta.href}
                  className="mt-6 text-sm font-medium text-teal underline-offset-4 transition hover:text-terracotta hover:underline"
                >
                  {card.cta.label} →
                </Link>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
