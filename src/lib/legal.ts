import type { Metadata } from "next";
import { getSiteUrl, SITE_NAME } from "@/lib/regions";

export type LegalPageSeo = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
};

export const SEO_ABOUT: LegalPageSeo = {
  path: "/about",
  h1: "사이트 소개",
  title: "사이트 소개 | 웨딩박람회 일정 모음",
  description:
    "웨딩박람회 일정 모음 사이트의 운영 목적, 제공 정보, 업데이트 정책을 안내합니다.",
  keywords: ["웨딩박람회 일정", "사이트 소개", "웨딩박람회 정보"],
  intro: "전국 웨딩박람회 일정을 한곳에서 확인할 수 있도록 운영하는 정보 제공 사이트입니다.",
};

export const SEO_PRIVACY: LegalPageSeo = {
  path: "/privacy",
  h1: "개인정보처리방침",
  title: "개인정보처리방침 | 웨딩박람회 일정 모음",
  description:
    "웨딩박람회 일정 모음 사이트의 개인정보 수집·이용, 쿠키, 광고, 문의 절차를 안내합니다.",
  keywords: ["개인정보처리방침", "웨딩박람회", "쿠키 정책"],
  intro: "본 사이트는 이용자의 개인정보를 소중히 여기며 관련 법령을 준수합니다.",
};

export const SEO_CONTACT: LegalPageSeo = {
  path: "/contact",
  h1: "문의하기",
  title: "문의하기 | 웨딩박람회 일정 모음",
  description:
    "웨딩박람회 일정 모음 사이트에 대한 문의, 제휴, 오류 신고, 개인정보 관련 요청을 안내합니다.",
  keywords: ["문의", "고객센터", "웨딩박람회 일정"],
  intro: "사이트 이용, 일정 정보, 개인정보 관련 문의를 접수합니다.",
};

export const LEGAL_PAGES = [SEO_ABOUT, SEO_PRIVACY, SEO_CONTACT];

export const SITE_CONTACT_EMAIL = "kysgh2@naver.com";

export function getContactEmail() {
  return (
    process.env.CONTACT_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
    SITE_CONTACT_EMAIL
  );
}

export function buildLegalMetadata(page: LegalPageSeo): Metadata {
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
