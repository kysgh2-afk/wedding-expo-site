import { getExpoClickCounts } from "@/lib/clicks";
import {
  getAllExpos,
  getExpoStoreUpdatedAt,
  type ExpoRecord,
} from "@/lib/expo-store";
type ExpoFilter = {
  regionGroup: string;
  regionSub?: string;
};

async function getStoredExpos(filter?: ExpoFilter, includeClickCounts = false) {
  const now = new Date();
  const clickCounts = includeClickCounts
    ? await getExpoClickCounts().catch((error) => {
        console.error("[getStoredExpos] Click query failed:", error);
        return new Map<string, number>();
      })
    : new Map<string, number>();

  return (await getAllExpos())
    .filter((expo) => expo.isPublished && new Date(expo.endDate) >= now)
    .filter((expo) => !filter?.regionGroup || expo.regionGroup === filter.regionGroup)
    .filter((expo) => !filter?.regionSub || expo.regionSub === filter.regionSub)
    .map((expo) => ({
      ...expo,
      clickCount: clickCounts.get(expo.id) ?? expo.clickCount,
    }))
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export async function getPublishedExpos(filter?: ExpoFilter) {
  return getStoredExpos(filter, true);
}

export async function getSiteLastUpdated() {
  return getExpoStoreUpdatedAt();
}

export async function getRecentExposForRss(limit = 30) {
  return (await getStoredExpos()).slice(0, limit);
}

export async function getPopularExpos(limit = 10) {
  const expos = await getStoredExpos(undefined, true);

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

export type { ExpoRecord };
