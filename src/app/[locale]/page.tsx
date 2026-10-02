import Image from "next/image";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import Reveal from "@/components/Reveal";
import { Button, Kicker, SectionHeading } from "@/components/ui";
import {
  IconBriefcase,
  IconCheck,
  IconClock,
  IconDoc,
  IconGavel,
  IconGlobe,
  IconHome,
  IconShield,
  IconUsers,
} from "@/components/Icons";
import { siteConfig } from "@/content/site";
import { getDictionary, isLocale, path, routes, type Locale } from "@/lib/i18n";

const serviceIcons = [IconBriefcase, IconUsers, IconHome, IconGavel, IconDoc, IconGlobe];
const whyIcons = [IconDoc, IconGlobe, IconClock, IconShield];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);

  const highlighted = [
    dict.services.companies[0],
    dict.services.individuals[0],
    dict.services.individuals[2],
    dict.services.companies[2],
    dict.services.companies[3],
    dict.services.individuals[3],
  ];

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-6 py-24 sm:py-32 lg:min-h-[640px] lg:py-36">
          <div className="max-w-3xl animate-fade-up">
            <Kicker light>{dict.home.heroKicker}</Kicker>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-cream-50 sm:text-5xl lg:text-6xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-100/80 sm:text-lg">
              {dict.home.heroText}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={path(locale, routes.appointment)}>{dict.home.heroCta1}</Button>
              <Button href={path(locale, routes.servicesCompanies)} variant="ghost">
                {dict.home.heroCta2}
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cream-100/70">
              <span className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-gold-500" />
                {dict.home.heroBadge1}
              </span>
              <span className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-gold-500" />
                {dict.home.heroBadge2}
              </span>
              <span className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-gold-500" />
                {dict.common.securePayment}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="border-b border-cream-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-cream-200 lg:grid-cols-4">
          {dict.home.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="bg-white px-6 py-10 text-center">
              <p className="font-display text-4xl font-semibold text-gold-600 sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.14em] text-ink-700/70">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md">
              <Image
                src="/images/lawyer.jpg"
                alt={dict.lawyerName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="card-shadow absolute bottom-6 hidden w-64 rounded-md bg-ink-900 p-6 text-cream-50 sm:block ltr:-right-6 rtl:-left-6">
              <p className="font-display text-3xl font-semibold text-gold-500">15+</p>
              <p className="mt-1 text-sm text-cream-100/75">{dict.home.stats[0].label}</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionHeading
              kicker={dict.home.aboutKicker}
              title={dict.home.aboutTitle}
              text={dict.home.aboutText1}
            />
            <p className="mt-4 text-base leading-relaxed text-ink-800/75">{dict.home.aboutText2}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {dict.home.aboutPoints.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] text-ink-800">
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={path(locale, routes.about)} variant="dark">
                {dict.common.readMore}
              </Button>
              <Button href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} variant="outline">
                {dict.common.callNow}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            kicker={dict.home.servicesKicker}
            title={dict.home.servicesTitle}
            text={dict.home.servicesText}
            center
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlighted.map((service, i) => {
              const Icon = serviceIcons[i % serviceIcons.length];
              return (
                <Reveal key={service.title} delay={i * 70}>
                  <div className="group h-full rounded-md border border-cream-200 bg-cream-50 p-8 transition duration-300 hover:-translate-y-1 hover:border-gold-500 hover:bg-white hover:shadow-xl">
                    <span className="grid h-14 w-14 place-items-center rounded-sm bg-ink-900 text-gold-500 transition group-hover:bg-gold-500 group-hover:text-ink-950">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-6 font-display text-xl font-semibold text-ink-900">{service.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-800/75">{service.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button href={path(locale, routes.servicesCompanies)} variant="dark">
              {dict.nav.servicesCompanies}
            </Button>
            <Button href={path(locale, routes.servicesIndividuals)} variant="outline">
              {dict.nav.servicesIndividuals}
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- WHY US ---------------- */}
      <section className="relative overflow-hidden bg-ink-900 py-20 text-cream-50 sm:py-28">
        <Image src="/images/office.jpg" alt="" fill sizes="100vw" className="object-cover opacity-10" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading kicker={dict.home.whyKicker} title={dict.home.whyTitle} light center />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.why.map((item, i) => {
              const Icon = whyIcons[i % whyIcons.length];
              return (
                <Reveal key={item.title} delay={i * 80}>
                  <div className="h-full rounded-md border border-cream-100/12 bg-white/[0.04] p-7 backdrop-blur-sm transition hover:border-gold-500/60">
                    <Icon className="h-9 w-9 text-gold-500" />
                    <h3 className="mt-5 font-display text-lg font-semibold text-cream-50">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream-100/70">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading kicker={dict.home.processKicker} title={dict.home.processTitle} center />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.process.map((step, i) => (
              <Reveal key={step.step} delay={i * 90}>
                <div className="relative h-full border-t-2 border-cream-200 pt-7 transition hover:border-gold-500">
                  <span className="font-display text-5xl font-semibold text-cream-200">{step.step}</span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-800/75">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRICING TEASER ---------------- */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading kicker={dict.fees.kicker} title={dict.fees.title} text={dict.fees.subtitle} center />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {dict.packages.map((pack, i) => (
              <Reveal key={pack.id} delay={i * 70}>
                <div
                  className={`flex h-full flex-col rounded-md border p-7 transition ${
                    pack.popular
                      ? "border-gold-500 bg-ink-900 text-cream-50 shadow-xl"
                      : "border-cream-200 bg-cream-50 hover:border-gold-500"
                  }`}
                >
                  {pack.popular ? (
                    <span className="mb-4 inline-block w-fit rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">
                      {dict.fees.popular}
                    </span>
                  ) : null}
                  <h3 className={`font-display text-lg font-semibold ${pack.popular ? "text-cream-50" : "text-ink-900"}`}>
                    {pack.name}
                  </h3>
                  <p className={`mt-2 text-xs uppercase tracking-wider ${pack.popular ? "text-cream-100/60" : "text-ink-700/60"}`}>
                    {pack.duration}
                  </p>
                  <p className="mt-5 font-display text-4xl font-semibold text-gold-500">
                    {pack.price}
                    <span className="ms-1 text-base font-normal">{siteConfig.currency}</span>
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
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            kicker={dict.home.testimonialsKicker}
            title={dict.home.testimonialsTitle}
            center
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {dict.home.testimonials.map((item, i) => (
              <Reveal key={item.name} delay={i * 90}>
                <figure className="card-shadow h-full rounded-md border border-cream-200 bg-white p-8">
                  <span className="font-display text-5xl leading-none text-gold-500">“</span>
                  <blockquote className="mt-3 text-[15px] leading-relaxed text-ink-800/85">{item.text}</blockquote>
                  <figcaption className="mt-6 border-t border-cream-200 pt-4">
                    <p className="font-semibold text-ink-900">{item.name}</p>
                    <p className="text-sm text-ink-700/65">{item.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative isolate overflow-hidden bg-ink-950 py-20">
        <Image src="/images/cta.jpg" alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
          <h2 className="font-display text-3xl font-semibold text-cream-50 sm:text-4xl">{dict.home.ctaTitle}</h2>
          <p className="mt-4 max-w-2xl text-cream-100/75">{dict.home.ctaText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={path(locale, routes.payment)}>{dict.nav.payOnline}</Button>
            <Button href={path(locale, routes.appointment)} variant="ghost">
              {dict.common.bookNow}
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <SectionHeading kicker={dict.home.faqKicker} title={dict.home.faqTitle} />
            <p className="mt-6 text-[15px] text-ink-800/75">{dict.fees.note}</p>
            <Button href={path(locale, routes.contact)} variant="dark" className="mt-8">
              {dict.nav.contact}
            </Button>
          </Reveal>
          <Reveal delay={120}>
            <Accordion items={dict.home.faq} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
