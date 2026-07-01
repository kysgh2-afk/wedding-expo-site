import type { Metadata } from "next";
import { CostPageLayout } from "@/components/cost/CostPageLayout";
import { SeasonCostTable, SeasonInsightCards } from "@/components/cost/SeasonCostTable";
import { SEASON_COST_DATA, SEASON_COST_SOURCE } from "@/data/wedding-cost/season";
import { SEO_COST_SEASON, buildCostMetadata } from "@/lib/wedding-cost";

export const metadata: Metadata = buildCostMetadata(SEO_COST_SEASON);

export default function SeasonCostPage() {
  return (
    <CostPageLayout page={SEO_COST_SEASON} sourceNote={SEASON_COST_SOURCE}>
      <SeasonInsightCards rows={SEASON_COST_DATA} />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">월별 상세 표</h2>
        <SeasonCostTable rows={SEASON_COST_DATA} />
      </section>

      <section className="rounded-3xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-rose-100">
        <h2 className="text-lg font-bold text-slate-900">해석 포인트</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>예식장 계약은 <strong>5~6월·10~11월</strong>에 건수와 비중이 높은 성수기 패턴을 보입니다.</li>
          <li>7~8월·1~2월은 비수기로 계약 금액과 건수가 상대적으로 낮습니다.</li>
          <li>스드메 계약 금액은 월별로 275~330만원대에서 비교적 안정적입니다.</li>
          <li>성수기 예식은 일정·홀 경쟁이 치열하므로 박람회에서 미리 비교·예약하는 것이 유리합니다.</li>
        </ul>
      </section>
    </CostPageLayout>
  );
}
