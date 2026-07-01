import type { Metadata } from "next";
import { CostPageLayout } from "@/components/cost/CostPageLayout";
import { RegionalCostTable, RegionalSummaryCards } from "@/components/cost/RegionalCostTable";
import { REGIONAL_COST_DATA, REGIONAL_COST_SOURCE } from "@/data/wedding-cost/regional";
import { SEO_COST_REGIONAL, buildCostMetadata } from "@/lib/wedding-cost";

export const metadata: Metadata = buildCostMetadata(SEO_COST_REGIONAL);

export default function RegionalCostPage() {
  return (
    <CostPageLayout page={SEO_COST_REGIONAL} sourceNote={REGIONAL_COST_SOURCE}>
      <RegionalSummaryCards rows={REGIONAL_COST_DATA} />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">지역별 상세 표</h2>
        <RegionalCostTable rows={REGIONAL_COST_DATA} />
      </section>

      <section className="rounded-3xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-rose-100">
        <h2 className="text-lg font-bold text-slate-900">해석 포인트</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>총 계약금액에서 <strong>식비 비중이 60% 전후</strong>로 가장 큽니다.</li>
          <li>수도권은 비수도권 대비 총 계약금액이 높고, 대관료·장식비 비중도 큰 편입니다.</li>
          <li>서울(강남)은 총 계약금액 3,375만원으로 전국 평균보다 높은 수준입니다.</li>
          <li>제주도는 식비 비중이 82%로 매우 높아 지역 특성을 반영합니다.</li>
        </ul>
      </section>
    </CostPageLayout>
  );
}
