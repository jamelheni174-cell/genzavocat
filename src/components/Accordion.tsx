"use client";

import { useState } from "react";

export default function Accordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-cream-200 overflow-hidden rounded-md border border-cream-200 bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start text-base font-medium text-ink-900 transition hover:text-gold-600"
            >
              <span>{item.q}</span>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition ${
                  isOpen ? "rotate-45 border-gold-500 text-gold-600" : "border-ink-900/20 text-ink-700"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink-800/80">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
