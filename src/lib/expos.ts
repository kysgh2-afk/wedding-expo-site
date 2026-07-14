import { prisma } from "@/lib/prisma";

type ExpoFilter = {
  regionGroup: string;
  regionSub?: string;
};

/** Inclusive end-of-day in Asia/Seoul: hide expos only after their end date has passed. */
export function getActiveExpoDateFilter() {
  const todayInSeoul = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Seoul",
  });

  return {
    endDate: { gte: new Date(todayInSeoul) },
  };
}

function getPublishedActiveWhere(filter?: ExpoFilter) {
  return {
    isPublished: true,
    ...getActiveExpoDateFilter(),
    ...(filter?.regionGroup ? { regionGroup: filter.regionGroup } : {}),
    ...(filter?.regionSub ? { regionSub: filter.regionSub } : {}),
  };
}

export async function getPublishedExpos(filter?: ExpoFilter) {
  return prisma.expo.findMany({
    where: getPublishedActiveWhere(filter),
    orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
  });
}

export async function getSiteLastUpdated() {
  try {
    const result = await prisma.expo.aggregate({
      where: getPublishedActiveWhere(),
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
      where: getPublishedActiveWhere(),
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getPopularExpos(limit = 10) {
  try {
    return await prisma.expo.findMany({
      where: getPublishedActiveWhere(),
      orderBy: [{ clickCount: "desc" }, { sortOrder: "asc" }, { startDate: "asc" }],
      take: limit,
    });
  } catch {
    return [];
  }
}
