"use client";

import { ExpoCard } from "@/components/ExpoCard";
import type { SerializedExpo } from "@/components/ExpoList";

function rankBadgeClass(rank: number) {
  if (rank === 1) return "bg-amber-400 text-white shadow-md shadow-amber-200";
  if (rank === 2) return "bg-slate-400 text-white shadow-md shadow-slate-200";
  if (rank === 3) return "bg-orange-400 text-white shadow-md shadow-orange-200";
  return "bg-rose-500 text-white";
}

type PopularRankingListProps = {
  expos: SerializedExpo[];
};

export function PopularRankingList({ expos }: PopularRankingListProps) {
  if (expos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center text-slate-500">
        아직 순위를 집계할 박람회가 없습니다.
      </div>
    );
  }

  return (
    <ol className="space-y-6">
      {expos.map((expo, index) => {
        const rank = index + 1;

        return (
          <li key={expo.id} className="flex items-start gap-3 sm:gap-5">
            <div
              className={`mt-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-bold sm:h-12 sm:w-12 ${rankBadgeClass(rank)}`}
              aria-label={`${rank}위`}
            >
              {rank}
            </div>
            <div className="min-w-0 flex-1">
              <ExpoCard
                expo={{
                  ...expo,
                  startDate: new Date(expo.startDate),
                  endDate: new Date(expo.endDate),
                }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
