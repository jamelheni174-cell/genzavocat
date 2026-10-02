import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { getDictionary, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.legal.privacyTitle };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return (
    <>
      <PageHero kicker={dict.firmName} title={dict.legal.privacyTitle} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-5 px-6 text-[17px] leading-[1.9] text-ink-800/85">
          {dict.legal.privacyBody.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>
    </>
  );
}
