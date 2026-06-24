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

export function ExpoList({
  expos,
  emptyMessage = "등록된 박람회가 없습니다.",
}: ExpoListProps) {
  const [sortMode, setSortMode] = useState<ExpoSortMode>("date");

  const sortedExpos = useMemo(() => {
    const withDates = expos.map((expo) => ({
      ...expo,
      startDate: new Date(expo.startDate),
      endDate: new Date(expo.endDate),
    }));
    return sortExpos(withDates, sortMode).map((expo) => toCardData({
      ...expo,
      startDate: expo.startDate.toISOString(),
      endDate: expo.endDate.toISOString(),
    }));
  }, [expos, sortMode]);

  return (
    <section className="space-y-6">
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

      {sortedExpos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center text-slate-500">
          {emptyMessage}
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
