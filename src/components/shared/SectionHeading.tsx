type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={[
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "",
      ].join(" ")}
    >
      {eyebrow ? (
        <p
          className={[
            "mb-3 text-xs font-medium uppercase tracking-[0.22em]",
            light ? "text-cream/70" : "text-terracotta",
          ].join(" ")}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={[
          "font-display text-4xl leading-tight md:text-5xl",
          light ? "text-cream-soft" : "text-charcoal",
        ].join(" ")}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={[
            "mt-4 text-sm leading-relaxed md:text-base",
            light ? "text-cream/75" : "text-charcoal-muted",
          ].join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
