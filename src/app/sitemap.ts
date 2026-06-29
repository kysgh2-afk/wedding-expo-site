import type { MetadataRoute } from "next";
import { ALL_REGION_PAGES, getSiteUrl } from "@/lib/regions";

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
  ];
}
