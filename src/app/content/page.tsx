import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ContentList } from "@/components/ContentList";
import { RegionNav } from "@/components/RegionNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPublishedArticles } from "@/lib/articles";
import { serializeArticles } from "@/lib/serialize-articles";
import { SEO_CONTENT, buildPageMetadata } from "@/lib/regions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(SEO_CONTENT);

export default async function ContentIndexPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "홈", href: "/" },
            { label: "콘텐츠" },
          ]}
        />
        <RegionNav activePath="/content" />

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{SEO_CONTENT.h1}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{SEO_CONTENT.intro}</p>
          </div>
          <ContentList articles={serializeArticles(articles)} />
        </section>

        <div>
          <Link
            href="/"
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-100 hover:bg-rose-50"
          >
            박람회 일정 보기
          </Link>
        </div>
      </main>
      <footer className="border-t border-rose-100 bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} 웨딩박람회 일정 모음 · 매주 업데이트
      </footer>
    </div>
  );
}
