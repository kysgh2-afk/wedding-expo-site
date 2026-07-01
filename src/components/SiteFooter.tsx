import Link from "next/link";
import { Suspense } from "react";
import { formatKoreanDate } from "@/lib/date";
import { getSiteLastUpdated } from "@/lib/expos";
import { SITE_NAME } from "@/lib/regions";

const FOOTER_LINKS = [
  { href: "/cost", label: "결혼비용" },
  { href: "/about", label: "사이트 소개" },
  { href: "/contact", label: "문의하기" },
  { href: "/privacy", label: "개인정보처리방침" },
] as const;

async function LastUpdatedLine() {
  const lastUpdated = await getSiteLastUpdated();

  return (
    <p className="text-center text-sm text-slate-500">
      © {new Date().getFullYear()} {SITE_NAME}
      {lastUpdated ? (
        <> · 최종 업데이트 {formatKoreanDate(lastUpdated)}</>
      ) : (
        <> · 매주 업데이트</>
      )}
    </p>
  );
}

function LastUpdatedFallback() {
  return (
    <p className="text-center text-sm text-slate-500">
      © {new Date().getFullYear()} {SITE_NAME} · 매주 업데이트
    </p>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-rose-100 bg-white">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8 sm:px-6">
        <nav aria-label="푸터 메뉴" className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-600 hover:text-rose-700">
              {link.label}
            </Link>
          ))}
        </nav>
        <Suspense fallback={<LastUpdatedFallback />}>
          <LastUpdatedLine />
        </Suspense>
        <p className="text-center text-xs text-slate-400">
          본 페이지는 파트너 제휴 링크를 통해 수익이 발생할 수 있습니다.
        </p>
      </div>
    </footer>
  );
}
