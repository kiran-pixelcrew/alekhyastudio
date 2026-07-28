import { FadeIn } from "@/components/shared/FadeIn";
import { Button } from "@/components/shared/Button";
import { pricingTiers, techStack, webProcess } from "@/data/web";

export function ProcessSteps() {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {webProcess.map((item, i) => (
        <li key={item.step} className="list-none">
          <FadeIn delay={i * 60}>
            <p className="font-display text-4xl text-terracotta">{item.step}</p>
            <h3 className="mt-2 font-display text-2xl text-charcoal">
              {item.title}
            </h3>
            <p className="mt-2 text-charcoal-muted">{item.description}</p>
          </FadeIn>
        </li>
      ))}
    </ol>
  );
}

export function TechStack() {
  return (
    <ul className="flex flex-wrap gap-2">
      {techStack.map((tech) => (
        <li
          key={tech}
          className="rounded-sm border border-charcoal/10 bg-cream-soft px-3 py-1.5 text-sm text-charcoal-muted"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

export function PricingTiers() {
  return (
    <div id="pricing" className="scroll-mt-28 grid gap-6 lg:grid-cols-3">
      {pricingTiers.map((tier, i) => (
        <FadeIn key={tier.id} delay={i * 80}>
          <article
            className={[
              "flex h-full flex-col border p-7",
              tier.highlighted
                ? "theme-gold-card-shadow border-terracotta bg-cream-soft"
                : "border-charcoal/10 bg-cream",
            ].join(" ")}
          >
            {tier.highlighted ? (
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-terracotta">
                Most chosen
              </p>
            ) : (
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-transparent">
                —
              </p>
            )}
            <h3 className="font-display text-3xl text-charcoal">{tier.name}</h3>
            <p className="mt-2 text-lg text-teal">{tier.price}</p>
            <p className="mt-3 text-sm text-charcoal-muted">{tier.description}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm text-charcoal">
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button
                href="/contact?service=web"
                variant={tier.highlighted ? "primary" : "ghost"}
                className="w-full"
              >
                {tier.cta}
              </Button>
            </div>
          </article>
        </FadeIn>
      ))}
    </div>
  );
}
