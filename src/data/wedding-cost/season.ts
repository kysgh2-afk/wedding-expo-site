export type SeasonCostRow = {
  period: string;
  label: string;
  venue: { amount: number; count: number; ratio: number };
  sdme: { amount: number; count: number; ratio: number };
};

function formatPeriodLabel(period: string) {
  const match = period.match(/^(\d{4})년(\d{2})월$/);
  if (!match) return period;
  return `${match[1]}년 ${Number(match[2])}월`;
}

const RAW_SEASON_DATA: Omit<SeasonCostRow, "label">[] = [
  { period: "2026년05월", venue: { amount: 1740, count: 7456, ratio: 13.3 }, sdme: { amount: 289, count: 2475, ratio: 13.0 } },
  { period: "2026년06월", venue: { amount: 1640, count: 7194, ratio: 12.9 }, sdme: { amount: 290, count: 2394, ratio: 12.6 } },
  { period: "2026년07월", venue: { amount: 1400, count: 3451, ratio: 6.2 }, sdme: { amount: 290, count: 1795, ratio: 9.5 } },
  { period: "2026년08월", venue: { amount: 1300, count: 2944, ratio: 5.3 }, sdme: { amount: 290, count: 1398, ratio: 7.4 } },
  { period: "2026년09월", venue: { amount: 1600, count: 4212, ratio: 7.5 }, sdme: { amount: 291, count: 1533, ratio: 8.1 } },
  { period: "2026년10월", venue: { amount: 1519, count: 6094, ratio: 10.9 }, sdme: { amount: 296, count: 1636, ratio: 8.6 } },
  { period: "2026년11월", venue: { amount: 1494, count: 5160, ratio: 9.2 }, sdme: { amount: 300, count: 1593, ratio: 8.4 } },
  { period: "2026년12월", venue: { amount: 1497, count: 4104, ratio: 7.3 }, sdme: { amount: 300, count: 1411, ratio: 7.4 } },
  { period: "2027년01월", venue: { amount: 1380, count: 2241, ratio: 4.0 }, sdme: { amount: 300, count: 1028, ratio: 5.4 } },
  { period: "2027년02월", venue: { amount: 1400, count: 1968, ratio: 3.5 }, sdme: { amount: 300, count: 937, ratio: 4.9 } },
  { period: "2027년03월", venue: { amount: 1600, count: 2593, ratio: 4.6 }, sdme: { amount: 298, count: 725, ratio: 3.8 } },
  { period: "2027년04월", venue: { amount: 1610, count: 2370, ratio: 4.2 }, sdme: { amount: 300, count: 559, ratio: 2.9 } },
  { period: "2027년05월", venue: { amount: 1540, count: 1754, ratio: 3.1 }, sdme: { amount: 300, count: 465, ratio: 2.4 } },
  { period: "2027년06월", venue: { amount: 1538, count: 1477, ratio: 2.6 }, sdme: { amount: 300, count: 332, ratio: 1.7 } },
  { period: "2027년07월", venue: { amount: 1400, count: 1082, ratio: 1.9 }, sdme: { amount: 299, count: 322, ratio: 1.7 } },
  { period: "2027년08월", venue: { amount: 1400, count: 727, ratio: 1.3 }, sdme: { amount: 297, count: 181, ratio: 1.0 } },
  { period: "2027년09월", venue: { amount: 1628, count: 715, ratio: 1.3 }, sdme: { amount: 275, count: 107, ratio: 0.6 } },
  { period: "2027년10월", venue: { amount: 1575, count: 417, ratio: 0.7 }, sdme: { amount: 330, count: 92, ratio: 0.5 } },
];

/** 예식 시기별 계약 가격 (단위: 만원) */
export const SEASON_COST_DATA: SeasonCostRow[] = RAW_SEASON_DATA.map((row) => ({
  ...row,
  label: formatPeriodLabel(row.period),
}));

export const SEASON_COST_SOURCE = "예식 시기별 계약 가격 통계";
