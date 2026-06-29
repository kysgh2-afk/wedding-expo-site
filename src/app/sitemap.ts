import type { MetadataRoute } from "next";
import { ALL_REGION_PAGES, getSiteUrl } from "@/lib/regions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getArticleEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    const siteUrl = getSiteUrl();
    return articles.map((article) => ({
      url: `${siteUrl}/content/${article.id}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.warn("[sitemap] Article 목록을 불러오지 못했습니다:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const articleEntries = await getArticleEntries();

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
    ...articleEntries,
  ];
}
