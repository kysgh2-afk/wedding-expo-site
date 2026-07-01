import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/regions";

export type CostPageSeo = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
};

export const SEO_COST_INDEX: CostPageSeo = {
  path: "/cost",
  h1: "결혼비용 가이드",
  title: "결혼비용 가이드 | 지역·시기·예식장·스드메 가격",
  description:
    "지역별 결혼서비스 계약 금액, 예식 시기별 가격, 예식장 대관료, 스드메 패키지 가격을 2026년 기준 통계로 확인하세요.",
  keywords: ["결혼비용", "웨딩 비용", "예식장 대관료", "스드메 패키지 가격", "결혼 준비 비용"],
  intro:
    "지역·예식 시기·예식장·스드메 항목별 평균 계약 금액을 한눈에 비교할 수 있습니다. 박람회 방문 전 예산을 잡는 데 참고하세요.",
};

export const SEO_COST_REGIONAL: CostPageSeo = {
  path: "/cost/regional",
  h1: "지역별 결혼서비스 계약 금액",
  title: "지역별 결혼비용 | 대관료·식비·스드메 계약 금액 (2026)",
  description:
    "전국·수도권·지역별 결혼서비스 총 계약 금액과 대관료, 장식비, 식비, 스드메 비중을 2026년 5월 통계로 확인하세요.",
  keywords: ["지역별 결혼비용", "수도권 결혼비용", "서울 웨딩 비용", "식비 결혼비용"],
  intro:
    "대관료·장식비·식비·스드메 항목별 계약 금액과 비중을 지역별로 비교합니다. (단위: 만원, 2026년 5월 기준)",
};

export const SEO_COST_SEASON: CostPageSeo = {
  path: "/cost/season",
  h1: "예식 시기별 계약 가격",
  title: "예식 시기별 결혼비용 | 월별 예식장·스드메 가격",
  description:
    "2026~2027년 예식 월별 예식장·스드메 평균 계약 금액과 계약 건수를 비교해 성수기·비수기 예산을 파악하세요.",
  keywords: ["예식 시기별 비용", "결혼 성수기", "웨딩 성수기", "월별 결혼비용"],
  intro:
    "예식 월에 따라 예식장·스드메 계약 금액이 어떻게 달라지는지 확인할 수 있습니다. (단위: 만원)",
};

export const SEO_COST_VENUE: CostPageSeo = {
  path: "/cost/venue",
  h1: "예식장 대관료 가격",
  title: "예식장 대관료 가격 | 지역별 백분위·평균 (2026)",
  description:
    "전국·지역별 예식장 대관료 하위·중간·상위 가격대와 평균을 2026년 5월 통계로 확인하세요.",
  keywords: ["예식장 대관료", "웨딩홀 대관료", "예식장 비용", "웨딩홀 가격"],
  intro:
    "예식장 대관료의 가격 분포(하위 10%~상위 10%)와 지역별 평균을 비교합니다. (단위: 만원, 2026년 5월 기준)",
};

export const SEO_COST_SDME: CostPageSeo = {
  path: "/cost/sdme",
  h1: "스드메 패키지 가격",
  title: "스드메 패키지 가격 | 지역별 스튜디오·드레스·메이크업 (2026)",
  description:
    "전국·지역별 스드메 패키지 하위·중간·상위 가격대와 평균을 2026년 5월 통계로 확인하세요.",
  keywords: ["스드메 패키지 가격", "스드메 비용", "웨딩 촬영 가격", "웨딩드레스 패키지"],
  intro:
    "스튜디오·드레스·메이크업 패키지의 가격 분포와 지역별 평균을 비교합니다. (단위: 만원, 2026년 5월 기준)",
};

export const ALL_COST_PAGES = [
  SEO_COST_INDEX,
  SEO_COST_REGIONAL,
  SEO_COST_SEASON,
  SEO_COST_VENUE,
  SEO_COST_SDME,
];

export const COST_SUB_PAGES = [
  SEO_COST_REGIONAL,
  SEO_COST_SEASON,
  SEO_COST_VENUE,
  SEO_COST_SDME,
];

export function formatManwon(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return `${value.toLocaleString("ko-KR")}만원`;
}

export function formatPercent(value: number) {
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}%`;
}

export function formatCount(value: number) {
  return `${value.toLocaleString("ko-KR")}건`;
}

export function buildCostMetadata(page: CostPageSeo): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${page.path}`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title: page.title,
      description: page.description,
    },
    robots: { index: true, follow: true },
  };
}
