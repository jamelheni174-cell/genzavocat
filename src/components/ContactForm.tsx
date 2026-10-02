"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

const field =
  "w-full rounded-sm border border-cream-200 bg-white px-4 py-3 text-[15px] text-ink-900 outline-none transition placeholder:text-ink-700/35 focus:border-gold-500";

export default function ContactForm({ dict }: { dict: Dictionary }) {
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: "contact" }),
      });
      if (!res.ok) throw new Error();
      setState("sent");
      event.currentTarget.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-[15px] leading-relaxed text-emerald-800">{dict.contact.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.contact.name} *</label>
        <input name="name" required className={field} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.contact.emailLabel} *</label>
        <input name="email" type="email" required className={field} dir="ltr" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.contact.phoneLabel}</label>
        <input name="phone" type="tel" className={field} dir="ltr" placeholder="+216 ..." />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.contact.subject}</label>
        <input name="subject" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-ink-800">{dict.contact.message} *</label>
        <textarea name="message" required className={`${field} min-h-40`} />
      </div>
      {state === "error" ? <p className="text-sm text-red-600 sm:col-span-2">{dict.contact.error}</p> : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-sm bg-gold-500 px-8 py-4 text-sm font-semibold text-ink-950 transition hover:bg-gold-400 disabled:opacity-60"
        >
          {state === "loading" ? dict.common.sending : dict.contact.submit}
        </button>
      </div>
    </form>
  );
}
