"use client";

import { useState } from "react";
import { siteConfig } from "@/content/site";
import type { Dictionary, Locale } from "@/lib/i18n";
import { IconCard, IconShield } from "./Icons";

/**
 * Page de simulation utilisée uniquement en mode démonstration
 * (aucune clé de prestataire de paiement configurée).
 */
export default function SimulationClient({
  locale,
  dict,
  orderId,
  amount,
  packageName,
}: {
  locale: Locale;
  dict: Dictionary;
  orderId: string;
  amount: number;
  packageName: string;
}) {
  const [loading, setLoading] = useState<"paid" | "failed" | null>(null);

  async function finish(result: "paid" | "failed") {
    setLoading(result);
    await fetch("/api/payment/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, simulate: result }),
    });
    window.location.href = `/${locale}/paiement/confirmation?order=${orderId}&status=${
      result === "paid" ? "success" : "failed"
    }`;
  }

  return (
    <section className="grid min-h-[70vh] place-items-center bg-ink-900 px-6 py-20">
      <div className="w-full max-w-md rounded-md bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <IconCard className="h-6 w-6 text-gold-600" />
            Paiement sécurisé
          </span>
          <IconShield className="h-5 w-5 text-emerald-600" />
        </div>

        <p className="mt-4 rounded-sm border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
          {dict.payment.demoNotice}
        </p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-700/70">{dict.payment.refLabel}</dt>
            <dd className="font-mono text-ink-900">{orderId || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-700/70">{dict.payment.service}</dt>
            <dd className="text-end font-medium text-ink-900">{packageName || "—"}</dd>
          </div>
          <div className="flex items-end justify-between border-t border-cream-200 pt-3">
            <dt className="font-semibold uppercase tracking-wider text-ink-700/70">{dict.payment.total}</dt>
            <dd className="font-display text-2xl font-semibold text-gold-600">
              {amount} {siteConfig.currency}
            </dd>
          </div>
        </dl>

        <div className="mt-6 space-y-3 opacity-60">
          <div className="rounded-sm border border-cream-200 px-4 py-3 text-sm text-ink-700/60">
            4242 4242 4242 4242
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-sm border border-cream-200 px-4 py-3 text-sm text-ink-700/60">12 / 30</div>
            <div className="rounded-sm border border-cream-200 px-4 py-3 text-sm text-ink-700/60">•••</div>
          </div>
        </div>

        <button
          type="button"
          disabled={loading !== null || !orderId}
          onClick={() => finish("paid")}
          className="mt-6 w-full rounded-sm bg-emerald-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading === "paid" ? "…" : `${dict.common.payNow} — ${amount} ${siteConfig.currency}`}
        </button>
        <button
          type="button"
          disabled={loading !== null || !orderId}
          onClick={() => finish("failed")}
          className="mt-3 w-full rounded-sm border border-ink-900/15 px-6 py-3 text-sm font-medium text-ink-700 transition hover:border-red-400 hover:text-red-600 disabled:opacity-60"
        >
          {dict.payment.failedTitle}
        </button>
      </div>
    </section>
  );
}
