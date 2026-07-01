export type PercentileCostRow = {
  region: string;
  p10: number | null;
  p25: number | null;
  median: number | null;
  p75: number | null;
  p90: number | null;
  average: number | null;
  count: number;
  ratio: number;
};

/** 예식장 대관료 품목별 가격 (2026년 5월, 단위: 만원) */
export const VENUE_COST_DATA: PercentileCostRow[] = [
  { region: "전국", p10: 100, p25: 200, median: 340, p75: 550, p90: 880, average: 436, count: 5418, ratio: 100 },
  { region: "수도권", p10: 150, p25: 300, median: 530, p75: 800, p90: 1100, average: 605, count: 2721, ratio: 50.2 },
  { region: "비수도권", p10: 80, p25: 150, median: 267, p75: 370, p90: 450, average: 266, count: 2697, ratio: 49.8 },
  { region: "서울(강남)", p10: 150, p25: 430, median: 750, p75: 890, p90: 1300, average: 719, count: 661, ratio: 12.2 },
  { region: "서울(강남외)", p10: 190, p25: 330, median: 600, p75: 900, p90: 1500, average: 699, count: 1200, ratio: 22.1 },
  { region: "부산", p10: 50, p25: 100, median: 150, p75: 300, p90: 350, average: 196, count: 407, ratio: 7.5 },
  { region: "대구", p10: 61, p25: 80, median: 135, p75: 250, p90: 450, average: 202, count: 390, ratio: 7.2 },
  { region: "인천", p10: 100, p25: 180, median: 300, p75: 350, p90: 500, average: 279, count: 199, ratio: 3.7 },
  { region: "광주", p10: 70, p25: 100, median: 200, p75: 430, p90: 450, average: 243, count: 237, ratio: 4.4 },
  { region: "대전", p10: 180, p25: 250, median: 297, p75: 340, p90: 450, average: 290, count: 253, ratio: 4.7 },
  { region: "울산", p10: 280, p25: 280, median: 350, p75: 450, p90: 550, average: 366, count: 89, ratio: 1.6 },
  { region: "경기도", p10: 100, p25: 200, median: 400, p75: 600, p90: 700, average: 416, count: 661, ratio: 12.2 },
  { region: "강원도", p10: 120, p25: 200, median: 350, p75: 400, p90: 430, average: 311, count: 154, ratio: 2.8 },
  { region: "충청도", p10: 167, p25: 200, median: 350, p75: 500, p90: 600, average: 365, count: 309, ratio: 5.7 },
  { region: "전라도", p10: 130, p25: 200, median: 300, p75: 400, p90: 500, average: 320, count: 371, ratio: 6.8 },
  { region: "경상도", p10: 84, p25: 150, median: 280, p75: 370, p90: 400, average: 258, count: 423, ratio: 7.8 },
  { region: "제주도", p10: 0, p25: 0, median: 150, p75: 198, p90: 200, average: 115, count: 64, ratio: 1.2 },
];

export const VENUE_COST_SOURCE = "2026년 5월 예식장 대관료 통계";
