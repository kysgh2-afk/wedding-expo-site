import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExpoImage } from "@/components/ExpoImage";
import { JsonLd } from "@/components/JsonLd";
import { getContentBySlug, getPublishedContent } from "@/lib/content-store";
import { getSiteUrl, SITE_NAME } from "@/lib/regions";

type PageProps = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getContentBySlug(slug);
  if (!item) return { title: "콘텐츠를 찾을 수 없습니다" };
  const path = `/content/${item.slug}`;
  return {
    title: item.seoTitle || item.title,
    description: item.seoDescription || item.excerpt,
    keywords: item.keywords,
    alternates: { canonical: path },
    openGraph: { type: "article", url: `${getSiteUrl()}${path}`, title: item.seoTitle || item.title, description: item.seoDescription || item.excerpt, publishedTime: item.publishedAt.toISOString(), modifiedTime: item.updatedAt.toISOString(), images: item.coverImageUrl ? [item.coverImageUrl] : undefined },
  };
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getContentBySlug(slug);
  if (!item) notFound();
  const related = (await getPublishedContent()).filter((candidate) => candidate.id !== item.id).slice(0, 3);
  const url = `${getSiteUrl()}/content/${item.slug}`;
  const date = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" }).format(item.publishedAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <SiteHeader />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: item.title, description: item.excerpt, image: item.coverImageUrl ? [item.coverImageUrl] : undefined, datePublished: item.publishedAt.toISOString(), dateModified: item.updatedAt.toISOString(), author: { "@type": "Organization", name: item.author }, publisher: { "@type": "Organization", name: SITE_NAME, url: getSiteUrl() }, mainEntityOfPage: url }} />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "콘텐츠", href: "/content" }, { label: item.title }]} />
        <article className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-rose-100">
          {item.coverImageUrl ? <div className="relative aspect-[16/8] w-full"><ExpoImage src={item.coverImageUrl} alt={item.title} fill priority className="object-cover" /></div> : null}
          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-wrap items-center gap-3 text-sm"><span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">{item.category}</span><time className="text-slate-400">{date}</time><span className="text-slate-400">{item.author}</span></div>
            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">{item.title}</h1>
            <p className="mt-5 border-l-4 border-rose-300 pl-4 text-lg leading-8 text-slate-600">{item.excerpt}</p>
            <div className="content-article mt-10" dangerouslySetInnerHTML={{ __html: item.contentHtml }} />
          </div>
        </article>
        <div className="mt-8 flex justify-center"><Link href="/content" className="rounded-xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50">← 콘텐츠 목록으로</Link></div>
        {related.length ? <section className="mt-12"><h2 className="text-xl font-bold text-slate-900">함께 읽으면 좋은 글</h2><div className="mt-4 grid gap-4 sm:grid-cols-3">{related.map((candidate) => <Link key={candidate.id} href={`/content/${candidate.slug}`} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100 hover:ring-rose-200"><p className="text-xs font-semibold text-rose-600">{candidate.category}</p><h3 className="mt-2 font-bold leading-6 text-slate-900">{candidate.title}</h3></Link>)}</div></section> : null}
      </main>
      <SiteFooter />
    </div>
  );
}
