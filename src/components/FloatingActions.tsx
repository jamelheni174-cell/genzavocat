"use client";

import { siteConfig } from "@/content/site";
import type { Dictionary } from "@/lib/i18n";
import { IconPhone, IconWhatsapp } from "./Icons";

export default function FloatingActions({ dict }: { dict: Dictionary }) {
  const message = encodeURIComponent(
    dict.dir === "rtl"
      ? "السلام عليكم، أودّ الحصول على استشارة قانونية."
      : "Bonjour, je souhaite obtenir une consultation juridique.",
  );
  return (
    <div className="fixed bottom-5 z-40 flex flex-col gap-3 ltr:right-5 rtl:left-5 print:hidden">
      <a
        href={`https://wa.me/${siteConfig.whatsapp}?text=${message}`}
        target="_blank"
        rel="noreferrer"
        aria-label={dict.common.whatsapp}
        className="grid h-13 w-13 place-items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg transition hover:scale-105"
      >
        <IconWhatsapp className="h-6 w-6" />
      </a>
      <a
        href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
        aria-label={dict.common.callNow}
        className="grid place-items-center rounded-full bg-ink-900 p-3.5 text-gold-500 shadow-lg transition hover:scale-105 sm:hidden"
      >
        <IconPhone className="h-6 w-6" />
      </a>
    </div>
  );
}
