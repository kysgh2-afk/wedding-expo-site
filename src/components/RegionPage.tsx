import Link from "next/link";
import { ExpoCard } from "@/components/ExpoCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RegionNav } from "@/components/RegionNav";
import { RegionSeoLinks } from "@/components/RegionSeoLinks";
import { buildEventListJsonLd } from "@/lib/regions";

type RegionPageConfig = {
  path: string;
  label: string;
  h1: string;
  description: string;
  intro: string;
  keywords: string[];
};

type ExpoItem = {
  id: string;
  title: string;
  location: string;
  regionGroup: string;
  regionSub: string;
  regionLabel: string;
  startDate: Date;
  endDate: Date;
  status: string;
  imageUrl: string | null;
  linkUrl: string | null;
};

type RegionPageProps = {
  config: RegionPageConfig;
  expos: ExpoItem[];
  breadcrumbs: { label: string; href?: string }[];
  showSubNav?: boolean;
  subLinks?: { href: string; label: string }[];
};

export function RegionPage({
  config,
  expos,
  breadcrumbs,
  showSubNav = false,
  subLinks = [],
}: RegionPageProps) {
  const jsonLd = buildEventListJsonLd(
    {
      ...config,
      title: config.h1,
      filter: { regionGroup: "" },
    },
    expos,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <JsonLd data={jsonLd} />
      <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Breadcrumbs items={breadcrumbs} />
              <div>
                <p className="text-sm font-medium text-rose-500">매주 업데이트</p>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {config.h1}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  {config.intro}
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="shrink-0 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
            >
              관리자
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <RegionNav activePath={config.path} />

        {showSubNav && subLinks.length > 0 ? (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
            <h2 className="text-lg font-bold text-slate-900">세부 지역 선택</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {subLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                >
                  {link.label} 웨딩박람회
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section aria-label={`${config.label} 웨딩박람회 목록`}>
          {expos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center text-slate-500">
              현재 등록된 {config.label} 웨딩박람회 일정이 없습니다. 곧 업데이트됩니다.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {expos.map((expo) => (
                <ExpoCard key={expo.id} expo={expo} />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-rose-100">
          <h2 className="text-lg font-bold text-slate-900">
            {config.label} 웨딩박람회 방문 안내
          </h2>
          <p className="mt-3">
            {config.label} 지역 웨딩박람회는 스드메(스튜디오·드레스·메이크업), 웨딩홀, 허니문,
            예물 등 결혼 준비 항목을 한자리에서 비교할 수 있는 행사입니다. 사전 신청 시 무료초대권
            발급과 웰컴 기프트 혜택을 받는 경우가 많으니 일정 확인 후 미리 신청하세요.
          </p>
          <p className="mt-3">
            관련 검색어: {config.keywords.join(", ")}
          </p>
        </section>

        <RegionSeoLinks />
      </main>

      <footer className="border-t border-rose-100 bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} 웨딩박람회 일정 모음 · {config.label} · 매주 업데이트
      </footer>
    </div>
  );
}
