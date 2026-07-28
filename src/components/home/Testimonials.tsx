import { FadeIn } from "@/components/shared/FadeIn";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { testimonials } from "@/data/about";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[linear-gradient(160deg,#ebe0d0_0%,#f5ede1_45%,#e8d9c4_100%)] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="relative mx-auto max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Testimonials"
            title="What artists say"
            align="center"
          />
        </FadeIn>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <FadeIn key={item.id} delay={i * 70}>
              <blockquote className="h-full border-l-2 border-terracotta/60 pl-6">
                <p className="font-display text-xl leading-relaxed text-charcoal md:text-2xl">
                  “{item.quote}”
                </p>
                <footer className="mt-5 text-sm">
                  <cite className="not-italic font-medium text-charcoal">
                    {item.name}
                  </cite>
                  <span className="text-charcoal-muted">
                    {" "}
                    · {item.role} · {item.service}
                  </span>
                </footer>
              </blockquote>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
