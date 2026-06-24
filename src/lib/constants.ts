export const STATUS_OPTIONS = [
  { value: "open", label: "모집중" },
  { value: "closed", label: "마감" },
  { value: "upcoming", label: "예정" },
] as const;

export type ExpoStatus = (typeof STATUS_OPTIONS)[number]["value"];

export const REGION_GROUPS = [
  { value: "seoul", label: "서울" },
  { value: "gyeonggi", label: "경기" },
  { value: "metropolitan", label: "광역시" },
  { value: "local", label: "지방" },
] as const;

export type RegionGroup = (typeof REGION_GROUPS)[number]["value"];

export const METROPOLITAN_CITIES = [
  { value: "busan", label: "부산" },
  { value: "incheon", label: "인천" },
  { value: "ulsan", label: "울산" },
  { value: "daegu", label: "대구" },
  { value: "gwangju", label: "광주" },
  { value: "daejeon", label: "대전" },
] as const;

export type MetropolitanCity = (typeof METROPOLITAN_CITIES)[number]["value"];

export const LOCAL_SUBREGIONS = [
  { value: "chungcheong", label: "충청" },
  { value: "jeolla", label: "전라" },
  { value: "gangwon", label: "강원" },
  { value: "gyeongsang", label: "경상" },
  { value: "jeju", label: "제주" },
] as const;

export type LocalSubregion = (typeof LOCAL_SUBREGIONS)[number]["value"];

export function getRegionLabel(regionGroup: string, regionSub: string) {
  if (regionGroup === "seoul") return "서울";
  if (regionGroup === "gyeonggi") return "경기";
  const metro = METROPOLITAN_CITIES.find((item) => item.value === regionSub);
  if (metro) return metro.label;
  const local = LOCAL_SUBREGIONS.find((item) => item.value === regionSub);
  if (local) return local.label;
  return regionSub || "기타";
}

export function getSubregionOptions(regionGroup: string) {
  if (regionGroup === "metropolitan") return METROPOLITAN_CITIES;
  if (regionGroup === "local") return LOCAL_SUBREGIONS;
  return [];
}
