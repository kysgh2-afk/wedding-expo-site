import type { MetadataRoute } from "next";
import { ALL_REGION_PAGES, getSiteUrl } from "@/lib/regions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

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
    ...articles.map((article) => ({
      url: `${siteUrl}/content/${article.id}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
