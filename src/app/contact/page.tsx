import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { SEO_CONTACT, buildLegalMetadata, getContactEmail } from "@/lib/legal";

export const metadata: Metadata = buildLegalMetadata(SEO_CONTACT);

export default function ContactPage() {
  const contactEmail = getContactEmail();

  return (
    <LegalPageLayout
      title={SEO_CONTACT.h1}
      description={SEO_CONTACT.intro}
      path={SEO_CONTACT.path}
      breadcrumbLabel="문의하기"
    >
      <section>
        <h2>문의 안내</h2>
        <p>
          사이트 이용, 일정 정보 오류, 제휴·광고, 개인정보 관련 요청을 아래 방법으로 보내 주세요.
          영업일 기준 3~5일 내 답변을 드리겠습니다.
        </p>
      </section>

      <section>
        <h2>이메일 문의</h2>
        <p>
          아래 이메일로 문의해 주세요.
        </p>
        <p>
          <a href={`mailto:${contactEmail}`} className="font-semibold text-rose-700 hover:underline">
            {contactEmail}
          </a>
        </p>
      </section>

      <section>
        <h2>자주 받는 문의</h2>
        <ul>
          <li>특정 박람회 일정·장소가 잘못된 경우 (행사명, 날짜, 링크 포함)</li>
          <li>신규 박람회 등록 요청</li>
          <li>개인정보 열람·삭제 요청</li>
          <li>광고·제휴 문의</li>
        </ul>
      </section>

      <section>
        <h2>개인정보 관련 요청</h2>
        <p>
          개인정보 처리와 관련한 요청은 「개인정보처리방침」을 함께 확인해 주시고, 본인 확인이
          가능한 내용으로 문의해 주세요.
        </p>
      </section>
    </LegalPageLayout>
  );
}
