import type { Metadata } from "next";
import SimulationClient from "@/components/SimulationClient";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Simulation", robots: { index: false } };
}

export default async function SimulationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale: raw } = await params;
  const { order: orderId } = await searchParams;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);
  const order = orderId ? await getOrder(orderId) : null;

  return (
    <SimulationClient
      locale={locale}
      dict={dict}
      orderId={order?.id ?? ""}
      amount={order?.amountTND ?? 0}
      packageName={order?.packageName ?? ""}
    />
  );
}
