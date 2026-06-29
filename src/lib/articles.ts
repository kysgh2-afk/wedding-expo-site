import { prisma } from "@/lib/prisma";

export async function getPublishedArticles() {
  return prisma.article.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getPublishedArticle(id: string) {
  return prisma.article.findFirst({
    where: { id, isPublished: true },
  });
}
