import { prisma } from "@/lib/prisma";
import generatedExpoData from "@/data/expos.generated.json";
import { getSourceExpoClickCounts } from "@/lib/clicks";

type ExpoFilter = {
  regionGroup: string;
  regionSub?: string;
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

async function getGeneratedExpos(filter?: ExpoFilter, includeClickCounts = false) {
  const now = new Date();
  const clickCounts = includeClickCounts
    ? await getSourceExpoClickCounts().catch((error) => {
        console.error("[getGeneratedExpos] Click query failed:", error);
        return new Map<string, number>();
      })
    : new Map<string, number>();

  return generatedExpoData.expos
    .filter((expo) => expo.isPublished && new Date(expo.endDate) >= now)
    .filter((expo) => !filter?.regionGroup || expo.regionGroup === filter.regionGroup)
    .filter((expo) => !filter?.regionSub || expo.regionSub === filter.regionSub)
    .map((expo) => ({
      ...expo,
      clickCount: clickCounts.get(expo.id) ?? expo.clickCount,
      startDate: new Date(expo.startDate),
      endDate: new Date(expo.endDate),
      createdAt: new Date(generatedExpoData.generatedAt),
      updatedAt: new Date(generatedExpoData.generatedAt),
    }))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

function usesGeneratedData() {
  return process.env.EXPO_DATA_SOURCE !== "database";
}

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
  if (usesGeneratedData()) return getGeneratedExpos(filter, true);
  if (!hasDatabaseUrl()) return [];

  try {
    return await prisma.expo.findMany({
      where: getPublishedActiveWhere(filter),
      orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
    });
  } catch (error) {
    logExpoQueryError("getPublishedExpos", error);
    return getGeneratedExpos(filter, true);
  }
}

export async function getSiteLastUpdated() {
  if (usesGeneratedData()) return new Date(generatedExpoData.generatedAt);
  if (!hasDatabaseUrl()) return null;

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
  if (usesGeneratedData()) return (await getGeneratedExpos()).slice(0, limit);
  if (!hasDatabaseUrl()) return [];

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
  if (usesGeneratedData()) {
    const expos = await getGeneratedExpos(undefined, true);

    return expos
      .sort((a, b) => {
        const weeklyWeekendDiff =
          Number(Boolean(a.isWeeklyWeekend)) - Number(Boolean(b.isWeeklyWeekend));
        if (weeklyWeekendDiff !== 0) return weeklyWeekendDiff;
        if (b.clickCount !== a.clickCount) return b.clickCount - a.clickCount;
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.startDate.getTime() - b.startDate.getTime();
      })
      .slice(0, limit);
  }
  if (!hasDatabaseUrl()) return [];

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
