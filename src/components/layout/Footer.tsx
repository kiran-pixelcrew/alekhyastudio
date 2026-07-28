import Image from "next/image";
import Link from "next/link";
import { photographyItems } from "@/data/photography";
import { footerLinks, site } from "@/data/site";
import { withBustedSrc } from "@/lib/publicAsset";

const feed = withBustedSrc(photographyItems.slice(0, 6));

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-cream/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(193,80,46,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(31,75,74,0.35),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="mb-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-terracotta-soft">
                Studio feed
              </p>
              <h2 className="mt-2 font-display text-3xl text-cream-soft">
                {site.tagline}
              </h2>
            </div>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cream/70 underline-offset-4 transition hover:text-cream hover:underline"
            >
              Instagram
            </a>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-3">
            {feed.map((item) => (
              <li key={item.id}>
                <Link
                  href="/work"
                  className="img-zoom group relative block aspect-square overflow-hidden"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover"
                    loading="lazy"
                    unoptimized={item.src.startsWith("/images/")}
                  />
                  <span className="absolute inset-0 bg-teal/0 transition group-hover:bg-teal/25" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-10 border-t border-cream/10 pt-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="font-display text-3xl text-cream-soft">
              Alekhya<span className="text-button">Studio</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/65">
              {site.mission} Based in {site.location}. Dance photography,
              invitation & poster design, and portfolio websites for performing
              artists.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="transition hover:text-cream"
                >
                  {site.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="transition hover:text-cream"
                >
                  {site.phone}
                </a>
              </p>
              <p>{site.location}</p>
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/50">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition hover:text-cream"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition hover:text-cream"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.displayName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cream"
            >
              Instagram
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-cream"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
