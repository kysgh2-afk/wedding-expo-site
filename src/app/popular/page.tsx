import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PopularRankingList } from "@/components/PopularRankingList";
import { RegionNav } from "@/components/RegionNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getPopularExpos } from "@/lib/expos";
import { buildPopularMetadata, SEO_POPULAR } from "@/lib/popular";
import { getSiteUrl, SITE_NAME } from "@/lib/regions";
import { serializeExpos } from "@/lib/serialize-expos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPopularMetadata();

export default async function PopularPage() {
  const ranking = await getPopularExpos(10);
  const serialized = serializeExpos(ranking.expos);
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SEO_POPULAR.h1,
    description: SEO_POPULAR.description,
    numberOfItems: serialized.length,
    itemListElement: serialized.map((expo, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: expo.title,
      url: expo.linkUrl || `${siteUrl}/`,
    })),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      {ranking.status === "ready" ? <JsonLd data={jsonLd} /> : null}
      <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-5 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "홈", href: "/" },
              { label: "웨딩박람회 순위" },
            ]}
          />
          <div>
            <p className="text-sm font-medium text-rose-500">저장된 클릭 집계 기준 순위</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {SEO_POPULAR.h1}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              {SEO_POPULAR.intro}
            </p>
          </div>
          <RegionNav activePath={SEO_POPULAR.path} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        {ranking.status === "unavailable" ? (
          <p role="status" className="rounded-2xl bg-white p-8 text-slate-600">클릭 집계를 일시적으로 불러올 수 없습니다. 잘못된 순위를 표시하지 않기 위해 순위 노출을 잠시 중단했습니다.</p>
        ) : ranking.status === "empty" ? (
          <p role="status" className="rounded-2xl bg-white p-8 text-slate-600">아직 클릭이 집계된 진행 중 박람회가 없습니다. 클릭이 저장되면 순위가 표시됩니다.</p>
        ) : <PopularRankingList expos={serialized} />}

        <section className="rounded-2xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-rose-100">
          <h2 className="text-lg font-bold text-slate-900">순위 산정 기준</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>공개된 전국 웨딩박람회 중 <strong>방문자 클릭 수</strong>가 많은 순서입니다.</li>
            <li>박람회 카드·신청 링크 클릭을 저장하며, 같은 브라우저에서 같은 박람회는 한국시간 하루 1회 집계합니다. 쿠키 삭제·다른 기기 사용 시 별도 집계될 수 있습니다.</li>
            <li>클릭이 저장된 진행 중 박람회만 표시하며, 페이지를 새로 불러오면 최신 집계를 반영합니다.</li>
            <li>이 순위 페이지에서는 매주 토~일 개최 여부와 관계없이 클릭 수로 정렬합니다. 홈페이지·지역별 일정의 정렬 규칙은 유지합니다.</li>
            <li>클릭 수가 같으면 일정 시작일·고유 식별자 순으로 표시합니다.</li>
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
