import { getRecentExposForRss, getSiteLastUpdated } from "@/lib/expos";
import { buildRssFeed } from "@/lib/rss";

export const dynamic = "force-dynamic";

export async function GET() {
  const [expos, lastUpdated] = await Promise.all([
    getRecentExposForRss(),
    getSiteLastUpdated(),
  ]);

  const lastBuildDate = lastUpdated ?? new Date();
  const xml = buildRssFeed({ expos, lastBuildDate });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
