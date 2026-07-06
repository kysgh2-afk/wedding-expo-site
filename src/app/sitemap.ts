import type { MetadataRoute } from "next";
import { LEGAL_PAGES } from "@/lib/legal";
import { ALL_REGION_PAGES, getSiteUrl } from "@/lib/regions";
import { ALL_COST_PAGES } from "@/lib/wedding-cost";
import { SEO_POPULAR } from "@/lib/popular";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...ALL_REGION_PAGES.map((page) => ({
      url: `${siteUrl}${page.path}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: page.path.includes("/metropolitan/") || page.path.includes("/local/") ? 0.9 : 0.95,
    })),
    ...LEGAL_PAGES.map((page) => ({
      url: `${siteUrl}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...ALL_COST_PAGES.map((page) => ({
      url: `${siteUrl}${page.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: page.path === "/cost" ? 0.85 : 0.8,
    })),
    {
      url: `${siteUrl}${SEO_POPULAR.path}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];
}
