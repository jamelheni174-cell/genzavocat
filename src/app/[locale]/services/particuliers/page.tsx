import type { Metadata } from "next";
import ServiceList from "@/components/ServiceList";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.services.individualsTitle, description: dict.services.individualsIntro };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  return <ServiceList locale={locale} dict={getDictionary(locale)} kind="individuals" />;
}
