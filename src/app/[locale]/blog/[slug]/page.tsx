import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, PageHero } from "@/components/ui";
import { getDictionary, isLocale, locales, path, routes, type Locale } from "@/lib/i18n";
import { fr } from "@/content/fr";

export function generateStaticParams() {
  return locales.flatMap((locale) => fr.posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  const post = dict.posts.find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);
  const post = dict.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = dict.posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <PageHero kicker={post.category} title={post.title} text={`${dict.blog.publishedOn} ${post.date}`} />
      <article className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="font-display text-xl leading-relaxed text-ink-900">{post.excerpt}</p>
          <div className="mt-8 space-y-5 text-[17px] leading-[1.9] text-ink-800/85">
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 rounded-md border border-cream-200 bg-white p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink-900">{dict.home.ctaTitle}</h2>
            <p className="mt-3 text-[15px] text-ink-800/75">{dict.home.ctaText}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button href={path(locale, routes.payment)}>{dict.nav.payOnline}</Button>
              <Button href={path(locale, routes.appointment)} variant="outline">
                {dict.common.bookNow}
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`${path(locale, routes.blog)}/${other.slug}`}
                className="rounded-md border border-cream-200 bg-white p-6 transition hover:border-gold-500"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-gold-600">{other.category}</p>
                <p className="mt-2 font-display text-lg font-semibold text-ink-900">{other.title}</p>
              </Link>
            ))}
          </div>

          <Link
            href={path(locale, routes.blog)}
            className="mt-10 inline-block text-sm font-semibold text-gold-600 hover:underline"
          >
            ← {dict.blog.backToBlog}
          </Link>
        </div>
      </article>
    </>
  );
}
