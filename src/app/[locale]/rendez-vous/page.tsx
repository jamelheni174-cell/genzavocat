import type { Metadata } from "next";
import AppointmentForm from "@/components/AppointmentForm";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { IconCheck } from "@/components/Icons";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.appointment.title, description: dict.appointment.subtitle };
}

export default async function AppointmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero kicker={dict.appointment.kicker} title={dict.appointment.title} text={dict.appointment.subtitle} />
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="card-shadow rounded-md border border-cream-200 bg-white p-8">
              <AppointmentForm dict={dict} locale={locale} />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-md border border-cream-200 bg-ink-900 p-8 text-cream-50">
              <h2 className="font-display text-2xl font-semibold">{dict.home.processTitle}</h2>
              <ol className="mt-7 space-y-6">
                {dict.home.process.map((step) => (
                  <li key={step.step} className="flex gap-4">
                    <span className="font-display text-xl font-semibold text-gold-500">{step.step}</span>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="mt-1 text-sm text-cream-100/70">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <ul className="mt-8 space-y-3 border-t border-cream-100/15 pt-6">
                {dict.fees.guarantees.map((g) => (
                  <li key={g} className="flex gap-3 text-sm text-cream-100/75">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
