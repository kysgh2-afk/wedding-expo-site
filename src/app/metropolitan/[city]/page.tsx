import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegionPage } from "@/components/RegionPage";
import { METROPOLITAN_CITIES, type MetropolitanCity } from "@/lib/constants";
import { getPublishedExpos } from "@/lib/expos";
import { serializeExpos } from "@/lib/serialize-expos";
import { METROPOLITAN_SEO, SEO_METROPOLITAN_INDEX, buildPageMetadata } from "@/lib/regions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  return METROPOLITAN_CITIES.map((city) => ({ city: city.value }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const config = METROPOLITAN_SEO[city as MetropolitanCity];
  if (!config) return {};
  return buildPageMetadata(config);
}

export default async function MetropolitanCityPage({ params }: PageProps) {
  const { city } = await params;
  const config = METROPOLITAN_SEO[city as MetropolitanCity];

  if (!config) {
    notFound();
  }

  const expos = await getPublishedExpos(config.filter);

  return (
    <RegionPage
      config={config}
      expos={serializeExpos(expos)}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "광역시", href: SEO_METROPOLITAN_INDEX.path },
        { label: `${config.label} 웨딩박람회` },
      ]}
    />
  );
}
