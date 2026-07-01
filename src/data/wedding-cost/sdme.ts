import type { PercentileCostRow } from "@/data/wedding-cost/venue";

/** 스드메 패키지 가격 (2026년 5월, 단위: 만원) */
export const SDME_COST_DATA: PercentileCostRow[] = [
  { region: "전국", p10: 208, p25: 242, median: 292, p75: 350, p90: 450, average: 320, count: 1875, ratio: 100 },
  { region: "수도권", p10: 201, p25: 250, median: 332, p75: 450, p90: 597, average: 371, count: 759, ratio: 40.5 },
  { region: "비수도권", p10: 210, p25: 240, median: 280, p75: 320, p90: 364, average: 284, count: 1116, ratio: 59.5 },
  { region: "서울(강남)", p10: 216, p25: 278, median: 350, p75: 490, p90: 630, average: 406, count: 591, ratio: 31.5 },
  { region: "서울(강남외)", p10: 340, p25: 370, median: 598, p75: 598, p90: null, average: 507, count: 5, ratio: 0.3 },
  { region: "부산", p10: 159, p25: 205, median: 283, p75: 300, p90: 400, average: 279, count: 184, ratio: 9.8 },
  { region: "대구", p10: 218, p25: 237, median: 255, p75: 300, p90: 332, average: 267, count: 197, ratio: 10.5 },
  { region: "인천", p10: 178, p25: 178, median: 220, p75: 222, p90: 309, average: 225, count: 81, ratio: 4.3 },
  { region: "광주", p10: 300, p25: 300, median: 340, p75: 361, p90: 410, average: 336, count: 128, ratio: 6.8 },
  { region: "대전", p10: 194, p25: 259, median: 259, p75: 320, p90: 341, average: 281, count: 62, ratio: 3.3 },
  { region: "울산", p10: 210, p25: 219, median: 230, p75: 231, p90: 244, average: 226, count: 65, ratio: 3.5 },
  { region: "경기도", p10: 216, p25: 248, median: 260, p75: 271, p90: 280, average: 255, count: 82, ratio: 4.4 },
  { region: "강원도", p10: 172, p25: 220, median: 243, p75: 260, p90: 270, average: 232, count: 67, ratio: 3.6 },
  { region: "충청도", p10: 212, p25: 260, median: 280, p75: 311, p90: 340, average: 283, count: 186, ratio: 9.9 },
  { region: "전라도", p10: 250, p25: 280, median: 310, p75: 351, p90: 403, average: 318, count: 209, ratio: 11.1 },
  { region: "경상도", p10: 166, p25: 166, median: 173, p75: 251, p90: 300, average: 212, count: 18, ratio: 1.0 },
  { region: "제주도", p10: null, p25: null, median: null, p75: null, p90: null, average: null, count: 0, ratio: 0 },
];

export const SDME_COST_SOURCE = "2026년 5월 스드메 패키지 통계";
