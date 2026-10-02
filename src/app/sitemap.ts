import type { MetadataRoute } from "next";
import { fr } from "@/content/fr";
import { locales, routes } from "@/lib/i18n";
import { siteConfig } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.values(routes);
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${siteConfig.url}/${locale}${page ? `/${page}` : ""}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: page === "" ? 1 : 0.7,
      });
    }
    for (const post of fr.posts) {
      entries.push({
        url: `${siteConfig.url}/${locale}/${routes.blog}/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "yearly",
        priority: 0.5,
      });
    }
  }
  return entries;
}
