import Image from "next/image";
import Link from "next/link";
import { formatKoreanDate } from "@/lib/date";
import type { SerializedArticle } from "@/lib/serialize-articles";

const CONTENT_IMAGE_SIZE = 320;

export function ContentCard({ article }: { article: SerializedArticle }) {
  const dateText = formatKoreanDate(new Date(article.createdAt));
  const summary = article.excerpt || article.body.slice(0, 120);

  return (
    <Link href={`/content/${article.id}`} className="block h-full">
      <article className="group mx-auto flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div
          className="relative mx-auto overflow-hidden bg-rose-50"
          style={{ width: CONTENT_IMAGE_SIZE, height: CONTENT_IMAGE_SIZE, maxWidth: "100%" }}
        >
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={CONTENT_IMAGE_SIZE}
              height={CONTENT_IMAGE_SIZE}
              className="h-[320px] w-[320px] max-w-full object-cover transition duration-300 group-hover:scale-105"
              sizes={`${CONTENT_IMAGE_SIZE}px`}
            />
          ) : (
            <div
              className="flex items-center justify-center bg-gradient-to-br from-rose-100 to-amber-50 text-sm text-rose-400"
              style={{ width: CONTENT_IMAGE_SIZE, height: CONTENT_IMAGE_SIZE, maxWidth: "100%" }}
            >
              웨딩 콘텐츠
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-rose-600 shadow">
            콘텐츠
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-sm font-medium text-slate-600">{dateText}</p>
          <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-rose-700">
            {article.title}
          </h3>
          <p className="mt-auto line-clamp-3 text-sm leading-relaxed text-slate-500">
            {summary}
          </p>
        </div>
      </article>
    </Link>
  );
}
