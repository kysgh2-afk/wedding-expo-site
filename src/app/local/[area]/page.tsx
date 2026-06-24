import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegionPage } from "@/components/RegionPage";
import { LOCAL_SUBREGIONS, type LocalSubregion } from "@/lib/constants";
import { getPublishedExpos } from "@/lib/expos";
import { LOCAL_SEO, SEO_LOCAL_INDEX, buildPageMetadata } from "@/lib/regions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ area: string }>;
};

export function generateStaticParams() {
  return LOCAL_SUBREGIONS.map((area) => ({ area: area.value }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params;
  const config = LOCAL_SEO[area as LocalSubregion];
  if (!config) return {};
  return buildPageMetadata(config);
}

export default async function LocalAreaPage({ params }: PageProps) {
  const { area } = await params;
  const config = LOCAL_SEO[area as LocalSubregion];

  if (!config) {
    notFound();
  }

  const expos = await getPublishedExpos(config.filter);

  return (
    <RegionPage
      config={config}
      expos={expos}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "지방", href: SEO_LOCAL_INDEX.path },
        { label: `${config.label} 웨딩박람회` },
      ]}
    />
  );
}
