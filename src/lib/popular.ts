import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/regions";

export const SEO_POPULAR = {
  path: "/popular",
  h1: "인기 웨딩박람회 TOP 10",
  title: "인기 웨딩박람회 순위 TOP10 | 클릭 기준 인기 박람회",
  description:
    "전국 웨딩박람회 중 방문자 클릭 수 기준 인기 TOP 10을 확인하세요. 서울·경기·지방 인기 박람회를 한눈에 비교할 수 있습니다.",
  keywords: [
    "인기 웨딩박람회",
    "웨딩박람회 순위",
    "웨딩박람회 TOP10",
    "인기 웨딩페어",
  ],
  intro:
    "사이트 방문자들이 가장 많이 클릭한 웨딩박람회 10곳입니다. 실시간 클릭 수를 기준으로 순위가 갱신됩니다.",
};

export function buildPopularMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${SEO_POPULAR.path}`;

  return {
    title: SEO_POPULAR.title,
    description: SEO_POPULAR.description,
    keywords: SEO_POPULAR.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title: SEO_POPULAR.title,
      description: SEO_POPULAR.description,
    },
    robots: { index: true, follow: true },
  };
}
