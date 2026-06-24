import type { Metadata } from "next";
import { RegionPage } from "@/components/RegionPage";
import { LOCAL_SUBREGIONS } from "@/lib/constants";
import { getPublishedExpos } from "@/lib/expos";
import { LOCAL_SEO, SEO_LOCAL_INDEX, buildPageMetadata } from "@/lib/regions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(SEO_LOCAL_INDEX);

export default async function LocalIndexPage() {
  const expos = await getPublishedExpos(SEO_LOCAL_INDEX.filter);

  return (
    <RegionPage
      config={SEO_LOCAL_INDEX}
      expos={expos}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "지방 웨딩박람회" },
      ]}
      showSubNav
      subLinks={LOCAL_SUBREGIONS.map((area) => ({
        href: LOCAL_SEO[area.value].path,
        label: area.label,
      }))}
    />
  );
}
