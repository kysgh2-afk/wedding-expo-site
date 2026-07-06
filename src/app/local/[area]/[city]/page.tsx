import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegionPage } from "@/components/RegionPage";
import type { LocalSubregion } from "@/lib/constants";
import { getPublishedExpos } from "@/lib/expos";
import { filterLocalExposByCity } from "@/lib/local-city-filter";
import {
  LOCAL_CITY_SEO,
  LOCAL_SEO,
  SEO_LOCAL_INDEX,
  getLocalCityConfig,
  getLocalCitySubLinks,
  buildPageMetadata,
} from "@/lib/regions";
import { serializeExpos } from "@/lib/serialize-expos";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ area: string; city: string }>;
};

export function generateStaticParams() {
  return Object.entries(LOCAL_CITY_SEO).flatMap(([area, cities]) =>
    Object.keys(cities).map((city) => ({ area, city })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area, city } = await params;
  const config = getLocalCityConfig(area, city);
  if (!config) return {};
  return buildPageMetadata(config);
}

export default async function LocalCityPage({ params }: PageProps) {
  const { area, city } = await params;
  const parentConfig = LOCAL_SEO[area as LocalSubregion];
  const config = getLocalCityConfig(area, city);

  if (!parentConfig || !config) {
    notFound();
  }

  const expos = await getPublishedExpos(parentConfig.filter);
  const filteredExpos = filterLocalExposByCity(expos, area as LocalSubregion, city);

  return (
    <RegionPage
      config={config}
      expos={serializeExpos(filteredExpos)}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "지방", href: SEO_LOCAL_INDEX.path },
        { label: parentConfig.label, href: parentConfig.path },
        { label: `${config.label} 웨딩박람회` },
      ]}
      showSubNav
      subLinks={getLocalCitySubLinks(area as LocalSubregion)}
    />
  );
}
