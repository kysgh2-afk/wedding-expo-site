import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SEO_HOME, getSiteUrl, SITE_NAME } from "@/lib/regions";

export function SiteHeader() {
  return (
    <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div>
          <p className="text-sm font-medium text-rose-500">매주 업데이트</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            <Link href="/">{SEO_HOME.h1}</Link>
          </h1>
          <p className="mt-1 text-sm text-slate-500">{SEO_HOME.intro}</p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
        >
          관리자
        </Link>
      </div>
    </header>
  );
}

export function HomeJsonLd({ expoCount }: { expoCount: number }) {
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: SEO_HOME.description,
        inLanguage: "ko-KR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/#homepage`,
        url: siteUrl,
        name: SEO_HOME.h1,
        description: SEO_HOME.description,
        numberOfItems: expoCount,
      },
    ],
  };

  return <JsonLd data={data} />;
}
