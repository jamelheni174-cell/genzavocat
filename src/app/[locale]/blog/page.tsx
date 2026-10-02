import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/ui";
import { IconArrow } from "@/components/Icons";
import { getDictionary, isLocale, path, routes, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "fr");
  return { title: dict.blog.title, description: dict.blog.subtitle };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = (isLocale(raw) ? raw : "fr") as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHero kicker={dict.blog.kicker} title={dict.blog.title} text={dict.blog.subtitle} />
      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2">
          {dict.posts.map((post, i) => (
            <Reveal as="article" key={post.slug} delay={i * 80}>
              <div className="card-shadow flex h-full flex-col rounded-md border border-cream-200 bg-white p-8">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-gold-600">
                  <span>{post.category}</span>
                  <span className="h-px w-6 bg-gold-500" />
                  <time dateTime={post.date} className="text-ink-700/60">
                    {post.date}
                  </time>
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink-900">
                  <Link href={`${path(locale, routes.blog)}/${post.slug}`} className="transition hover:text-gold-600">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-800/75">{post.excerpt}</p>
                <Link
                  href={`${path(locale, routes.blog)}/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-600"
                >
                  {dict.blog.readArticle}
                  <IconArrow className="flip-rtl h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
