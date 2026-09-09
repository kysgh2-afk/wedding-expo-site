"use client";

import { useState } from "react";
import { calculateGift, DEFAULT_GIFT_INPUT, RELATIONSHIPS, REGIONS, VENUES, type GiftInput } from "@/lib/gift-calculator";

export function GiftCalculator() {
  const [input, setInput] = useState<GiftInput>(DEFAULT_GIFT_INPUT);
  const result = calculateGift(input);
  const update = <K extends keyof GiftInput>(key: K, value: GiftInput[K]) => setInput((previous) => ({ ...previous, [key]: value }));
  const field = "mt-2 w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-slate-100 disabled:text-slate-500";
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
      <section aria-label="축의금 계산 조건" className="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100 sm:p-8">
        <label className="block text-base font-semibold text-slate-800">신랑·신부와의 친밀도
          <select className={field} value={input.relationship} onChange={(e) => update("relationship", e.target.value as GiftInput["relationship"])}>{RELATIONSHIPS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select>
        </label>
        <fieldset>
          <legend className="text-base font-semibold text-slate-800">참석 방법</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">{([
            ["meal", "참석 + 식사"], ["ceremony", "예식만 참석"], ["absent", "불참 · 마음만 전달"],
          ] as const).map(([value, label]) => <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${input.attendance === value ? "border-rose-500 bg-rose-50 text-rose-800" : "border-slate-200 text-slate-700"}`}><input type="radio" name="attendance" value={value} checked={input.attendance === value} onChange={() => update("attendance", value)} className="accent-rose-600" />{label}</label>)}</div>
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-base font-semibold text-slate-800">예식 지역
            <select className={field} disabled={input.attendance !== "meal"} value={input.region} onChange={(e) => update("region", e.target.value as GiftInput["region"])}>{REGIONS.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select>
          </label>
          <label className="block text-base font-semibold text-slate-800">예식장 유형
            <select className={field} disabled={input.attendance !== "meal"} value={input.venue} onChange={(e) => update("venue", e.target.value as GiftInput["venue"])}>{VENUES.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select>
          </label>
        </div>
        <label className="block text-base font-semibold text-slate-800">참석 인원 수 (본인 포함)
          <select className={field} disabled={input.attendance === "absent"} value={input.attendance === "absent" ? 0 : input.guests} onChange={(e) => update("guests", Number(e.target.value))}>
            {input.attendance === "absent" ? <option value={0}>0명 · 불참</option> : Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}명</option>)}
          </select>
        </label>
        <p className="text-sm leading-6 text-slate-500">지역과 예식장 유형은 식사할 때만 반영합니다. 인원은 성인 기준이며, 아동 식사가 있는 경우 실제 상황에 맞춰 조정해 주세요.</p>
        <button type="button" onClick={() => setInput(DEFAULT_GIFT_INPUT)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-rose-600">처음 설정으로</button>
      </section>
      <section aria-label="축의금 추천 결과" aria-live="polite" aria-atomic="true" className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8 lg:sticky lg:top-6">
        <p className="text-sm font-semibold text-rose-300">웨딩라스트 참고 추천</p>
        <h2 className="mt-3 text-lg">{result.guests ? `${result.guests}명 합산` : "불참 시"} 축의금</h2>
        <p className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">{result.recommended.toLocaleString("ko-KR")}<span className="ml-2 text-2xl font-medium">만원</span></p>
        <p className="mt-4 text-base text-slate-200">선택 가능한 참고 범위 {result.low}~{result.high}만원</p>
        <div className="my-7 border-t border-slate-700" />
        <h3 className="font-semibold">이렇게 계산했어요</h3>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
          <li>친밀도 기준: {result.relationship.label} → {result.relationship.amount}만원</li>
          {input.attendance === "meal" ? <>
            <li>식사 고려 기준: {result.venue.amount}만원 + 지역 보정 {result.region.extra}만원 = 1명당 {result.mealReference}만원</li>
            <li>인원 반영: {result.mealReference}만원 × {result.guests}명 = {result.attendanceReference}만원</li>
            <li>친밀도 금액과 인원 반영 금액 중 큰 금액을 선택합니다.</li>
          </> : <li>{input.attendance === "absent" ? "불참하면 지역·예식장·인원은 반영하지 않습니다." : `식사 비용은 반영하지 않고, 동행 ${result.guests - 1}명에 대한 참고 금액 ${result.attendanceReference}만원을 더합니다.`}</li>}
          <li>추천금액은 5만원 단위로 올림합니다. 범위는 추천금액의 약 ±20%(최소 ±5만원)입니다.</li>
        </ul>
        <p className="mt-6 rounded-xl bg-white/10 p-4 text-sm leading-6 text-slate-200">이 결과는 웨딩라스트가 정한 예시 규칙이며 실제 식대·지역별 평균이나 의무 금액이 아닙니다. 본인의 예산, 이전에 주고받은 금액, 가족 간 약속을 우선하세요.</p>
      </section>
    </div>
  );
}
