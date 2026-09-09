export const RELATIONSHIPS = [
  { value: "acquaintance", label: "가끔 연락하는 지인", amount: 5 },
  { value: "colleague", label: "직장 동료·일반 친구", amount: 10 },
  { value: "friend", label: "자주 만나는 친한 친구", amount: 15 },
  { value: "close", label: "절친·가까운 친척", amount: 20 },
  { value: "family", label: "형제자매·아주 가까운 가족", amount: 30 },
] as const;
export const REGIONS = [
  { value: "seoul", label: "서울", extra: 2 },
  { value: "capital", label: "경기·인천", extra: 1 },
  { value: "metro", label: "부산·대구·대전·광주·울산·세종", extra: 1 },
  { value: "other", label: "그 외 지역·제주", extra: 0 },
] as const;
export const VENUES = [
  { value: "small", label: "소규모·공공·종교시설", amount: 6 },
  { value: "hall", label: "일반 웨딩홀", amount: 8 },
  { value: "premium", label: "프리미엄 웨딩홀", amount: 12 },
  { value: "hotel", label: "호텔 예식장", amount: 15 },
] as const;
export type GiftInput = {
  relationship: typeof RELATIONSHIPS[number]["value"];
  attendance: "meal" | "ceremony" | "absent";
  region: typeof REGIONS[number]["value"];
  venue: typeof VENUES[number]["value"];
  guests: number;
};
export const DEFAULT_GIFT_INPUT: GiftInput = {
  relationship: "colleague", attendance: "meal", region: "seoul", venue: "hall", guests: 1,
};

// Editorial reference values in units of 10,000 KRW, not measured venue prices.
export function calculateGift(input: GiftInput) {
  const relationship = RELATIONSHIPS.find((item) => item.value === input.relationship) ?? RELATIONSHIPS[1];
  const region = REGIONS.find((item) => item.value === input.region) ?? REGIONS[0];
  const venue = VENUES.find((item) => item.value === input.venue) ?? VENUES[1];
  const guests = input.attendance === "absent" ? 0 : Math.max(1, Math.min(10, Math.trunc(Number.isFinite(input.guests) ? input.guests : 1)));
  const mealReference = input.attendance === "meal" ? venue.amount + region.extra : 0;
  const attendanceReference = input.attendance === "meal" ? mealReference * guests : input.attendance === "ceremony" ? Math.max(0, guests - 1) * 2 : 0;
  const raw = input.attendance === "meal" ? Math.max(relationship.amount, attendanceReference) : relationship.amount + attendanceReference;
  const recommended = Math.ceil(raw / 5) * 5;
  const margin = Math.max(5, Math.ceil(recommended * 0.2 / 5) * 5);
  return { recommended, low: Math.max(5, recommended - margin), high: recommended + margin, relationship, region, venue, guests, mealReference, attendanceReference };
}
