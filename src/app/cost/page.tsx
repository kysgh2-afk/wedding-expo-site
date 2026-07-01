import type { Metadata } from "next";
import Link from "next/link";
import { CostPageLayout } from "@/components/cost/CostPageLayout";
import { COST_SUB_PAGES, SEO_COST_INDEX, buildCostMetadata } from "@/lib/wedding-cost";

export const metadata: Metadata = buildCostMetadata(SEO_COST_INDEX);

export default function CostIndexPage() {
  return (
    <CostPageLayout page={SEO_COST_INDEX}>
      <div className="grid gap-5 md:grid-cols-2">
        {COST_SUB_PAGES.map((page) => (
          <Link
            key={page.path}
            href={page.path}
            className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100 transition hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-rose-700">
              {page.h1}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{page.intro}</p>
            <p className="mt-4 text-sm font-semibold text-rose-600">자세히 보기 →</p>
          </Link>
        ))}
      </div>

      <section className="rounded-3xl bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm ring-1 ring-rose-100">
        <h2 className="text-lg font-bold text-slate-900">통계 안내</h2>
        <p className="mt-3">
          본 페이지의 결혼비용 데이터는 2026년 5월 기준 계약 통계를 바탕으로 하며, 모든 금액은
          <strong className="text-slate-800"> 만원</strong> 단위입니다. 실제 견적은 업체·시기·규모에
          따라 달라질 수 있으니 웨딩박람회에서 여러 곳을 비교해 보시기 바랍니다.
        </p>
      </section>
    </CostPageLayout>
  );
}
