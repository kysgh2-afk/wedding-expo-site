import type { Expo } from "@prisma/client";
import { formatKoreanDateRange } from "@/lib/date";
import { STATUS_OPTIONS } from "@/lib/constants";
import { SEO_HOME, getSiteUrl, SITE_NAME } from "@/lib/regions";

const RSS_ITEM_LIMIT = 30;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(date: Date) {
  return date.toUTCString();
}

export function getExpoRegionPath(expo: Pick<Expo, "regionGroup" | "regionSub">) {
  if (expo.regionGroup === "seoul") return "/seoul";
  if (expo.regionGroup === "gyeonggi") return "/gyeonggi";
  if (expo.regionGroup === "metropolitan") {
    return expo.regionSub ? `/metropolitan/${expo.regionSub}` : "/metropolitan";
  }
  if (expo.regionGroup === "local") {
    return expo.regionSub ? `/local/${expo.regionSub}` : "/local";
  }
  return "/";
}

function getStatusLabel(status: string) {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status;
}

function buildExpoDescription(expo: Expo) {
  const dateText = formatKoreanDateRange(expo.startDate, expo.endDate);
  const statusLabel = getStatusLabel(expo.status);
  const tagText = expo.tags.length > 0 ? ` · ${expo.tags.map((tag) => `#${tag}`).join(" ")}` : "";
  return `${expo.regionLabel} · ${expo.location} · ${dateText} · ${statusLabel}${tagText}`;
}

function buildExpoItemLink(expo: Expo, siteUrl: string) {
  if (expo.linkUrl?.trim()) {
    return expo.linkUrl.trim();
  }
  return `${siteUrl}${getExpoRegionPath(expo)}`;
}

type BuildRssFeedOptions = {
  expos: Expo[];
  lastBuildDate: Date;
};

export function buildRssFeed({ expos, lastBuildDate }: BuildRssFeedOptions) {
  const siteUrl = getSiteUrl();
  const feedUrl = `${siteUrl}/rss.xml`;

  const items = expos.slice(0, RSS_ITEM_LIMIT).map((expo) => {
    const link = buildExpoItemLink(expo, siteUrl);
    const description = buildExpoDescription(expo);
    const guid = `${siteUrl}/#expo-${expo.id}`;

    return `
    <item>
      <title>${escapeXml(expo.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
      <pubDate>${toRfc822(expo.updatedAt)}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(SEO_HOME.description)}</description>
    <language>ko</language>
    <lastBuildDate>${toRfc822(lastBuildDate)}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${items.join("")}
  </channel>
</rss>`;
}
