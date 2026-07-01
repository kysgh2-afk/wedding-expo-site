import type { Metadata } from "next";
import { CostPageLayout } from "@/components/cost/CostPageLayout";
import { PercentileCostTable, PercentileSummaryCards } from "@/components/cost/PercentileCostTable";
import { VENUE_COST_DATA, VENUE_COST_SOURCE } from "@/data/wedding-cost/venue";
import { SEO_COST_VENUE, buildCostMetadata } from "@/lib/wedding-cost";

export const metadata: Metadata = buildCostMetadata(SEO_COST_VENUE);

export default function VenueCostPage() {
  return (
    <CostPageLayout page={SEO_COST_VENUE} sourceNote={VENUE_COST_SOURCE}>
      <PercentileSummaryCards rows={VENUE_COST_DATA} title="예식장 대관료" />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">지역별 가격 분포</h2>
        <PercentileCostTable rows={VENUE_COST_DATA} />
      </section>

      <section className="rounded-3xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-rose-100">
        <h2 className="text-lg font-bold text-slate-900">해석 포인트</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>전국 예식장 대관료 <strong>중간값은 340만원</strong>, 평균은 436만원입니다.</li>
          <li>서울(강남)은 중간값 750만원으로 수도권·전국 대비 가장 높습니다.</li>
          <li>하위 25%~상위 25% 범위를 보면 본인 예산에 맞는 홀 선택 기준을 잡을 수 있습니다.</li>
          <li>대관료 외 식대·필수 옵션이 추가되므로 지역별 총 비용 페이지도 함께 참고하세요.</li>
        </ul>
      </section>
    </CostPageLayout>
  );
}
