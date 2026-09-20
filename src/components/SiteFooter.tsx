import Link from "next/link";
import { Suspense } from "react";
import scheduleData from "@/data/expos.generated.json";
import { SITE_NAME } from "@/lib/regions";

const FOOTER_LINKS = [
  { href: "/content", label: "웨딩 콘텐츠" },
  { href: "/about", label: "사이트 소개" },
  { href: "/contact", label: "문의하기" },
  { href: "/privacy", label: "개인정보처리방침" },
] as const;

async function LastUpdatedLine() {
  let generatedAt = scheduleData.generatedAt;
  const liveDataUrl = process.env.EXPO_LIVE_DATA_URL?.trim();
  if (liveDataUrl) {
    try {
      const liveUrl = new URL(liveDataUrl);
      liveUrl.searchParams.set(
        "weddinglast_refresh",
        String(Math.floor(Date.now() / 300_000)),
      );
      const response = await fetch(liveUrl, { cache: "no-store" });
      if (response.ok) {
        const value = (await response.json()) as { generatedAt?: unknown };
        if (
          typeof value.generatedAt === "string" &&
          Number.isFinite(Date.parse(value.generatedAt))
        ) {
          generatedAt = value.generatedAt;
        }
      }
    } catch {
      // Keep the bundled timestamp when the live feed is temporarily unavailable.
    }
  }
  const lastUpdated = new Date(generatedAt);
  const stale = Date.now() - lastUpdated.getTime() > 24 * 3600000;

  return (
    <p className="text-center text-sm text-slate-500">
      © {new Date().getFullYear()} {SITE_NAME}
      {lastUpdated ? (
        <> · 일정 확인 {lastUpdated.toLocaleString('ko-KR', {timeZone:'Asia/Seoul', hour12:false})} (한국시간){stale ? ' · 갱신 지연: 방문 전 행사 일정을 확인해 주세요.' : ''}</>
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
