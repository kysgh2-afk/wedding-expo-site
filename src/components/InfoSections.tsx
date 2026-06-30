import { JsonLd } from "@/components/JsonLd";

export const TIP_ITEMS = [
  {
    title: "오전 일찍 방문",
    body: "오전 10~11시 사이 방문 시 대기 시간이 짧고 상담사가 여유롭게 응대해 줍니다.",
  },
  {
    title: "예산 메모 가져가기",
    body: "총 예산과 항목별(웨딩홀·스드메·허니문·예물) 분배 기준을 미리 메모해 가세요.",
  },
  {
    title: "질문 리스트 준비",
    body: "포함 항목, 추가 비용, 위약금, 환불 조건 등 비교 항목을 사전에 정리하면 빠르게 의사결정할 수 있습니다.",
  },
  {
    title: "여러 박람회 비교",
    body: "한 곳만 방문하지 말고 2~3곳을 비교하시면 시세를 파악하고 협상력이 생깁니다.",
  },
];

export const FAQ_ITEMS = [
  {
    question: "웨딩박람회 입장료가 있나요?",
    answer:
      "무료초대권을 사전 신청하시면 무료로 입장하실 수 있습니다. 사전 신청자에게는 웰컴 기프트, 우선 상담, 추가 할인 등의 혜택도 제공됩니다.",
  },
  {
    question: "박람회 현장에서 꼭 계약해야 하나요?",
    answer:
      "아니요. 박람회는 정보 비교와 견적 비교가 주된 목적입니다. 현장 계약을 강요받지 않으며, 신중히 비교한 뒤 결정하시기를 권장합니다.",
  },
  {
    question: "박람회 방문 시 무엇을 준비해야 하나요?",
    answer:
      "신랑신부 이름·연락처, 결혼 예정일, 예산 메모, 질문 리스트를 미리 준비하시고, 사진 촬영이 가능한 스마트폰과 편한 신발을 권장합니다.",
  },
];

type FaqItem = { question: string; answer: string };

export function HomeFaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

export function InfoSections() {
  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100">
        <h2 className="text-2xl font-bold text-slate-900">전국 웨딩박람회 방문 꿀팁</h2>
        <p className="mt-2 text-sm text-slate-500">
          전국 박람회는 거주 지역과 양가 부모님 방문 가능 거리를 모두 고려해 선택하시면 효율적입니다.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {TIP_ITEMS.map((tip) => (
            <div key={tip.title} className="rounded-2xl bg-rose-50/70 p-5">
              <h3 className="font-semibold text-rose-800">{tip.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100">
        <h2 className="text-2xl font-bold text-slate-900">전국 웨딩박람회 FAQ</h2>
        <div className="mt-8 space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-rose-100 bg-rose-50/40 p-5"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
