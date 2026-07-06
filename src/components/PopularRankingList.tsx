"use client";

import { ExpoCard } from "@/components/ExpoCard";
import type { SerializedExpo } from "@/components/ExpoList";

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
    <ol className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {expos.map((expo, index) => {
        const rank = index + 1;

        return (
          <li key={expo.id} className="min-w-0">
            <ExpoCard
              rank={rank}
              expo={{
                ...expo,
                startDate: new Date(expo.startDate),
                endDate: new Date(expo.endDate),
              }}
            />
          </li>
        );
      })}
    </ol>
  );
}
