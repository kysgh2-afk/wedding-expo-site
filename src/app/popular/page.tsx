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
  const expos = await getPopularExpos(10);
  const serialized = serializeExpos(expos);
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
      <JsonLd data={jsonLd} />
      <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-5 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "홈", href: "/" },
              { label: "인기 순위" },
            ]}
          />
          <div>
            <p className="text-sm font-medium text-rose-500">클릭 수 기준 실시간 순위</p>
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
        <PopularRankingList expos={serialized} />

        <section className="rounded-2xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-rose-100">
          <h2 className="text-lg font-bold text-slate-900">순위 산정 기준</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>공개된 전국 웨딩박람회 중 <strong>방문자 클릭 수</strong>가 많은 순서입니다.</li>
            <li>박람회 카드·신청 링크 클릭 시 집계되며, 순위는 수시로 갱신됩니다.</li>
            <li>클릭 수가 같으면 정렬 순서·일정 시작일 순으로 정합니다.</li>
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
