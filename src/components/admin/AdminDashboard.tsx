"use client";

import { ExpoImage } from "@/components/ExpoImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatExpoSchedule } from "@/lib/date";
import { STATUS_OPTIONS } from "@/lib/constants";

type AdminExpo = {
  id: string;
  title: string;
  location: string;
  regionLabel: string;
  startDate: string;
  endDate: string;
  status: string;
  imageUrl: string | null;
  linkUrl: string | null;
  tags?: string[];
  isWeeklyWeekend?: boolean;
  isPublished: boolean;
  clickCount: number;
};

export function AdminDashboard({ expos }: { expos: AdminExpo[] }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 박람회를 삭제하시겠습니까?")) return;

    const response = await fetch(`/api/expos/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">박람회 관리</h1>
          <p className="mt-1 text-sm text-slate-500">
            이미지, 일정, 링크를 추가하고 매주 업데이트하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
          >
            사이트 보기
          </Link>
          <Link
            href="/admin/expos/new"
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            + 새 박람회
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
                <th className="px-4 py-3 font-semibold">일정</th>
                <th className="px-4 py-3 font-semibold">상태</th>
                <th className="px-4 py-3 font-semibold">클릭</th>
                <th className="px-4 py-3 font-semibold">노출</th>
                <th className="px-4 py-3 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {expos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    등록된 박람회가 없습니다. 새 박람회를 추가해 주세요.
                  </td>
                </tr>
              ) : (
                expos.map((expo) => (
                  <tr key={expo.id} className="border-t border-rose-50">
                    <td className="px-4 py-3">
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-rose-50">
                        {expo.imageUrl ? (
                          <ExpoImage
                            src={expo.imageUrl}
                            alt={expo.title}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{expo.title}</p>
                      <p className="text-xs text-slate-500">
                        {expo.regionLabel} · {expo.location}
                      </p>
                      {expo.tags && expo.tags.length > 0 ? (
                        <p className="mt-1 text-xs text-rose-600">
                          {expo.tags.map((tag) => `#${tag}`).join(" ")}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatExpoSchedule(
                        new Date(expo.startDate),
                        new Date(expo.endDate),
                        expo.isWeeklyWeekend,
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {STATUS_OPTIONS.find((item) => item.value === expo.status)?.label}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{expo.clickCount}</td>
                    <td className="px-4 py-3">
                      {expo.isPublished ? (
                        <span className="text-emerald-600">노출</span>
                      ) : (
                        <span className="text-slate-400">숨김</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {expo.linkUrl ? (
                          <a
                            href={expo.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-rose-200 px-3 py-1.5 text-rose-700 hover:bg-rose-50"
                          >
                            링크
                          </a>
                        ) : (
                          <span className="rounded-lg border border-dashed border-slate-200 px-3 py-1.5 text-slate-400">
                            링크 없음
                          </span>
                        )}
                        <Link
                          href={`/admin/expos/${expo.id}/edit`}
                          className="rounded-lg bg-rose-50 px-3 py-1.5 text-rose-700 hover:bg-rose-100"
                        >
                          수정
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(expo.id)}
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
