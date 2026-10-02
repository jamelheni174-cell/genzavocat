"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/content/site";
import type { Dictionary, Locale } from "@/lib/i18n";
import { IconCheck, IconShield } from "./Icons";

const CUSTOM = "custom";

export default function PaymentForm({
  locale,
  dict,
  defaultPackage,
  demo,
}: {
  locale: Locale;
  dict: Dictionary;
  defaultPackage?: string;
  demo: boolean;
}) {
  const packages = dict.packages;
  const initial = packages.some((p) => p.id === defaultPackage) ? (defaultPackage as string) : packages[1].id;

  const [selected, setSelected] = useState<string>(initial);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", reference: "", message: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const pack = packages.find((p) => p.id === selected) ?? null;
  const amount = useMemo(() => {
    if (selected === CUSTOM) return Number(customAmount.replace(",", ".")) || 0;
    return pack?.price ?? 0;
  }, [selected, customAmount, pack]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = dict.payment.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = dict.payment.errors.email;
    if (form.phone.replace(/\D/g, "").length < 8) next.phone = dict.payment.errors.phone;
    if (!(amount >= 20)) next.amount = dict.payment.errors.amount;
    if (!agree) next.agree = dict.payment.errors.agree;
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount,
          locale,
          packageId: selected === CUSTOM ? null : selected,
          packageName: selected === CUSTOM ? dict.payment.customAmount : pack?.name,
        }),
      });
      const data = (await response.json()) as { payUrl?: string; error?: string };
      if (!response.ok || !data.payUrl) throw new Error(data.error || "generic");
      window.location.href = data.payUrl;
    } catch {
      setErrors({ form: dict.payment.errors.generic });
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-sm border border-cream-200 bg-white px-4 py-3 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-700/35 focus:border-gold-500";

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <div className="space-y-8">
        {/* Prestation */}
        <fieldset>
          <legend className="mb-4 font-display text-xl font-semibold text-ink-900">{dict.payment.service}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {packages.map((p) => (
              <label
                key={p.id}
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition ${
                  selected === p.id ? "border-gold-500 bg-white shadow-sm" : "border-cream-200 bg-white/60 hover:border-gold-400"
                }`}
              >
                <input
                  type="radio"
                  name="package"
                  value={p.id}
                  checked={selected === p.id}
                  onChange={() => setSelected(p.id)}
                  className="mt-1 h-4 w-4 accent-[#c8a24a]"
                />
                <span className="flex-1">
                  <span className="block text-[15px] font-semibold text-ink-900">{p.name}</span>
                  <span className="block text-xs text-ink-700/60">{p.duration}</span>
                  <span className="mt-1 block font-display text-lg font-semibold text-gold-600">
                    {p.price} {siteConfig.currency}
                  </span>
                </span>
              </label>
            ))}
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition sm:col-span-2 ${
                selected === CUSTOM ? "border-gold-500 bg-white shadow-sm" : "border-cream-200 bg-white/60 hover:border-gold-400"
              }`}
            >
              <input
                type="radio"
                name="package"
                value={CUSTOM}
                checked={selected === CUSTOM}
                onChange={() => setSelected(CUSTOM)}
                className="mt-1 h-4 w-4 accent-[#c8a24a]"
              />
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-ink-900">{dict.payment.customAmount}</span>
                {selected === CUSTOM ? (
                  <span className="mt-3 block">
                    <span className="flex max-w-xs items-center gap-2">
                      <input
                        type="number"
                        min={20}
                        step="1"
                        inputMode="decimal"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="250"
                        className={field}
                      />
                      <span className="font-semibold text-ink-800">{siteConfig.currency}</span>
                    </span>
                    <span className="mt-2 block text-xs text-ink-700/60">{dict.payment.amountHint}</span>
                  </span>
                ) : null}
              </span>
            </label>
          </div>
          {errors.amount ? <p className="mt-2 text-sm text-red-600">{errors.amount}</p> : null}
        </fieldset>

        {/* Coordonnées */}
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-4 font-display text-xl font-semibold text-ink-900">
            {dict.contact.infoTitle}
          </legend>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.payment.fullName} *</label>
            <input className={field} value={form.name} onChange={set("name")} autoComplete="name" />
            {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name}</p> : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.payment.emailLabel} *</label>
            <input className={field} type="email" value={form.email} onChange={set("email")} autoComplete="email" dir="ltr" />
            {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email}</p> : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.payment.phoneLabel} *</label>
            <input
              className={field}
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+216 ..."
              autoComplete="tel"
              dir="ltr"
            />
            {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone}</p> : null}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.payment.reference}</label>
            <input className={field} value={form.reference} onChange={set("reference")} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.payment.message}</label>
            <textarea className={`${field} min-h-28`} value={form.message} onChange={set("message")} />
          </div>
        </fieldset>
      </div>

      {/* Récapitulatif */}
      <aside className="card-shadow sticky top-28 rounded-md border border-cream-200 bg-white p-7">
        <h2 className="font-display text-xl font-semibold text-ink-900">{dict.payment.summary}</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-cream-200 pb-3">
            <dt className="text-ink-700/70">{dict.payment.service}</dt>
            <dd className="text-end font-medium text-ink-900">
              {selected === CUSTOM ? dict.payment.customAmount : pack?.name}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-700/70">{dict.payment.amount}</dt>
            <dd className="font-medium text-ink-900">
              {amount || 0} {siteConfig.currency}
            </dd>
          </div>
        </dl>
        <div className="mt-5 flex items-end justify-between border-t border-cream-200 pt-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-ink-700/70">{dict.payment.total}</span>
          <span className="font-display text-3xl font-semibold text-gold-600">
            {amount || 0} <span className="text-base">{siteConfig.currency}</span>
          </span>
        </div>
        <p className="mt-1 text-end text-xs text-ink-700/55">{dict.common.vatIncluded}</p>

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-ink-800/85">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#c8a24a]"
          />
          <span>{dict.payment.agree}</span>
        </label>
        {errors.agree ? <p className="mt-1 text-sm text-red-600">{errors.agree}</p> : null}
        {errors.form ? <p className="mt-3 text-sm text-red-600">{errors.form}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-sm bg-gold-500 px-6 py-4 text-sm font-semibold text-ink-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? dict.payment.processing : dict.payment.submit}
        </button>

        <div className="mt-5 space-y-2 text-xs text-ink-700/65">
          <p className="flex items-center gap-2">
            <IconShield className="h-4 w-4 text-gold-600" />
            {dict.common.securePayment}
          </p>
          {dict.fees.methods.slice(0, 3).map((m) => (
            <p key={m} className="flex items-center gap-2">
              <IconCheck className="h-4 w-4 text-gold-600" />
              {m}
            </p>
          ))}
        </div>

        {demo ? (
          <p className="mt-5 rounded-sm border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            {dict.payment.demoNotice}
          </p>
        ) : null}
      </aside>
    </form>
  );
}
