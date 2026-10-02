import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { IconClock, IconMail, IconPhone, IconPin } from "@/components/Icons";
import { siteConfig } from "@/content/site";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.contact.title, description: dict.contact.subtitle };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);

  const infos = [
    {
      icon: IconPin,
      label: dict.common.address,
      value: locale === "ar" ? siteConfig.addressAr : siteConfig.addressFr,
      href: siteConfig.mapsUrl,
    },
    { icon: IconPhone, label: dict.common.phone, value: `${siteConfig.phone} · ${siteConfig.mobile}`, href: `tel:${siteConfig.phone.replace(/\s/g, "")}` },
    { icon: IconMail, label: dict.common.email, value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: IconClock, label: dict.common.hours, value: dict.common.workingHours },
  ];

  return (
    <>
      <PageHero kicker={dict.contact.kicker} title={dict.contact.title} text={dict.contact.subtitle} />

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink-900">{dict.contact.infoTitle}</h2>
            <span className="mt-3 block h-px w-14 bg-gold-500" />
            <ul className="mt-8 space-y-6">
              {infos.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-ink-900 text-gold-500">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-ink-700/60">{label}</p>
                    {href ? (
                      <a href={href} className="text-[15px] text-ink-900 transition hover:text-gold-600">
                        {value}
                      </a>
                    ) : (
                      <p className="text-[15px] text-ink-900">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="card-shadow rounded-md border border-cream-200 bg-white p-8">
              <ContactForm dict={dict} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink-900">{dict.contact.mapTitle}</h2>
          <div className="overflow-hidden rounded-md border border-cream-200">
            <iframe
              title={dict.contact.mapTitle}
              src="https://www.openstreetmap.org/export/embed.html?bbox=10.16%2C36.79%2C10.20%2C36.81&layer=mapnik&marker=36.8008%2C10.1817"
              className="h-[420px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
