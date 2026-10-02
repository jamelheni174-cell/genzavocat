import Image from "next/image";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { Button, PageHero, SectionHeading } from "@/components/ui";
import { IconCheck } from "@/components/Icons";
import { getDictionary, isLocale, path, routes, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.about.title, description: dict.about.intro };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero kicker={dict.about.kicker} title={dict.about.title} text={dict.about.subtitle} />

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-md">
            <Image
              src="/images/lawyer.jpg"
              alt={dict.lawyerName}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="font-display text-2xl leading-relaxed text-ink-900">{dict.about.intro}</p>
            <p className="mt-6 text-base leading-relaxed text-ink-800/80">{dict.about.bio1}</p>
            <p className="mt-4 text-base leading-relaxed text-ink-800/80">{dict.about.bio2}</p>

            <h2 className="mt-10 font-display text-2xl font-semibold text-ink-900">{dict.about.valuesTitle}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {dict.about.values.map((value) => (
                <div key={value.title} className="rounded-md border border-cream-200 bg-white p-6">
                  <h3 className="font-display text-lg font-semibold text-gold-600">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-800/75">{value.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={path(locale, routes.appointment)} variant="dark">
                {dict.common.bookNow}
              </Button>
              <Button href={path(locale, routes.fees)} variant="outline">
                {dict.nav.fees}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading kicker={dict.about.kicker} title={dict.about.timelineTitle} center />
          <ol className="mt-14 space-y-8 border-cream-200 ltr:border-l rtl:border-r">
            {dict.about.timeline.map((item, i) => (
              <Reveal as="li" key={item.year} delay={i * 80} className="relative ps-8">
                <span className="absolute top-1.5 h-3 w-3 rounded-full bg-gold-500 ltr:-left-[6.5px] rtl:-right-[6.5px]" />
                <p className="font-display text-xl font-semibold text-gold-600">{item.year}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-800/80">{item.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading kicker={dict.services.kicker} title={dict.about.expertiseTitle} center />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...dict.services.companies.slice(0, 4), ...dict.services.individuals.slice(0, 4)].map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 50}>
                <div className="flex h-full items-start gap-3 rounded-md border border-cream-200 bg-white p-5">
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                  <span className="text-[15px] font-medium text-ink-900">{item.title}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
