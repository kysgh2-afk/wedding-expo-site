export type CostPart = {
  amount: number;
  ratio: number;
};

export type RegionalCostRow = {
  region: string;
  venueRental: CostPart;
  decoration: CostPart;
  food: CostPart;
  sdme: CostPart;
  total: CostPart;
  count: number;
  countRatio: number;
};

/** 지역별 결혼서비스 계약 금액 (2026년 5월 기준, 단위: 만원) */
export const REGIONAL_COST_DATA: RegionalCostRow[] = [
  {
    region: "전국",
    venueRental: { amount: 436, ratio: 20.4 },
    decoration: { amount: 69, ratio: 3.2 },
    food: { amount: 1318, ratio: 61.5 },
    sdme: { amount: 319, ratio: 14.9 },
    total: { amount: 2142, ratio: 100 },
    count: 7304,
    countRatio: 100,
  },
  {
    region: "수도권",
    venueRental: { amount: 605, ratio: 22.1 },
    decoration: { amount: 120, ratio: 4.4 },
    food: { amount: 1644, ratio: 60.0 },
    sdme: { amount: 371, ratio: 13.5 },
    total: { amount: 2740, ratio: 100 },
    count: 3480,
    countRatio: 47.6,
  },
  {
    region: "비수도권",
    venueRental: { amount: 266, ratio: 17.1 },
    decoration: { amount: 18, ratio: 1.2 },
    food: { amount: 989, ratio: 63.6 },
    sdme: { amount: 283, ratio: 18.2 },
    total: { amount: 1556, ratio: 100 },
    count: 3824,
    countRatio: 52.4,
  },
  {
    region: "서울(강남)",
    venueRental: { amount: 719, ratio: 21.3 },
    decoration: { amount: 234, ratio: 6.9 },
    food: { amount: 2015, ratio: 59.7 },
    sdme: { amount: 406, ratio: 12.0 },
    total: { amount: 3375, ratio: 100 },
    count: 1252,
    countRatio: 17.1,
  },
  {
    region: "서울(강남외)",
    venueRental: { amount: 699, ratio: 22.7 },
    decoration: { amount: 114, ratio: 3.7 },
    food: { amount: 1763, ratio: 57.2 },
    sdme: { amount: 507, ratio: 16.4 },
    total: { amount: 3083, ratio: 100 },
    count: 1205,
    countRatio: 16.5,
  },
  {
    region: "부산",
    venueRental: { amount: 196, ratio: 15.9 },
    decoration: { amount: 0, ratio: 0 },
    food: { amount: 758, ratio: 61.5 },
    sdme: { amount: 279, ratio: 22.6 },
    total: { amount: 1232, ratio: 100 },
    count: 591,
    countRatio: 8.1,
  },
  {
    region: "대구",
    venueRental: { amount: 202, ratio: 13.1 },
    decoration: { amount: 37, ratio: 2.4 },
    food: { amount: 1042, ratio: 67.4 },
    sdme: { amount: 267, ratio: 17.3 },
    total: { amount: 1547, ratio: 100 },
    count: 587,
    countRatio: 8.0,
  },
  {
    region: "인천",
    venueRental: { amount: 279, ratio: 18.3 },
    decoration: { amount: 17, ratio: 1.1 },
    food: { amount: 1006, ratio: 65.9 },
    sdme: { amount: 225, ratio: 14.7 },
    total: { amount: 1527, ratio: 100 },
    count: 280,
    countRatio: 3.8,
  },
  {
    region: "광주",
    venueRental: { amount: 243, ratio: 13.8 },
    decoration: { amount: 1, ratio: 0.1 },
    food: { amount: 1177, ratio: 67.0 },
    sdme: { amount: 336, ratio: 19.1 },
    total: { amount: 1756, ratio: 100 },
    count: 365,
    countRatio: 5.0,
  },
  {
    region: "대전",
    venueRental: { amount: 290, ratio: 17.0 },
    decoration: { amount: 61, ratio: 3.6 },
    food: { amount: 1077, ratio: 63.1 },
    sdme: { amount: 281, ratio: 16.5 },
    total: { amount: 1708, ratio: 100 },
    count: 315,
    countRatio: 4.3,
  },
  {
    region: "울산",
    venueRental: { amount: 366, ratio: 21.6 },
    decoration: { amount: 9, ratio: 0.5 },
    food: { amount: 1092, ratio: 64.5 },
    sdme: { amount: 226, ratio: 13.4 },
    total: { amount: 1692, ratio: 100 },
    count: 154,
    countRatio: 2.1,
  },
  {
    region: "경기도",
    venueRental: { amount: 416, ratio: 21.1 },
    decoration: { amount: 48, ratio: 2.4 },
    food: { amount: 1249, ratio: 63.4 },
    sdme: { amount: 255, ratio: 13.0 },
    total: { amount: 1969, ratio: 100 },
    count: 743,
    countRatio: 10.2,
  },
  {
    region: "강원도",
    venueRental: { amount: 311, ratio: 17.7 },
    decoration: { amount: 42, ratio: 2.4 },
    food: { amount: 1178, ratio: 66.9 },
    sdme: { amount: 232, ratio: 13.2 },
    total: { amount: 1762, ratio: 100 },
    count: 221,
    countRatio: 3.0,
  },
  {
    region: "충청도",
    venueRental: { amount: 365, ratio: 22.0 },
    decoration: { amount: 14, ratio: 0.8 },
    food: { amount: 998, ratio: 60.1 },
    sdme: { amount: 283, ratio: 17.0 },
    total: { amount: 1660, ratio: 100 },
    count: 495,
    countRatio: 6.8,
  },
  {
    region: "전라도",
    venueRental: { amount: 320, ratio: 18.9 },
    decoration: { amount: 13, ratio: 0.8 },
    food: { amount: 1038, ratio: 61.4 },
    sdme: { amount: 318, ratio: 18.8 },
    total: { amount: 1690, ratio: 100 },
    count: 580,
    countRatio: 7.9,
  },
  {
    region: "경상도",
    venueRental: { amount: 258, ratio: 20.3 },
    decoration: { amount: 0, ratio: 0 },
    food: { amount: 802, ratio: 63.1 },
    sdme: { amount: 212, ratio: 16.7 },
    total: { amount: 1272, ratio: 100 },
    count: 441,
    countRatio: 6.0,
  },
  {
    region: "제주도",
    venueRental: { amount: 115, ratio: 6.7 },
    decoration: { amount: 48, ratio: 2.8 },
    food: { amount: 1402, ratio: 82.1 },
    sdme: { amount: 141, ratio: 8.3 },
    total: { amount: 1707, ratio: 100 },
    count: 75,
    countRatio: 1.0,
  },
];

export const REGIONAL_COST_SOURCE = "2026년 5월 결혼서비스 계약 통계";
