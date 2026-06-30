import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { SEO_PRIVACY, buildLegalMetadata } from "@/lib/legal";
import { getSiteUrl, SITE_NAME } from "@/lib/regions";

export const metadata: Metadata = buildLegalMetadata(SEO_PRIVACY);

export default function PrivacyPage() {
  const siteUrl = getSiteUrl();
  const updatedAt = "2026년 6월 28일";

  return (
    <LegalPageLayout
      title={SEO_PRIVACY.h1}
      description={SEO_PRIVACY.intro}
      path={SEO_PRIVACY.path}
      breadcrumbLabel="개인정보처리방침"
    >
      <p className="text-sm text-slate-500">시행일: {updatedAt}</p>

      <section>
        <h2>1. 개인정보의 처리 목적</h2>
        <p>
          {SITE_NAME}({siteUrl})은 다음 목적을 위해 최소한의 개인정보를 처리할 수 있습니다.
        </p>
        <ul>
          <li>사이트 운영 및 문의 응대</li>
          <li>관리자 페이지 접근 통제(운영자 인증)</li>
          <li>서비스 품질 개선 및 통계 분석</li>
          <li>맞춤형 광고 제공(Google AdSense 등)</li>
        </ul>
      </section>

      <section>
        <h2>2. 수집하는 개인정보 항목</h2>
        <p>본 사이트는 원칙적으로 일반 방문자의 개인정보를 직접 수집하지 않습니다. 다만 아래 정보가 자동으로 생성·수집될 수 있습니다.</p>
        <ul>
          <li>접속 IP, 쿠키, 방문 일시, 브라우저/OS 정보, 참조 URL</li>
          <li>광고 식별자 및 광고 노출·클릭 관련 로그(Google 등 제3자 광고 서비스 이용 시)</li>
        </ul>
        <p>관리자 로그인 시에는 인증을 위한 세션 쿠키가 사용됩니다.</p>
      </section>

      <section>
        <h2>3. 개인정보의 보유 및 이용 기간</h2>
        <p>
          자동 수집 정보는 통계·보안 목적 달성 시 또는 관련 법령이 정한 기간까지 보관 후 파기합니다.
          문의 접수 기록은 처리 완료 후 최대 1년간 보관할 수 있습니다.
        </p>
      </section>

      <section>
        <h2>4. 쿠키(Cookie) 및 광고 안내</h2>
        <p>
          본 사이트는 이용자 경험 개선, 접속 통계, 광고 게재를 위해 쿠키를 사용할 수 있습니다.
          Google AdSense를 포함한 제3자 광고 사업자는 쿠키를 사용하여 이용자의 관심사에 기반한 광고를 게재할 수 있습니다.
        </p>
        <p>
          Google 광고 쿠키 사용에 대한 자세한 내용은{" "}
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            Google 광고 정책
          </a>
          을 참고하시기 바랍니다. 브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 일부 기능이 제한될 수 있습니다.
        </p>
      </section>

      <section>
        <h2>5. 제3자 제공 및 외부 링크</h2>
        <p>
          박람회 카드의 신청 링크는 각 주최사·행사 사이트로 연결됩니다. 외부 사이트에서의 개인정보 처리는 해당 사이트의 정책을 따릅니다.
          통계·광고 서비스 제공을 위해 Google 등 제3자 서비스와 비개인 식별 정보가 공유될 수 있습니다.
        </p>
      </section>

      <section>
        <h2>6. 이용자의 권리</h2>
        <p>
          이용자는 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 문의하기 페이지 또는 아래 연락처로 요청해 주세요.
        </p>
      </section>

      <section>
        <h2>7. 개인정보 보호책임자</h2>
        <p>
          사이트명: {SITE_NAME}
          <br />
          문의: <a href="/contact">문의하기 페이지</a>
        </p>
      </section>

      <section>
        <h2>8. 방침의 변경</h2>
        <p>
          본 개인정보처리방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 본 페이지에 공지합니다.
        </p>
      </section>
    </LegalPageLayout>
  );
}
