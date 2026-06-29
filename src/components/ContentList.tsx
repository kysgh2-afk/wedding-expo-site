import { ContentCard } from "@/components/ContentCard";
import type { SerializedArticle } from "@/lib/serialize-articles";

type ContentListProps = {
  articles: SerializedArticle[];
  emptyMessage?: string;
};

export function ContentList({
  articles,
  emptyMessage = "등록된 콘텐츠가 없습니다.",
}: ContentListProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {articles.map((article) => (
        <ContentCard key={article.id} article={article} />
      ))}
    </section>
  );
}
