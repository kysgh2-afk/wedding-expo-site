import type { LocalSubregion } from "@/lib/constants";

type ExpoForCityFilter = {
  title: string;
  location: string;
  tags?: string[];
};

const LOCAL_CITY_KEYWORDS: Partial<
  Record<LocalSubregion, Record<string, string[]>>
> = {
  chungcheong: {
    cheonan: ["천안", "아산", "두정"],
    cheongju: ["청주", "오창", "상당"],
  },
  jeolla: {
    gwangju: ["광주", "광산", "수완"],
    jeonju: ["전주", "완산", "덕진"],
  },
  gangwon: {
    gangneung: ["강릉", "경포"],
    chuncheon: ["춘천", "소양"],
  },
  gyeongsang: {
    changwon: ["창원", "마산", "진해"],
    jinju: ["진주"],
    pohang: ["포항"],
  },
};

export function filterLocalExposByCity<T extends ExpoForCityFilter>(
  expos: T[],
  region: LocalSubregion,
  city: string,
) {
  const keywords = LOCAL_CITY_KEYWORDS[region]?.[city];
  if (!keywords) return [];

  return expos.filter((expo) => {
    const haystack = [expo.title, expo.location, ...(expo.tags ?? [])]
      .join(" ")
      .toLowerCase();

    return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
  });
}
