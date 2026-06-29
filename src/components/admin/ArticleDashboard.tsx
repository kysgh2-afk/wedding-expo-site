"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatKoreanDate } from "@/lib/date";
import { AdminNav } from "@/components/admin/AdminNav";

type AdminArticle = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
};

export function ArticleDashboard({ articles }: { articles: AdminArticle[] }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 글을 삭제하시겠습니까?")) return;

    const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
  }

  return (
    <div className="space-y-6">
      <AdminNav active="articles" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">콘텐츠 관리</h1>
          <p className="mt-1 text-sm text-slate-500">
            웨딩 관련 글과 이미지를 작성하고 관리하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/content"
            className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
          >
            콘텐츠 보기
          </Link>
          <Link
            href="/admin/articles/new"
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            + 새 글 작성
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            로그아웃
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-rose-100">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-rose-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">이미지</th>
                <th className="px-4 py-3 font-semibold">제목</th>
                <th className="px-4 py-3 font-semibold">작성일</th>
                <th className="px-4 py-3 font-semibold">노출</th>
                <th className="px-4 py-3 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    등록된 콘텐츠가 없습니다. 새 글을 작성해 주세요.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="border-t border-rose-50">
                    <td className="px-4 py-3">
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-rose-50">
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{article.title}</p>
                      {article.excerpt ? (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{article.excerpt}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatKoreanDate(new Date(article.createdAt))}
                    </td>
                    <td className="px-4 py-3">
                      {article.isPublished ? (
                        <span className="text-emerald-600">노출</span>
                      ) : (
                        <span className="text-slate-400">숨김</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/content/${article.id}`}
                          target="_blank"
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-rose-700 hover:bg-rose-50"
                        >
                          보기
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="rounded-lg bg-rose-50 px-3 py-1.5 text-rose-700 hover:bg-rose-100"
                        >
                          수정
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(article.id)}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-600 hover:bg-slate-200"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
