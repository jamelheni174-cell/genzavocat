import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/content/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: dict.meta.title, template: `%s — ${dict.firmName}` },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", ar: "/ar" },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "ar" ? "ar_TN" : "fr_TN",
      type: "website",
      images: ["/images/hero.jpg"],
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: dict.lawyerName,
    description: dict.meta.description,
    url: `${siteConfig.url}/${locale}`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: locale === "ar" ? siteConfig.addressAr : siteConfig.addressFr,
      addressLocality: "Tunis",
      addressCountry: "TN",
    },
    areaServed: "TN",
    priceRange: "TND",
  };

  return (
    <html lang={locale} dir={dict.dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Noto+Kufi+Arabic:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-cream-50"
        >
          {dict.common.backHome}
        </a>
        <Header locale={typedLocale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={typedLocale} dict={dict} />
        <FloatingActions dict={dict} />
      </body>
    </html>
  );
}
