import type { Metadata } from "next";
import { RegionPage } from "@/components/RegionPage";
import { getPublishedExpos } from "@/lib/expos";
import { SEO_SEOUL, buildPageMetadata } from "@/lib/regions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(SEO_SEOUL);

export default async function SeoulPage() {
  const expos = await getPublishedExpos(SEO_SEOUL.filter);

  return (
    <RegionPage
      config={SEO_SEOUL}
      expos={expos}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "서울 웨딩박람회" },
      ]}
    />
  );
}
