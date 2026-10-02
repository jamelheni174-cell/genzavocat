import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Button, PageHero, SectionHeading } from "@/components/ui";
import { IconArrow, IconCheck } from "@/components/Icons";
import type { Dictionary, Locale } from "@/lib/i18n";
import { path, routes } from "@/lib/i18n";

export default function ServiceList({
  locale,
  dict,
  kind,
}: {
  locale: Locale;
  dict: Dictionary;
  kind: "companies" | "individuals";
}) {
  const items = kind === "companies" ? dict.services.companies : dict.services.individuals;
  const title = kind === "companies" ? dict.services.companiesTitle : dict.services.individualsTitle;
  const intro = kind === "companies" ? dict.services.companiesIntro : dict.services.individualsIntro;
  const otherHref =
    kind === "companies" ? path(locale, routes.servicesIndividuals) : path(locale, routes.servicesCompanies);
  const otherLabel = kind === "companies" ? dict.nav.servicesIndividuals : dict.nav.servicesCompanies;

  return (
    <>
      <PageHero kicker={dict.services.kicker} title={title} text={intro} />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <article className="group flex h-full flex-col rounded-md border border-cream-200 bg-white p-7 transition hover:-translate-y-1 hover:border-gold-500 hover:shadow-xl">
                  <span className="grid h-11 w-11 place-items-center rounded-sm bg-cream-100 font-display text-base font-semibold text-gold-600 transition group-hover:bg-gold-500 group-hover:text-ink-950">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-5 font-display text-xl font-semibold text-ink-900">{item.title}</h2>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-800/75">{item.text}</p>
                  <a
                    href={path(locale, routes.contact)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-600"
                  >
                    {dict.common.readMore}
                    <IconArrow className="flip-rtl h-4 w-4" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-ink-900 py-20">
        <Image src="/images/office.jpg" alt="" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
          <div>
            <SectionHeading kicker={dict.home.ctaTitle} title={dict.home.ctaText} light />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {dict.fees.guarantees.map((g) => (
              <li key={g} className="flex gap-3 text-sm text-cream-100/80">
                <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                {g}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4 lg:col-span-2">
            <Button href={path(locale, routes.payment)}>{dict.nav.payOnline}</Button>
            <Button href={path(locale, routes.appointment)} variant="ghost">
              {dict.common.bookNow}
            </Button>
            <Button href={otherHref} variant="ghost">
              {otherLabel}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
