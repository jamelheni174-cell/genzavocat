"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";
import type { Dictionary, Locale } from "@/lib/i18n";
import { path, routes } from "@/lib/i18n";
import { IconArrow, IconMail, IconPhone, IconPin } from "./Icons";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname() || `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const other: Locale = locale === "fr" ? "ar" : "fr";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const switchHref = (() => {
    const segments = pathname.split("/");
    segments[1] = other;
    return segments.join("/") || `/${other}`;
  })();

  const links = [
    { href: path(locale, routes.home), label: dict.nav.home },
    { href: path(locale, routes.about), label: dict.nav.about },
    {
      label: dict.nav.services,
      children: [
        { href: path(locale, routes.servicesCompanies), label: dict.nav.servicesCompanies },
        { href: path(locale, routes.servicesIndividuals), label: dict.nav.servicesIndividuals },
      ],
    },
    { href: path(locale, routes.fees), label: dict.nav.fees },
    { href: path(locale, routes.blog), label: dict.nav.blog },
    { href: path(locale, routes.contact), label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    href === path(locale, routes.home) ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden bg-ink-950 text-cream-100/80 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2 text-[13px]">
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition hover:text-gold-400"
          >
            <IconPin className="h-4 w-4 text-gold-500" />
            <span>{locale === "ar" ? siteConfig.addressAr : siteConfig.addressFr}</span>
          </a>
          <div className="flex items-center gap-6">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 transition hover:text-gold-400">
              <IconMail className="h-4 w-4 text-gold-500" />
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 transition hover:text-gold-400"
              dir="ltr"
            >
              <IconPhone className="h-4 w-4 text-gold-500" />
              {siteConfig.phone}
            </a>
            <Link
              href={switchHref}
              className="rounded-full border border-cream-100/25 px-3 py-1 font-medium text-cream-50 transition hover:border-gold-500 hover:text-gold-400"
            >
              {dict.switchTo}
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-cream-200 bg-cream-50/95 backdrop-blur-md shadow-sm"
            : "border-transparent bg-cream-50"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-6">
          <Link href={path(locale, routes.home)} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-ink-900 font-display text-lg font-semibold text-gold-500">
              AL
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[17px] font-semibold text-ink-900 sm:text-lg">
                {dict.lawyerName}
              </span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-600/80">
                {dict.lawyerTitle}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setServicesOpen((v) => !v)}
                    className="flex items-center gap-1 rounded px-3 py-2 text-[15px] font-medium text-ink-800 transition hover:text-gold-600"
                  >
                    {link.label}
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={`absolute top-full z-50 w-64 overflow-hidden rounded-md border border-cream-200 bg-white shadow-xl transition-all ${
                      servicesOpen ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"
                    } ltr:left-0 rtl:right-0`}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block border-b border-cream-100 px-4 py-3 text-sm text-ink-800 transition last:border-0 hover:bg-cream-50 hover:text-gold-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={`rounded px-3 py-2 text-[15px] font-medium transition hover:text-gold-600 ${
                    isActive(link.href!) ? "text-gold-600" : "text-ink-800"
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={path(locale, routes.payment)}
              className="hidden items-center gap-2 rounded-sm bg-gold-500 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-gold-400 sm:flex"
            >
              {dict.nav.payOnline}
              <IconArrow className="flip-rtl h-4 w-4" />
            </Link>
            <Link
              href={switchHref}
              className="rounded-sm border border-ink-900/15 px-3 py-2.5 text-sm font-semibold text-ink-900 transition hover:border-gold-500 hover:text-gold-600 lg:hidden"
            >
              {dict.switchToShort}
            </Link>
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-sm border border-ink-900/15 text-ink-900 lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto bg-cream-50 transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="mx-auto flex max-w-xl flex-col gap-1 px-5 py-6">
          {links.map((link) =>
            link.children ? (
              <div key={link.label} className="py-2">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-ink-600/70">
                  {link.label}
                </p>
                {link.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block rounded px-2 py-3 text-lg text-ink-800 hover:text-gold-600"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className="block rounded px-2 py-3 text-lg font-medium text-ink-900 hover:text-gold-600"
              >
                {link.label}
              </Link>
            ),
          )}
          <Link
            href={path(locale, routes.appointment)}
            className="mt-3 rounded-sm border border-ink-900 px-5 py-4 text-center font-semibold text-ink-900"
          >
            {dict.common.bookNow}
          </Link>
          <Link
            href={path(locale, routes.payment)}
            className="mt-2 rounded-sm bg-gold-500 px-5 py-4 text-center font-semibold text-ink-950"
          >
            {dict.nav.payOnline}
          </Link>
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="mt-4 flex items-center justify-center gap-2 text-ink-700"
            dir="ltr"
          >
            <IconPhone className="h-4 w-4 text-gold-600" />
            {siteConfig.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
