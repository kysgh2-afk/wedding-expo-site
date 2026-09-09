import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GiftCalculator } from "@/components/GiftCalculator";
import { buildPageMetadata } from "@/lib/regions";

export const metadata = buildPageMetadata({
  path: "/content/gift-calculator",
  title: "축의금 계산기 | 친밀도·참석 인원별 추천금액 - 웨딩라스트",
  description: "결혼식 축의금이 고민된다면 친밀도, 참석 방법, 지역, 예식장 유형, 참석 인원을 선택해 참고 추천금액과 계산 이유를 확인하세요.",
  keywords: ["축의금 계산기", "결혼식 축의금", "친구 축의금", "직장 동료 축의금", "웨딩라스트"],
});

export default function GiftCalculatorPage() {
  return <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50/40">
    <SiteHeader />
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "홈", href: "/" }, { label: "콘텐츠", href: "/content" }, { label: "축의금 계산기" }]} />
      <div><p className="text-sm font-semibold text-rose-600">결혼식 하객 가이드</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">축의금, 얼마가 좋을까요?</h1><p className="mt-3 text-base leading-7 text-slate-600">조건을 바꾸면 추천금액이 바로 달라집니다. 결과는 선택한 인원이 함께 전하는 총액입니다.</p></div>
      <GiftCalculator />
      <section className="rounded-3xl border border-rose-100 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900">축의금을 정하기 전에</h2>
        <div className="mt-5 space-y-5 text-base leading-7 text-slate-600">
          <div><h3 className="font-semibold text-slate-800">꼭 식대 이상을 내야 하나요?</h3><p>이 계산기의 식사 기준은 추천을 돕기 위한 가정입니다. 식대가 축의금의 의무 기준은 아니며, 부담 없는 예산 안에서 마음을 전하세요.</p></div>
          <div><h3 className="font-semibold text-slate-800">가족·커플이 함께 참석하면요?</h3><p>본인을 포함한 전체 인원을 선택하세요. 결과는 1인당 금액이 아니라 한 봉투에 담을 합산 참고 금액입니다. 인원이 각자 친분을 가진 경우에는 개인별로 계산할 수 있습니다.</p></div>
          <div><h3 className="font-semibold text-slate-800">불참할 때도 지역이나 호텔 여부를 고려하나요?</h3><p>불참을 선택하면 친밀도만 계산에 반영합니다. 형제자매 등 가족의 축의금은 편차가 크므로 계산기보다 가족 간 합의를 우선하세요.</p></div>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}
