import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { RegionNav } from "@/components/RegionNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getPublishedArticle } from "@/lib/articles";
import { formatKoreanDate } from "@/lib/date";
import { articleExcerpt } from "@/lib/html";
import { getSiteUrl } from "@/lib/regions";
import { ArticleBody } from "@/components/ArticleBody";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getPublishedArticle(id);

  if (!article) {
    return { title: "글을 찾을 수 없습니다" };
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/content/${article.id}`;
  const description = articleExcerpt(article.body, article.excerpt);

  return {
    title: `${article.title} | 웨딩 콘텐츠`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      title: article.title,
      description,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
  };
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getPublishedArticle(id);

  if (!article) {
    notFound();
  }

  const dateText = formatKoreanDate(article.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <SiteHeader />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "홈", href: "/" },
            { label: "콘텐츠", href: "/content" },
            { label: article.title },
          ]}
        />
        <RegionNav activePath="/content" />

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-rose-100">
          {article.imageUrl ? (
            <div className="relative aspect-[16/10] w-full bg-rose-50">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          ) : null}

          <div className="space-y-6 p-6 sm:p-10">
            <div className="space-y-3">
              <p className="text-sm font-medium text-rose-600">웨딩 콘텐츠</p>
              <h1 className="text-3xl font-bold leading-tight text-slate-900">{article.title}</h1>
              <p className="text-sm text-slate-500">{dateText}</p>
            </div>

            {article.excerpt ? (
              <p className="rounded-2xl bg-rose-50 px-5 py-4 text-base leading-relaxed text-slate-700">
                {article.excerpt}
              </p>
            ) : null}

            <ArticleBody html={article.body} />
          </div>
        </article>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/content"
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 ring-1 ring-rose-100 hover:bg-rose-50"
          >
            콘텐츠 목록
          </Link>
          <Link
            href="/"
            className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            박람회 일정 보기
          </Link>
        </div>
      </main>
      <footer className="border-t border-rose-100 bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} 웨딩박람회 일정 모음 · 매주 업데이트
      </footer>
    </div>
  );
}
