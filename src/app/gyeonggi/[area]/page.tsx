import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegionPage } from "@/components/RegionPage";
import { getPublishedExpos } from "@/lib/expos";
import { filterGyeonggiExposByArea } from "@/lib/gyeonggi-area-filter";
import { GYEONGGI_AREAS, GYEONGGI_AREA_SEO, type GyeonggiArea, SEO_GYEONGGI, buildPageMetadata } from "@/lib/regions";
import { serializeExpos } from "@/lib/serialize-expos";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ area: string }>;
};

export function generateStaticParams() {
  return GYEONGGI_AREAS.map((area) => ({ area: area.value }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params;
  const config = GYEONGGI_AREA_SEO[area as GyeonggiArea];
  if (!config) return {};
  return buildPageMetadata(config);
}

export default async function GyeonggiAreaPage({ params }: PageProps) {
  const { area } = await params;
  const config = GYEONGGI_AREA_SEO[area as GyeonggiArea];

  if (!config) {
    notFound();
  }

  const expos = await getPublishedExpos(SEO_GYEONGGI.filter);
  const filteredExpos = filterGyeonggiExposByArea(expos, area as GyeonggiArea);

  return (
    <RegionPage
      config={config}
      expos={serializeExpos(filteredExpos)}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "경기", href: SEO_GYEONGGI.path },
        { label: `${config.label} 웨딩박람회` },
      ]}
    />
  );
}

