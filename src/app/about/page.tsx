import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { SEO_ABOUT, buildLegalMetadata } from "@/lib/legal";
import { SITE_NAME } from "@/lib/regions";

export const metadata: Metadata = buildLegalMetadata(SEO_ABOUT);

export default function AboutPage() {
  return (
    <LegalPageLayout
      title={SEO_ABOUT.h1}
      description={SEO_ABOUT.intro}
      path={SEO_ABOUT.path}
      breadcrumbLabel="사이트 소개"
    >
      <section>
        <h2>운영 목적</h2>
        <p>
          {SITE_NAME}은 예비 신혼부부가 전국 웨딩박람회·웨딩페어 일정을 지역별로 쉽게 찾고,
          무료초대권 신청 링크까지 빠르게 확인할 수 있도록 돕는 정보 제공 사이트입니다.
        </p>
      </section>

      <section>
        <h2>제공 정보</h2>
        <ul>
          <li>서울, 경기, 광역시, 지방 권역별 웨딩박람회 일정</li>
          <li>행사 장소, 기간, 모집 상태, 신청 링크</li>
          <li>박람회 방문 팁, FAQ 등 결혼 준비 참고 정보</li>
        </ul>
      </section>

      <section>
        <h2>업데이트 정책</h2>
        <p>
          박람회 일정은 주최사 공지에 따라 수시로 변동될 수 있습니다. 본 사이트는 매주 정기적으로
          일정을 점검·갱신하며, 최종 신청 및 방문 전에는 반드시 각 행사 공식 페이지에서 일정과
          혜택을 다시 확인하시기 바랍니다.
        </p>
      </section>

      <section>
        <h2>면책 안내</h2>
        <p>
          본 사이트는 정보 제공 목적으로 운영되며, 박람회 주최·계약·환불 등은 각 행사 주최사와
          이용자 간의 관계에서 이루어집니다. 게시된 정보의 정확성을 위해 노력하나, 변경 사항이
          즉시 반영되지 않을 수 있습니다.
        </p>
      </section>

      <section>
        <h2>관련 페이지</h2>
        <p>
          <Link href="/" className="text-rose-700 hover:underline">
            전국 웨딩박람회 일정 보기
          </Link>
          {" · "}
          <Link href="/privacy" className="text-rose-700 hover:underline">
            개인정보처리방침
          </Link>
          {" · "}
          <Link href="/contact" className="text-rose-700 hover:underline">
            문의하기
          </Link>
        </p>
      </section>
    </LegalPageLayout>
  );
}
