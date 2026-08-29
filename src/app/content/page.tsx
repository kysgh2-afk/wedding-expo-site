import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RegionNav } from "@/components/RegionNav";
import { ExpoImage } from "@/components/ExpoImage";
import { getPublishedContent } from "@/lib/content-store";
import { COST_CONTENT_CARD, CONTENT_INDEX, buildContentIndexMetadata } from "@/lib/content";

export const metadata = buildContentIndexMetadata();
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" }).format(date);
}

export default async function ContentIndexPage() {
  const items = await getPublishedContent();
  const cards = [COST_CONTENT_CARD, ...items.map((item) => ({ ...item, href: `/content/${item.slug}` }))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50/40">
      <SiteHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <RegionNav activePath="/content" />
        <section className="overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10">
          <p className="text-sm font-semibold text-rose-300">WEDDING LAST CONTENT</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">웨딩 콘텐츠</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">{CONTENT_INDEX.description}</p>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-3"><div><p className="text-sm font-semibold text-rose-600">최신 웨딩 정보</p><h2 className="mt-1 text-2xl font-bold text-slate-900">결혼 준비 가이드</h2></div><p className="text-sm text-slate-500">총 {cards.length}개</p></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((item, index) => (
              <Link key={item.slug} href={item.href} className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-rose-100 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50">
                  {item.coverImageUrl ? <ExpoImage src={item.coverImageUrl} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl">{index === 0 ? "₩" : "♥"}</span></div>}
                </div>
                <article className="p-6"><div className="flex items-center justify-between gap-3 text-xs"><span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">{item.category}</span><time className="text-slate-400">{formatDate(item.publishedAt)}</time></div><h3 className="mt-4 text-xl font-bold leading-snug text-slate-900 group-hover:text-rose-700">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.excerpt}</p><p className="mt-5 text-sm font-semibold text-rose-600">읽어보기 →</p></article>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
