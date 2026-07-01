import type { PercentileCostRow } from "@/data/wedding-cost/venue";
import { formatCount, formatManwon, formatPercent } from "@/lib/wedding-cost";

type PercentileCostTableProps = {
  rows: PercentileCostRow[];
  highlightLabel?: string;
};

function cellClass(isHighlight: boolean) {
  return isHighlight
    ? "px-4 py-4 font-semibold text-rose-700 bg-rose-50/60 whitespace-nowrap"
    : "px-4 py-4 text-slate-700 whitespace-nowrap";
}

export function PercentileCostTable({ rows, highlightLabel = "중간값" }: PercentileCostTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-rose-100">
      <table className="min-w-[880px] w-full text-left text-sm">
        <thead className="bg-rose-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-semibold">지역</th>
            <th className="px-4 py-3 font-semibold">하위 10%</th>
            <th className="px-4 py-3 font-semibold">하위 25%</th>
            <th className="px-4 py-3 font-semibold">{highlightLabel}</th>
            <th className="px-4 py-3 font-semibold">상위 25%</th>
            <th className="px-4 py-3 font-semibold">상위 10%</th>
            <th className="px-4 py-3 font-semibold">평균</th>
            <th className="px-4 py-3 font-semibold">건수</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.region} className="border-t border-rose-50">
              <td className="px-4 py-4 font-semibold text-slate-900 whitespace-nowrap">{row.region}</td>
              <td className={cellClass(false)}>{formatManwon(row.p10)}</td>
              <td className={cellClass(false)}>{formatManwon(row.p25)}</td>
              <td className={cellClass(true)}>{formatManwon(row.median)}</td>
              <td className={cellClass(false)}>{formatManwon(row.p75)}</td>
              <td className={cellClass(false)}>{formatManwon(row.p90)}</td>
              <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">
                {formatManwon(row.average)}
              </td>
              <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                {formatCount(row.count)}
                {row.ratio > 0 ? (
                  <span className="ml-1 text-xs text-slate-400">({formatPercent(row.ratio)})</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PercentileSummaryCards({
  rows,
  title,
}: {
  rows: PercentileCostRow[];
  title: string;
}) {
  const national = rows.find((row) => row.region === "전국");
  const capital = rows.find((row) => row.region === "수도권");
  const nonCapital = rows.find((row) => row.region === "비수도권");

  const cards = [
    { label: "전국 평균", row: national },
    { label: "수도권 평균", row: capital },
    { label: "비수도권 평균", row: nonCapital },
  ].filter((card) => card.row);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-rose-100">
          <p className="text-sm font-medium text-slate-500">{title} · {card.label}</p>
          <p className="mt-2 text-2xl font-bold text-rose-700">
            {formatManwon(card.row?.average ?? null)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            중간값 {formatManwon(card.row?.median ?? null)}
          </p>
        </div>
      ))}
    </div>
  );
}
