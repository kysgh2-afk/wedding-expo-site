import type { SeasonCostRow } from "@/data/wedding-cost/season";
import { formatCount, formatManwon, formatPercent } from "@/lib/wedding-cost";

function ratioBarClass(ratio: number) {
  if (ratio >= 10) return "bg-rose-500";
  if (ratio >= 7) return "bg-amber-400";
  return "bg-slate-300";
}

export function SeasonCostTable({ rows }: { rows: SeasonCostRow[] }) {
  const maxVenueRatio = Math.max(...rows.map((row) => row.venue.ratio));

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-rose-100">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead className="bg-rose-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">예식 시기</th>
            <th className="px-4 py-3 font-semibold">예식장 계약금액</th>
            <th className="px-4 py-3 font-semibold">예식장 건수</th>
            <th className="px-4 py-3 font-semibold">스드메 계약금액</th>
            <th className="px-4 py-3 font-semibold">스드메 건수</th>
            <th className="px-4 py-3 font-semibold">예식장 계약 비중</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.period} className="border-t border-rose-50 align-middle">
              <td className="px-4 py-4 font-semibold text-slate-900 whitespace-nowrap">{row.label}</td>
              <td className="px-4 py-4 font-bold text-rose-700 whitespace-nowrap">
                {formatManwon(row.venue.amount)}
              </td>
              <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                {formatCount(row.venue.count)}
                <span className="ml-1 text-xs text-slate-400">({formatPercent(row.venue.ratio)})</span>
              </td>
              <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                {formatManwon(row.sdme.amount)}
              </td>
              <td className="px-4 py-4 text-slate-700 whitespace-nowrap">
                {formatCount(row.sdme.count)}
                <span className="ml-1 text-xs text-slate-400">({formatPercent(row.sdme.ratio)})</span>
              </td>
              <td className="px-4 py-4 min-w-[160px]">
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${ratioBarClass(row.venue.ratio)}`}
                      style={{ width: `${(row.venue.ratio / maxVenueRatio) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-xs text-slate-500">{formatPercent(row.venue.ratio)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SeasonInsightCards({ rows }: { rows: SeasonCostRow[] }) {
  const peakVenue = [...rows].sort((a, b) => b.venue.amount - a.venue.amount)[0];
  const lowVenue = [...rows].sort((a, b) => a.venue.amount - b.venue.amount)[0];
  const busiest = [...rows].sort((a, b) => b.venue.count - a.venue.count)[0];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
        <p className="text-sm font-medium text-slate-500">예식장 비용 최고</p>
        <p className="mt-2 text-xl font-bold text-rose-700">{peakVenue.label}</p>
        <p className="mt-1 text-sm text-slate-600">{formatManwon(peakVenue.venue.amount)}</p>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
        <p className="text-sm font-medium text-slate-500">예식장 비용 최저</p>
        <p className="mt-2 text-xl font-bold text-emerald-700">{lowVenue.label}</p>
        <p className="mt-1 text-sm text-slate-600">{formatManwon(lowVenue.venue.amount)}</p>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
        <p className="text-sm font-medium text-slate-500">예식장 계약 가장 많음</p>
        <p className="mt-2 text-xl font-bold text-slate-900">{busiest.label}</p>
        <p className="mt-1 text-sm text-slate-600">{formatCount(busiest.venue.count)}</p>
      </div>
    </div>
  );
}
