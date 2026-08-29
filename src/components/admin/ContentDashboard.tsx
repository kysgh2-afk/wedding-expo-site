"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AdminContent = {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Seoul" }).format(new Date(value));
}

export function ContentDashboard({ items }: { items: AdminContent[] }) {
  const router = useRouter();

  async function remove(id: string) {
    if (!confirm("이 콘텐츠를 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.")) return;
    const response = await fetch(`/api/content/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-rose-600">웨딩라스트 관리자</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">콘텐츠 관리</h1>
          <p className="mt-1 text-sm text-slate-500">웨딩 정보 글을 작성하고 공개 상태와 검색 정보를 관리합니다.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin" className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">박람회 관리</Link>
          <Link href="/content" className="rounded-xl border border-rose-200 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50">콘텐츠 보기</Link>
          <Link href="/admin/content/new" className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">+ 새 콘텐츠</Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-rose-100">
        {items.length === 0 ? (
          <div className="px-6 py-16 text-center"><p className="font-semibold text-slate-700">작성한 콘텐츠가 없습니다.</p><Link href="/admin/content/new" className="mt-4 inline-block text-sm font-semibold text-rose-600">첫 콘텐츠 작성하기 →</Link></div>
        ) : (
          <div className="divide-y divide-rose-50">
            {items.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">{item.category}</span><span className={item.isPublished ? "text-emerald-600" : "text-slate-400"}>{item.isPublished ? "공개" : "비공개"}</span><span className="text-slate-400">{formatDate(item.publishedAt)}</span></div>
                  <h2 className="mt-2 truncate text-lg font-bold text-slate-900">{item.title}</h2>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">{item.excerpt}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {item.isPublished ? <Link href={`/content/${item.slug}`} target="_blank" className="rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-700">보기</Link> : null}
                  <Link href={`/admin/content/${item.id}/edit`} className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">수정</Link>
                  <button type="button" onClick={() => remove(item.id)} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">삭제</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
