"use client";

import { useMemo, useState } from "react";
import { ExpoCard, type ExpoCardData } from "@/components/ExpoCard";
import { sortExpos, type ExpoSortMode } from "@/lib/sort-expos";

export type SerializedExpo = Omit<ExpoCardData, "startDate" | "endDate"> & {
  startDate: string;
  endDate: string;
  clickCount: number;
};

type ExpoListProps = {
  expos: SerializedExpo[];
  emptyMessage?: string;
};

function toCardData(expo: SerializedExpo): ExpoCardData {
  return {
    ...expo,
    startDate: new Date(expo.startDate),
    endDate: new Date(expo.endDate),
  };
}

function sortButtonClass(isActive: boolean) {
  return `rounded-full px-5 py-2.5 text-sm font-semibold transition ${
    isActive
      ? "bg-rose-600 text-white shadow"
      : "bg-white text-slate-600 ring-1 ring-rose-100 hover:bg-rose-50"
  }`;
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .replace(/\s+/g, " ")
    .trim();
}

export function ExpoList({
  expos,
  emptyMessage = "등록된 박람회가 없습니다.",
}: ExpoListProps) {
  const [sortMode, setSortMode] = useState<ExpoSortMode>("date");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedExpos = useMemo(() => {
    const query = normalizeSearchText(searchQuery);
    const withDates = expos
      .filter((expo) => {
        if (!query) return true;

        const searchableText = normalizeSearchText(
          [expo.title, expo.location, expo.regionLabel, ...expo.tags].join(" "),
        );
        return searchableText.includes(query);
      })
      .map((expo) => ({
        ...expo,
        startDate: new Date(expo.startDate),
        endDate: new Date(expo.endDate),
      }));

    return sortExpos(withDates, sortMode).map((expo) =>
      toCardData({
        ...expo,
        startDate: expo.startDate.toISOString(),
        endDate: expo.endDate.toISOString(),
      }),
    );
  }, [expos, searchQuery, sortMode]);

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm sm:p-5">
        <label htmlFor="expo-search" className="sr-only">
          웨딩박람회 검색
        </label>
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-400"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="expo-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="박람회명, 장소, 지역을 검색하세요"
            autoComplete="off"
            className="w-full rounded-xl border border-rose-200 bg-rose-50/40 py-3.5 pl-12 pr-20 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-100"
          />
          {hasSearchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-100"
              aria-label="검색어 지우기"
            >
              지우기
            </button>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSortMode("date")}
              className={sortButtonClass(sortMode === "date")}
            >
              날짜순
            </button>
            <button
              type="button"
              onClick={() => setSortMode("popular")}
              className={sortButtonClass(sortMode === "popular")}
            >
              인기순
            </button>
          </div>
          <p className="text-sm font-medium text-slate-500" aria-live="polite">
            {hasSearchQuery
              ? `검색 결과 ${sortedExpos.length}개`
              : `전체 일정 ${sortedExpos.length}개`}
          </p>
        </div>
      </div>

      {sortedExpos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center text-slate-500">
          {hasSearchQuery ? (
            <div className="space-y-3">
              <p className="font-semibold text-slate-700">
                “{searchQuery.trim()}” 검색 결과가 없습니다.
              </p>
              <p className="text-sm">
                지역명이나 행사장 이름으로 다시 검색해 보세요.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                전체 일정 보기
              </button>
            </div>
          ) : (
            emptyMessage
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sortedExpos.map((expo) => (
            <ExpoCard key={expo.id} expo={expo} />
          ))}
        </div>
      )}
    </section>
  );
}
