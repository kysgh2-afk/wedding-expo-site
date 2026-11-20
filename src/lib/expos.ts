import { getExpoClickCounts, rankExposByClicks } from "@/lib/clicks";
import { isExpoCurrent } from "@/lib/expo-calendar.mjs";
import {
  getAllExpos,
  getGeneratedExpoUpdatedAt,
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
    .filter((expo) => expo.isPublished && isExpoCurrent(expo.endDate, now))
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

export async function getScheduleSourceUpdatedAt() {
  return getGeneratedExpoUpdatedAt();
}

export async function getRecentExposForRss(limit = 30) {
  return (await getStoredExpos()).slice(0, limit);
}

export async function getPopularExpos(limit = 10) {
  try {
    const [counts, expos] = await Promise.all([getExpoClickCounts(), getStoredExpos()]);
    const ranked = rankExposByClicks(
      expos.map((expo) => ({ ...expo, clickCount: counts.get(expo.id) ?? 0 })), limit,
    );
    return { expos: ranked, status: ranked.length ? "ready" as const : "empty" as const };
  } catch (error) {
    console.error("[getPopularExpos] Click ranking unavailable:", error);
    return { expos: [], status: "unavailable" as const };
  }
}

export type { ExpoRecord };
