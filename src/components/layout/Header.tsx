"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navLinks, serviceNavLinks, site } from "@/data/site";
import { Button } from "@/components/shared/Button";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";
  const solid = !isHome || scrolled || open;

  const isServiceActive = serviceNavLinks.some(
    (link) =>
      pathname === link.href || pathname.startsWith(`${link.href}/`),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = (active: boolean) =>
    [
      "text-sm tracking-wide transition-colors hover:text-terracotta",
      solid ? "text-charcoal-muted" : "text-cream/85",
      active ? (solid ? "text-terracotta" : "text-cream") : "",
    ].join(" ");

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "bg-cream/95 shadow-[0_1px_0_rgba(43,38,32,0.08)] backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link
          href="/"
          className={[
            "font-display text-2xl tracking-tight transition-colors md:text-[1.7rem]",
            solid ? "text-charcoal" : "text-cream-soft",
          ].join(" ")}
          aria-label={`${site.displayName} home`}
        >
          Alekhya<span className="text-terracotta">Studio</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          <div ref={servicesRef} className="relative">
            <button
              type="button"
              className={[
                linkClass(isServiceActive),
                "inline-flex items-center gap-1",
              ].join(" ")}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((value) => !value)}
            >
              Services
              <span aria-hidden className="text-[0.65rem]">
                ▾
              </span>
            </button>
            {servicesOpen ? (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-[220px] border border-charcoal/10 bg-cream py-2 shadow-lg">
                {serviceNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-charcoal-muted transition hover:bg-cream-deep hover:text-terracotta"
                    onClick={() => setServicesOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(
                pathname === link.href ||
                  pathname.startsWith(`${link.href}/`),
              )}
            >
              {link.label}
            </Link>
          ))}
          <Button
            href="/contact"
            variant={solid ? "primary" : "secondary"}
            size="sm"
          >
            Start a Project
          </Button>
        </nav>

        <button
          type="button"
          className={[
            "inline-flex h-10 w-10 items-center justify-center rounded-sm lg:hidden",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
            solid ? "text-charcoal" : "text-cream-soft",
          ].join(" ")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          <span aria-hidden className="flex w-5 flex-col gap-1.5">
            <span
              className={[
                "h-px w-full bg-current transition",
                open ? "translate-y-[3.5px] rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-px w-full bg-current transition",
                open ? "opacity-0" : "",
              ].join(" ")}
            />
            <span
              className={[
                "h-px w-full bg-current transition",
                open ? "-translate-y-[3.5px] -rotate-45" : "",
              ].join(" ")}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={[
          "border-t border-charcoal/10 bg-cream lg:hidden",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        <nav
          className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-6"
          aria-label="Mobile"
        >
          <button
            type="button"
            className="flex items-center justify-between rounded-sm px-3 py-3 text-lg text-charcoal transition hover:bg-cream-deep hover:text-terracotta"
            aria-expanded={mobileServicesOpen}
            onClick={() => setMobileServicesOpen((value) => !value)}
          >
            Services
            <span aria-hidden className="text-sm">
              {mobileServicesOpen ? "▴" : "▾"}
            </span>
          </button>
          {mobileServicesOpen ? (
            <div className="ml-4 flex flex-col gap-1 border-l border-charcoal/10 pl-4">
              {serviceNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-sm px-3 py-2 text-base text-charcoal-muted transition hover:bg-cream-deep hover:text-terracotta"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-sm px-3 py-3 text-lg text-charcoal transition hover:bg-cream-deep hover:text-terracotta"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 px-3">
            <Button href="/contact" variant="primary" className="w-full">
              Start a Project
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
