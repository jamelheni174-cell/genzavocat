import Link from "next/link";
import { siteConfig } from "@/content/site";
import type { Dictionary, Locale } from "@/lib/i18n";
import { path, routes } from "@/lib/i18n";
import { IconClock, IconMail, IconPhone, IconPin } from "./Icons";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const nav = [
    { href: path(locale, routes.home), label: dict.nav.home },
    { href: path(locale, routes.about), label: dict.nav.about },
    { href: path(locale, routes.fees), label: dict.nav.fees },
    { href: path(locale, routes.appointment), label: dict.nav.appointment },
    { href: path(locale, routes.blog), label: dict.nav.blog },
    { href: path(locale, routes.contact), label: dict.nav.contact },
  ];

  return (
    <footer className="bg-ink-950 text-cream-100/75">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-sm bg-gold-500 font-display text-lg font-bold text-ink-950">
              AL
            </span>
            <span className="font-display text-xl font-semibold text-cream-50">{dict.firmName}</span>
          </div>
          <p className="mt-5 text-sm leading-relaxed">{dict.footer.about}</p>
          <div className="mt-6 flex gap-3">
            {[
              ["Facebook", siteConfig.social.facebook],
              ["LinkedIn", siteConfig.social.linkedin],
              ["Instagram", siteConfig.social.instagram],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-cream-100/20 text-[11px] font-semibold uppercase transition hover:border-gold-500 hover:text-gold-400"
              >
                {label.slice(0, 2)}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-cream-50">{dict.footer.quickLinks}</h3>
          <span className="mt-3 block h-px w-12 bg-gold-500" />
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-gold-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-cream-50">{dict.footer.servicesLinks}</h3>
          <span className="mt-3 block h-px w-12 bg-gold-500" />
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href={path(locale, routes.servicesCompanies)} className="transition hover:text-gold-400">
                {dict.nav.servicesCompanies}
              </Link>
            </li>
            <li>
              <Link href={path(locale, routes.servicesIndividuals)} className="transition hover:text-gold-400">
                {dict.nav.servicesIndividuals}
              </Link>
            </li>
            {dict.services.companies.slice(0, 4).map((s) => (
              <li key={s.title}>
                <Link href={path(locale, routes.servicesCompanies)} className="transition hover:text-gold-400">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold text-cream-50">{dict.footer.contactTitle}</h3>
          <span className="mt-3 block h-px w-12 bg-gold-500" />
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
              <a href={siteConfig.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-gold-400">
                {locale === "ar" ? siteConfig.addressAr : siteConfig.addressFr}
              </a>
            </li>
            <li className="flex gap-3">
              <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
              <span dir="ltr">
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-gold-400">
                  {siteConfig.phone}
                </a>
                {" · "}
                <a href={`tel:${siteConfig.mobile.replace(/\s/g, "")}`} className="hover:text-gold-400">
                  {siteConfig.mobile}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <IconMail className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-gold-400">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-3">
              <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
              <span>{dict.common.workingHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-100/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-xs leading-relaxed text-cream-100/55">
          <p>{dict.footer.disclaimer}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {dict.firmName}. {dict.footer.rights}
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href={path(locale, routes.legal)} className="hover:text-gold-400">
                {dict.footer.legal}
              </Link>
              <Link href={path(locale, routes.privacy)} className="hover:text-gold-400">
                {dict.footer.privacy}
              </Link>
              <Link href={path(locale, routes.terms)} className="hover:text-gold-400">
                {dict.footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
