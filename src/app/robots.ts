import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/fr/paiement/simulation", "/ar/paiement/simulation"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
