import type { Metadata } from "next";
import { getPublishedExpos } from "@/lib/expos";
import { serializeExpos } from "@/lib/serialize-expos";
import { HomeJsonLd, SiteHeader } from "@/components/SiteHeader";
import { ExpoList } from "@/components/ExpoList";
import { FAQ_ITEMS, HomeFaqJsonLd, InfoSections } from "@/components/InfoSections";
import { SiteFooter } from "@/components/SiteFooter";
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
      <HomeFaqJsonLd items={FAQ_ITEMS} />
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <RegionNav activePath="/" />
        <ExpoList expos={serializeExpos(expos)} />
        <RegionSeoLinks />
        <InfoSections />
      </main>
      <SiteFooter />
    </div>
  );
}
