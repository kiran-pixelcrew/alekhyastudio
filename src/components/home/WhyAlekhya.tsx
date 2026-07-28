import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { whyAlekhya } from "@/data/site";

export function WhyAlekhya() {
  return (
    <section className="border-y border-charcoal/8 bg-cream-deep/50 px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow={whyAlekhya.eyebrow}
            title={whyAlekhya.title}
            description={whyAlekhya.description}
          />
        </FadeIn>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {whyAlekhya.points.map((point, i) => (
            <FadeIn key={point.title} delay={i * 80}>
              <li className="border-l-2 border-terracotta/50 pl-5">
                <h3 className="font-display text-2xl text-charcoal">
                  {point.title}
                </h3>
                <p className="mt-3 text-charcoal-muted leading-relaxed">
                  {point.text}
                </p>
              </li>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
