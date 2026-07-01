import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CostNav } from "@/components/cost/CostNav";
import { RegionNav } from "@/components/RegionNav";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO_COST_INDEX, type CostPageSeo } from "@/lib/wedding-cost";
import { getSiteUrl, SITE_NAME } from "@/lib/regions";

type CostPageLayoutProps = {
  page: CostPageSeo;
  sourceNote?: string;
  children: ReactNode;
};

export function CostPageLayout({ page, sourceNote, children }: CostPageLayoutProps) {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}${page.path}#webpage`,
    url: `${siteUrl}${page.path}`,
    name: page.h1,
    description: page.description,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };

  const breadcrumbs =
    page.path === "/cost"
      ? [{ label: "홈", href: "/" }, { label: "결혼비용" }]
      : [
          { label: "홈", href: "/" },
          { label: "결혼비용", href: "/cost" },
          { label: page.h1 },
        ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <JsonLd data={jsonLd} />
      <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-5 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div>
            <p className="text-sm font-medium text-rose-500">2026년 결혼비용 통계</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{page.h1}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{page.intro}</p>
            {sourceNote ? (
              <p className="mt-2 text-xs text-slate-400">출처: {sourceNote}</p>
            ) : null}
          </div>
          <RegionNav activePath={page.path} />
          {page.path !== SEO_COST_INDEX.path ? (
            <CostNav activePath={page.path} />
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
