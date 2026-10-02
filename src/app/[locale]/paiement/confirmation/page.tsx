import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui";
import { IconCheck } from "@/components/Icons";
import { siteConfig } from "@/content/site";
import { getDictionary, isLocale, path, routes, type Locale } from "@/lib/i18n";
import { getOrder, updateOrder } from "@/lib/orders";
import { verifyPayment } from "@/lib/payment";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.payment.successTitle, robots: { index: false } };
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string; status?: string; payment_ref?: string }>;
}) {
  const { locale: raw } = await params;
  const query = await searchParams;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);

  const order = query.order ? await getOrder(query.order) : null;
  let status: "paid" | "failed" | "pending" = "pending";

  if (order) {
    if (order.providerRef) {
      const verified = await verifyPayment(order.providerRef);
      if (verified !== order.status) await updateOrder(order.id, { status: verified });
      status = verified;
    } else {
      status = order.status as typeof status;
    }
  }
  if (query.status === "failed" && status !== "paid") status = "failed";

  const config = {
    paid: { title: dict.payment.successTitle, text: dict.payment.successText, tone: "text-emerald-600" },
    failed: { title: dict.payment.failedTitle, text: dict.payment.failedText, tone: "text-red-600" },
    pending: { title: dict.payment.pendingTitle, text: dict.payment.pendingText, tone: "text-amber-600" },
  }[status];

  return (
    <section className="bg-cream-50 py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="card-shadow rounded-md border border-cream-200 bg-white p-10 text-center">
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-full border-2 ${
              status === "paid"
                ? "border-emerald-500 text-emerald-600"
                : status === "failed"
                  ? "border-red-400 text-red-500"
                  : "border-amber-400 text-amber-500"
            }`}
          >
            {status === "paid" ? (
              <IconCheck className="h-8 w-8" />
            ) : (
              <span className="font-display text-3xl">{status === "failed" ? "×" : "…"}</span>
            )}
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-ink-900">{config.title}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-800/75">{config.text}</p>

          {order ? (
            <dl className="mt-8 space-y-3 rounded-md border border-cream-200 bg-cream-50 p-6 text-start text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-700/70">{dict.payment.refLabel}</dt>
                <dd className="font-mono text-ink-900">{order.id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-700/70">{dict.payment.service}</dt>
                <dd className="text-end font-medium text-ink-900">{order.packageName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-700/70">{dict.payment.total}</dt>
                <dd className="font-semibold text-gold-600">
                  {order.amountTND} {siteConfig.currency}
                </dd>
              </div>
            </dl>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {status === "paid" ? (
              <Button href={path(locale, routes.home)} variant="dark">
                {dict.common.backHome}
              </Button>
            ) : (
              <Button href={path(locale, routes.payment)}>{dict.payment.retry}</Button>
            )}
            <Link
              href={path(locale, routes.contact)}
              className="inline-flex items-center rounded-sm border border-ink-900/20 px-6 py-3.5 text-sm font-semibold text-ink-900 transition hover:border-gold-500 hover:text-gold-600"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
