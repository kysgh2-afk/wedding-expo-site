import type { MetadataRoute } from "next";
import { LEGAL_PAGES } from "@/lib/legal";
import { ALL_REGION_PAGES, getSiteUrl } from "@/lib/regions";
import { ALL_COST_PAGES } from "@/lib/wedding-cost";
import { SEO_POPULAR } from "@/lib/popular";
import { getPublishedContent } from "@/lib/content-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const content = await getPublishedContent();

  return [
    {
      url: siteUrl,
      changeFrequency: "daily",
      priority: 1,
    },
    ...ALL_REGION_PAGES.map((page) => ({
      url: `${siteUrl}${page.path}`,
      changeFrequency: "daily" as const,
      priority:
        page.path.includes("/metropolitan/") ||
        page.path.includes("/gyeonggi/") ||
        page.path.match(/\/local\/[^/]+\/[^/]+/)
          ? 0.9
          : 0.95,
    })),
    ...LEGAL_PAGES.map((page) => ({
      url: `${siteUrl}${page.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...ALL_COST_PAGES.map((page) => ({
      url: `${siteUrl}${page.path}`,
      changeFrequency: "monthly" as const,
      priority: page.path === "/cost" ? 0.85 : 0.8,
    })),
    {
      url: `${siteUrl}${SEO_POPULAR.path}`,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/content`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...content.map((item) => ({
      url: `${siteUrl}/content/${encodeURIComponent(item.slug)}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
