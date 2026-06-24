import type { Metadata } from "next";
import { RegionPage } from "@/components/RegionPage";
import { METROPOLITAN_CITIES } from "@/lib/constants";
import { getPublishedExpos } from "@/lib/expos";
import { METROPOLITAN_SEO, SEO_METROPOLITAN_INDEX, buildPageMetadata } from "@/lib/regions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(SEO_METROPOLITAN_INDEX);

export default async function MetropolitanIndexPage() {
  const expos = await getPublishedExpos(SEO_METROPOLITAN_INDEX.filter);

  return (
    <RegionPage
      config={SEO_METROPOLITAN_INDEX}
      expos={expos}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "광역시 웨딩박람회" },
      ]}
      showSubNav
      subLinks={METROPOLITAN_CITIES.map((city) => ({
        href: METROPOLITAN_SEO[city.value].path,
        label: city.label,
      }))}
    />
  );
}
