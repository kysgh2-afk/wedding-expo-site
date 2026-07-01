import type { Metadata } from "next";
import { CostPageLayout } from "@/components/cost/CostPageLayout";
import { PercentileCostTable, PercentileSummaryCards } from "@/components/cost/PercentileCostTable";
import { SDME_COST_DATA, SDME_COST_SOURCE } from "@/data/wedding-cost/sdme";
import { SEO_COST_SDME, buildCostMetadata } from "@/lib/wedding-cost";

export const metadata: Metadata = buildCostMetadata(SEO_COST_SDME);

export default function SdmeCostPage() {
  return (
    <CostPageLayout page={SEO_COST_SDME} sourceNote={SDME_COST_SOURCE}>
      <PercentileSummaryCards rows={SDME_COST_DATA} title="스드메 패키지" />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">지역별 가격 분포</h2>
        <PercentileCostTable rows={SDME_COST_DATA} />
      </section>

      <section className="rounded-3xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-rose-100">
        <h2 className="text-lg font-bold text-slate-900">해석 포인트</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>전국 스드메 패키지 <strong>중간값은 292만원</strong>, 평균은 320만원입니다.</li>
          <li>수도권·서울(강남)은 중간값과 상위 구간이 비수도권보다 높은 편입니다.</li>
          <li>패키지 구성(촬영 컷 수, 드레스 대여 횟수, 메이크업 포함 범위)에 따라 체감 가격이 달라집니다.</li>
          <li>박람회에서 패키지 업그레이드·추가 옵션 조건을 반드시 확인하세요.</li>
        </ul>
      </section>
    </CostPageLayout>
  );
}
