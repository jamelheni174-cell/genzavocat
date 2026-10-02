import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Accordion from "@/components/Accordion";
import { Button, PageHero, SectionHeading } from "@/components/ui";
import { IconCard, IconCheck, IconShield } from "@/components/Icons";
import { siteConfig } from "@/content/site";
import { getDictionary, isLocale, path, routes, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.fees.title, description: dict.fees.subtitle };
}

export default async function FeesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero kicker={dict.fees.kicker} title={dict.fees.title} text={dict.fees.subtitle} />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {dict.packages.map((pack, i) => (
              <Reveal key={pack.id} delay={i * 70}>
                <div
                  className={`flex h-full flex-col rounded-md border p-7 transition ${
                    pack.popular
                      ? "border-gold-500 bg-ink-900 text-cream-50 shadow-xl"
                      : "border-cream-200 bg-white hover:border-gold-500 hover:shadow-lg"
                  }`}
                >
                  {pack.popular ? (
                    <span className="mb-4 inline-block w-fit rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">
                      {dict.fees.popular}
                    </span>
                  ) : null}
                  <h2 className={`font-display text-lg font-semibold ${pack.popular ? "text-cream-50" : "text-ink-900"}`}>
                    {pack.name}
                  </h2>
                  <p className={`mt-2 text-xs uppercase tracking-wider ${pack.popular ? "text-cream-100/60" : "text-ink-700/60"}`}>
                    {pack.duration}
                  </p>
                  <p className="mt-5 font-display text-4xl font-semibold text-gold-500">
                    {pack.price}
                    <span className="ms-1 text-base font-normal">{siteConfig.currency}</span>
                  </p>
                  <p className={`mt-3 text-sm leading-relaxed ${pack.popular ? "text-cream-100/70" : "text-ink-800/70"}`}>
                    {pack.description}
                  </p>
                  <ul className={`mt-6 flex-1 space-y-3 text-sm ${pack.popular ? "text-cream-100/75" : "text-ink-800/80"}`}>
                    {pack.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`${path(locale, routes.payment)}?package=${pack.id}`}
                    className={`mt-7 rounded-sm px-5 py-3 text-center text-sm font-semibold transition ${
                      pack.popular
                        ? "bg-gold-500 text-ink-950 hover:bg-gold-400"
                        : "border border-ink-900/20 text-ink-900 hover:border-gold-500 hover:text-gold-600"
                    }`}
                  >
                    {dict.fees.select}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-3xl rounded-md border border-cream-200 bg-cream-100/60 p-6 text-center text-sm leading-relaxed text-ink-800/80">
            {dict.fees.note}
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-md border border-cream-200 bg-cream-50 p-8">
              <IconCard className="h-10 w-10 text-gold-600" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink-900">{dict.fees.methodsTitle}</h2>
              <ul className="mt-6 space-y-3">
                {dict.fees.methods.map((method) => (
                  <li key={method} className="flex gap-3 text-[15px] text-ink-800/85">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-md border border-cream-200 bg-cream-50 p-8">
              <IconShield className="h-10 w-10 text-gold-600" />
              <h2 className="mt-5 font-display text-2xl font-semibold text-ink-900">{dict.fees.guaranteeTitle}</h2>
              <ul className="mt-6 space-y-3">
                {dict.fees.guarantees.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] text-ink-800/85">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button href={path(locale, routes.payment)} className="mt-8">
                {dict.nav.payOnline}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading kicker={dict.home.faqKicker} title={dict.home.faqTitle} center />
          <div className="mt-12">
            <Accordion items={dict.home.faq} />
          </div>
        </div>
      </section>
    </>
  );
}
