import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/regions";

export const CONTENT_INDEX = {
  path: "/content",
  title: "웨딩 콘텐츠 | 결혼 준비·비용·웨딩홀 가이드",
  description: "결혼비용, 웨딩홀, 스드메, 예물, 신혼여행까지 예비부부에게 필요한 결혼 준비 정보를 한곳에서 확인하세요.",
  keywords: ["결혼 준비", "웨딩 콘텐츠", "결혼비용", "웨딩홀", "스드메", "예비부부"],
};

export const COST_CONTENT_CARD = {
  slug: "wedding-cost",
  href: "/cost",
  title: "2026 결혼비용 가이드",
  excerpt: "지역·시기·예식장·스드메 항목별 실제 계약 통계로 결혼 준비 예산을 비교해 보세요.",
  category: "결혼비용",
  publishedAt: new Date("2026-05-01T00:00:00Z"),
  coverImageUrl: null,
};

export function buildContentIndexMetadata(): Metadata {
  return {
    title: CONTENT_INDEX.title,
    description: CONTENT_INDEX.description,
    keywords: CONTENT_INDEX.keywords,
    alternates: { canonical: CONTENT_INDEX.path },
    openGraph: { type: "website", url: `${getSiteUrl()}${CONTENT_INDEX.path}`, title: CONTENT_INDEX.title, description: CONTENT_INDEX.description },
  };
}
