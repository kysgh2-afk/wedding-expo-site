import type { RegionalCostRow } from "@/data/wedding-cost/regional";
import { formatCount, formatManwon, formatPercent } from "@/lib/wedding-cost";

const SEGMENTS = [
  { key: "venueRental" as const, label: "대관료", color: "bg-rose-500" },
  { key: "decoration" as const, label: "장식비", color: "bg-amber-400" },
  { key: "food" as const, label: "식비", color: "bg-emerald-500" },
  { key: "sdme" as const, label: "스드메", color: "bg-sky-500" },
];

function CompositionBar({ row }: { row: RegionalCostRow }) {
  return (
    <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
      {SEGMENTS.map((segment) => {
        const part = row[segment.key];
        if (part.ratio <= 0) return null;
        return (
          <div
            key={segment.key}
            className={segment.color}
            style={{ width: `${part.ratio}%` }}
            title={`${segment.label} ${formatPercent(part.ratio)}`}
          />
        );
      })}
    </div>
  );
}

export function RegionalCostTable({ rows }: { rows: RegionalCostRow[] }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 text-xs text-slate-600">
        {SEGMENTS.map((segment) => (
          <span key={segment.key} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${segment.color}`} />
            {segment.label}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-rose-100">
        <table className="min-w-[960px] w-full text-left text-sm">
          <thead className="bg-rose-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">지역</th>
              <th className="px-4 py-3 font-semibold">총 계약금액</th>
              <th className="px-4 py-3 font-semibold">대관료</th>
              <th className="px-4 py-3 font-semibold">장식비</th>
              <th className="px-4 py-3 font-semibold">식비</th>
              <th className="px-4 py-3 font-semibold">스드메</th>
              <th className="px-4 py-3 font-semibold">구성비</th>
              <th className="px-4 py-3 font-semibold">건수</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.region} className="border-t border-rose-50 align-top">
                <td className="px-4 py-4 font-semibold text-slate-900 whitespace-nowrap">
                  {row.region}
                </td>
                <td className="px-4 py-4 font-bold text-rose-700 whitespace-nowrap">
                  {formatManwon(row.total.amount)}
                </td>
                <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                  {formatManwon(row.venueRental.amount)}
                  <span className="ml-1 text-xs text-slate-400">
                    ({formatPercent(row.venueRental.ratio)})
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                  {formatManwon(row.decoration.amount)}
                  <span className="ml-1 text-xs text-slate-400">
                    ({formatPercent(row.decoration.ratio)})
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                  {formatManwon(row.food.amount)}
                  <span className="ml-1 text-xs text-slate-400">({formatPercent(row.food.ratio)})</span>
                </td>
                <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                  {formatManwon(row.sdme.amount)}
                  <span className="ml-1 text-xs text-slate-400">({formatPercent(row.sdme.ratio)})</span>
                </td>
                <td className="px-4 py-4 min-w-[140px]">
                  <CompositionBar row={row} />
                </td>
                <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                  {formatCount(row.count)}
                  <span className="ml-1 text-xs text-slate-400">
                    ({formatPercent(row.countRatio)})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RegionalSummaryCards({ rows }: { rows: RegionalCostRow[] }) {
  const highlights = rows.filter((row) => ["전국", "수도권", "비수도권", "서울(강남)"].includes(row.region));

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {highlights.map((row) => (
        <div
          key={row.region}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100"
        >
          <p className="text-sm font-medium text-slate-500">{row.region}</p>
          <p className="mt-2 text-2xl font-bold text-rose-700">{formatManwon(row.total.amount)}</p>
          <p className="mt-2 text-xs text-slate-500">
            식비 {formatPercent(row.food.ratio)} · 스드메 {formatPercent(row.sdme.ratio)}
          </p>
        </div>
      ))}
    </div>
  );
}
