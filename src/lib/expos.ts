import { prisma } from "@/lib/prisma";

type ExpoFilter = {
  regionGroup: string;
  regionSub?: string;
};

/** Inclusive end-of-day in Asia/Seoul: hide expos only after their end date has passed. */
export function getActiveExpoDateFilter() {
  const todayInSeoul = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return {
    endDate: { gte: new Date(`${todayInSeoul}T00:00:00+09:00`) },
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

function logExpoQueryError(scope: string, error: unknown) {
  console.error(`[${scope}] Database query failed:`, error);
}

export async function getPublishedExpos(filter?: ExpoFilter) {
  try {
    return await prisma.expo.findMany({
      where: getPublishedActiveWhere(filter),
      orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
    });
  } catch (error) {
    logExpoQueryError("getPublishedExpos", error);
    return [];
  }
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
