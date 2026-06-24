import type { Metadata } from "next";
import { getPublishedExpos } from "@/lib/expos";
import { serializeExpos } from "@/lib/serialize-expos";
import { HomeJsonLd, SiteHeader } from "@/components/SiteHeader";
import { ExpoList } from "@/components/ExpoList";
import { InfoSections } from "@/components/InfoSections";
import { RegionNav } from "@/components/RegionNav";
import { RegionSeoLinks } from "@/components/RegionSeoLinks";
import { SEO_HOME, buildPageMetadata } from "@/lib/regions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(SEO_HOME);

export default async function HomePage() {
  const expos = await getPublishedExpos();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <HomeJsonLd expoCount={expos.length} />
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <RegionNav activePath="/" />
        <ExpoList expos={serializeExpos(expos)} />
        <RegionSeoLinks />
        <InfoSections />
      </main>
      <footer className="border-t border-rose-100 bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} 웨딩박람회 일정 모음 · 매주 업데이트
      </footer>
    </div>
  );
}
