import type { GyeonggiArea } from "@/lib/regions";

type ExpoForAreaFilter = {
  title: string;
  location: string;
  tags?: string[];
};

const GYEONGGI_AREA_KEYWORDS: Record<GyeonggiArea, string[]> = {
  suwon: ["수원", "광교", "영통"],
  pyeongtaek: ["평택", "송탄", "고덕"],
  uijeongbu: ["의정부"],
  ilsan: ["일산", "고양", "킨텍스", "대화"],
  hanam: ["하남", "미사", "감일"],
  gwangmyeong: ["광명", "광명역", "철산"],
};

export function filterGyeonggiExposByArea<T extends ExpoForAreaFilter>(
  expos: T[],
  area: GyeonggiArea,
) {
  const keywords = GYEONGGI_AREA_KEYWORDS[area];

  return expos.filter((expo) => {
    const haystack = [expo.title, expo.location, ...(expo.tags ?? [])]
      .join(" ")
      .toLowerCase();

    return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
  });
}

