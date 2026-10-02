import type { Metadata } from "next";
import PaymentForm from "@/components/PaymentForm";
import { PageHero } from "@/components/ui";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { isDemo } from "@/lib/payment";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.payment.title, description: dict.payment.subtitle };
}

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ package?: string }>;
}) {
  const { locale: raw } = await params;
  const { package: pkg } = await searchParams;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero kicker={dict.payment.kicker} title={dict.payment.title} text={dict.payment.subtitle} />
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <PaymentForm locale={locale} dict={dict} defaultPackage={pkg} demo={isDemo()} />
        </div>
      </section>
    </>
  );
}
