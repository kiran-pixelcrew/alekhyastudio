import Image from "next/image";
import Link from "next/link";
import { footerLinks, site } from "@/data/site";
import { workPhotographyItems } from "@/data/work";
import { withBustedSrc } from "@/lib/publicAsset";

const feed = withBustedSrc(workPhotographyItems.slice(0, 6));

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-cream/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(193,80,46,0.18),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(31,75,74,0.35),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-16">

        <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.7fr))] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={`${site.displayName} home`} className="inline-block">
              <Image
                src="/logo1.svg"
                alt="Alekhya Studio"
                width={224}
                height={32}
                className="h-8 w-auto md:h-9"
                unoptimized
              />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-cream/65">
              {site.mission} Based in {site.location}. Dance photography,
              invitation & poster design, and portfolio websites for performing
              artists.
            </p>
            <div className="mt-5 space-y-1.5 text-sm text-cream/75">
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

        <div className="mt-10 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/45 sm:flex-row sm:items-center sm:justify-between">
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
