import type { Metadata } from "next";
import { RegionPage } from "@/components/RegionPage";
import { getPublishedExpos } from "@/lib/expos";
import { serializeExpos } from "@/lib/serialize-expos";
import { SEO_GYEONGGI, buildPageMetadata } from "@/lib/regions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata(SEO_GYEONGGI);

export default async function GyeonggiPage() {
  const expos = await getPublishedExpos(SEO_GYEONGGI.filter);

  return (
    <RegionPage
      config={SEO_GYEONGGI}
      expos={serializeExpos(expos)}
      breadcrumbs={[
        { label: "홈", href: "/" },
        { label: "경기 웨딩박람회" },
      ]}
    />
  );
}
