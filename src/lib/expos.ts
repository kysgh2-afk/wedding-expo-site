import { prisma } from "@/lib/prisma";

type ExpoFilter = {
  regionGroup: string;
  regionSub?: string;
};

export async function getPublishedExpos(filter?: ExpoFilter) {
  return prisma.expo.findMany({
    where: {
      isPublished: true,
      ...(filter?.regionGroup ? { regionGroup: filter.regionGroup } : {}),
      ...(filter?.regionSub ? { regionSub: filter.regionSub } : {}),
    },
    orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
  });
}

export async function getSiteLastUpdated() {
  try {
    const result = await prisma.expo.aggregate({
      where: { isPublished: true },
      _max: { updatedAt: true },
    });

    return result._max.updatedAt;
  } catch {
    return null;
  }
}

export async function getRecentExposForRss(limit = 30) {
  try {
    return await prisma.expo.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}
