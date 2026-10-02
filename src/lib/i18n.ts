import { fr, type Dictionary } from "@/content/fr";
import { ar } from "@/content/ar";

export const locales = ["fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

const dictionaries: Record<Locale, Dictionary> = { fr, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "fr" ? "ar" : "fr";
}

/** Slugs de pages, identiques dans les deux langues pour simplifier les URLs. */
export const routes = {
  home: "",
  about: "cabinet",
  servicesCompanies: "services/entreprises",
  servicesIndividuals: "services/particuliers",
  fees: "honoraires",
  payment: "paiement",
  appointment: "rendez-vous",
  blog: "blog",
  contact: "contact",
  legal: "mentions-legales",
  privacy: "confidentialite",
  terms: "conditions-generales",
} as const;

export function path(locale: Locale, route: string) {
  return route ? `/${locale}/${route}` : `/${locale}`;
}

export type { Dictionary };
