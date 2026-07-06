import type { Metadata } from "next";
import type { MetropolitanCity, LocalSubregion } from "@/lib/constants";

export const SITE_NAME = "웨딩박람회 일정 모음";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const url = new URL(raw);
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
    }
    return url.origin;
  } catch {
    return raw.replace(/^https?:\/\/www\./i, (match) => match.replace("www.", ""));
  }
}

type RegionPageBase = {
  path: string;
  label: string;
  h1: string;
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  filter: {
    regionGroup: string;
    regionSub?: string;
  };
};

export const SEO_HOME = {
  path: "/",
  title: "웨딩박람회 일정 모음 | 전국 박람회·무료초대권 매주 업데이트",
  description:
    "서울·경기·광역시·지방 전국 웨딩박람회 일정을 한눈에 확인하세요. 코엑스, SETEC, 킨텍스 등 주요 박람회 무료초대권 신청 링크를 매주 업데이트합니다.",
  keywords: [
    "웨딩박람회",
    "웨딩페어",
    "결혼박람회",
    "무료초대권",
    "웨딩박람회 일정",
    "전국 웨딩박람회",
  ],
  h1: "전국 웨딩박람회 일정 모음",
  intro:
    "전국 웨딩박람회·웨딩페어 일정과 무료초대권 신청 정보를 지역별로 확인하세요. 매주 최신 일정으로 업데이트됩니다.",
};

export const SEO_SEOUL: RegionPageBase = {
  path: "/seoul",
  label: "서울",
  h1: "서울 웨딩박람회 일정",
  title: "서울 웨딩박람회 일정 2026 | 코엑스·SETEC·무료초대권",
  description:
    "서울 웨딩박람회·웨딩페어 최신 일정을 확인하세요. 코엑스, SETEC, 강남, 용산, 롯데월드타워 등 서울 대형 웨딩박람회 무료초대권 신청 링크를 매주 업데이트합니다.",
  keywords: ["서울 웨딩박람회", "서울 웨딩페어", "코엑스 웨딩박람회", "SETEC 웨딩박람회", "서울 결혼박람회", "서울 무료초대권"],
  intro:
    "서울에서 열리는 웨딩박람회·웨딩페어 일정을 모았습니다. 코엑스, SETEC, 강남, 용산 아이파크몰, 롯데월드타워 등 주요 장소의 박람회 일정과 무료초대권 신청 정보를 확인하세요.",
  filter: { regionGroup: "seoul" },
};

export const SEO_GYEONGGI: RegionPageBase = {
  path: "/gyeonggi",
  label: "경기",
  h1: "경기 웨딩박람회 일정",
  title: "경기 웨딩박람회 일정 2026 | 킨텍스·수원·일산·무료초대권",
  description:
    "경기도 웨딩박람회·웨딩페어 일정을 확인하세요. 킨텍스, 수원, 고양, 일산, 부천 등 경기 지역 대형 웨딩박람회 무료초대권 정보를 매주 업데이트합니다.",
  keywords: ["경기 웨딩박람회", "경기 웨딩페어", "킨텍스 웨딩박람회", "수원 웨딩박람회", "일산 웨딩박람회", "경기 무료초대권"],
  intro:
    "경기도에서 열리는 웨딩박람회 일정입니다. 킨텍스, 수원메쎄, 스타필드 고양, 부천 등 수도권 경기 지역 박람회 정보와 무료초대권 링크를 확인하세요.",
  filter: { regionGroup: "gyeonggi" },
};

export const GYEONGGI_AREAS = [
  { value: "suwon", label: "수원" },
  { value: "pyeongtaek", label: "평택" },
  { value: "uijeongbu", label: "의정부" },
  { value: "ilsan", label: "일산" },
  { value: "hanam", label: "하남" },
  { value: "gwangmyeong", label: "광명" },
] as const;

export type GyeonggiArea = (typeof GYEONGGI_AREAS)[number]["value"];

export const GYEONGGI_AREA_SEO: Record<GyeonggiArea, RegionPageBase> = {
  suwon: {
    path: "/gyeonggi/suwon",
    label: "수원",
    h1: "수원 웨딩박람회 일정",
    title: "수원 웨딩박람회 일정 2026 | 수원메쎄·광교·무료초대권",
    description:
      "수원 웨딩박람회·웨딩페어 최신 일정을 확인하세요. 수원메쎄, 광교, 영통 등 수원 지역 웨딩박람회 무료초대권 정보를 제공합니다.",
    keywords: ["수원 웨딩박람회", "수원 웨딩페어", "수원메쎄 웨딩박람회", "광교 웨딩박람회"],
    intro:
      "수원에서 열리는 웨딩박람회 일정입니다. 수원메쎄, 광교, 영통 등 주요 권역의 박람회 정보를 확인하세요.",
    filter: { regionGroup: "gyeonggi" },
  },
  pyeongtaek: {
    path: "/gyeonggi/pyeongtaek",
    label: "평택",
    h1: "평택 웨딩박람회 일정",
    title: "평택 웨딩박람회 일정 2026 | 평택·송탄·고덕·무료초대권",
    description:
      "평택 웨딩박람회·웨딩페어 일정을 확인하세요. 평택, 송탄, 고덕 등 경기 남부 박람회 무료초대권 정보를 제공합니다.",
    keywords: ["평택 웨딩박람회", "평택 웨딩페어", "송탄 웨딩박람회", "고덕 웨딩박람회"],
    intro:
      "평택에서 열리는 웨딩박람회 일정입니다. 평택, 송탄, 고덕 지역 박람회 정보를 한눈에 확인할 수 있습니다.",
    filter: { regionGroup: "gyeonggi" },
  },
  uijeongbu: {
    path: "/gyeonggi/uijeongbu",
    label: "의정부",
    h1: "의정부 웨딩박람회 일정",
    title: "의정부 웨딩박람회 일정 2026 | 의정부·경기북부·무료초대권",
    description:
      "의정부 웨딩박람회·웨딩페어 최신 일정을 확인하세요. 의정부 중심 경기북부 박람회 무료초대권 정보를 제공합니다.",
    keywords: ["의정부 웨딩박람회", "의정부 웨딩페어", "경기북부 웨딩박람회"],
    intro:
      "의정부에서 열리는 웨딩박람회 일정입니다. 경기북부 예비부부를 위한 박람회 정보를 모았습니다.",
    filter: { regionGroup: "gyeonggi" },
  },
  ilsan: {
    path: "/gyeonggi/ilsan",
    label: "일산",
    h1: "일산 웨딩박람회 일정",
    title: "일산 웨딩박람회 일정 2026 | 킨텍스·고양·무료초대권",
    description:
      "일산 웨딩박람회·웨딩페어 최신 일정을 확인하세요. 킨텍스, 고양, 대화 등 일산권 웨딩박람회 무료초대권 정보를 제공합니다.",
    keywords: ["일산 웨딩박람회", "킨텍스 웨딩박람회", "고양 웨딩박람회", "일산 웨딩페어"],
    intro:
      "일산에서 열리는 웨딩박람회 일정입니다. 킨텍스, 고양, 대화역 인근 박람회 정보를 확인하세요.",
    filter: { regionGroup: "gyeonggi" },
  },
  hanam: {
    path: "/gyeonggi/hanam",
    label: "하남",
    h1: "하남 웨딩박람회 일정",
    title: "하남 웨딩박람회 일정 2026 | 미사·하남·무료초대권",
    description:
      "하남 웨딩박람회·웨딩페어 일정 정보를 확인하세요. 하남, 미사, 감일 등 하남권 박람회 무료초대권 정보를 제공합니다.",
    keywords: ["하남 웨딩박람회", "미사 웨딩박람회", "하남 웨딩페어", "감일 웨딩박람회"],
    intro:
      "하남에서 열리는 웨딩박람회 일정입니다. 하남·미사 생활권 예비부부를 위한 박람회 정보를 확인하세요.",
    filter: { regionGroup: "gyeonggi" },
  },
  gwangmyeong: {
    path: "/gyeonggi/gwangmyeong",
    label: "광명",
    h1: "광명 웨딩박람회 일정",
    title: "광명 웨딩박람회 일정 2026 | 광명역·철산·무료초대권",
    description:
      "광명 웨딩박람회·웨딩페어 일정 정보를 확인하세요. 광명역, 철산 등 광명권 웨딩박람회 무료초대권 정보를 제공합니다.",
    keywords: ["광명 웨딩박람회", "광명역 웨딩박람회", "철산 웨딩박람회", "광명 웨딩페어"],
    intro:
      "광명에서 열리는 웨딩박람회 일정입니다. 광명역, 철산 등 광명권 박람회 정보를 확인하세요.",
    filter: { regionGroup: "gyeonggi" },
  },
};

export const SEO_METROPOLITAN_INDEX: RegionPageBase = {
  path: "/metropolitan",
  label: "광역시",
  h1: "광역시 웨딩박람회 일정",
  title: "광역시 웨딩박람회 일정 | 부산·인천·대구·대전·광주·울산",
  description:
    "부산, 인천, 대구, 대전, 광주, 울산 광역시 웨딩박람회·웨딩페어 일정과 무료초대권 정보를 지역별로 확인하세요.",
  keywords: ["광역시 웨딩박람회", "부산 웨딩박람회", "인천 웨딩박람회", "대구 웨딩박람회", "대전 웨딩박람회", "광주 웨딩박람회", "울산 웨딩박람회"],
  intro:
    "전국 광역시에서 열리는 웨딩박람회 일정입니다. 부산, 인천, 대구, 대전, 광주, 울산 지역별 박람회 정보를 선택해 확인하세요.",
  filter: { regionGroup: "metropolitan" },
};

export const SEO_LOCAL_INDEX: RegionPageBase = {
  path: "/local",
  label: "지방",
  h1: "지방 웨딩박람회 일정",
  title: "지방 웨딩박람회 일정 | 충청·전라·강원·경상·제주",
  description:
    "충청, 전라, 강원, 경상, 제주 지방 웨딩박람회·웨딩페어 일정과 무료초대권 정보를 지역별로 확인하세요.",
  keywords: ["지방 웨딩박람회", "충청 웨딩박람회", "전라 웨딩박람회", "강원 웨딩박람회", "경상 웨딩박람회", "제주 웨딩박람회"],
  intro:
    "수도권 외 지방에서 열리는 웨딩박람회 일정입니다. 충청, 전라, 강원, 경상, 제주 권역별로 박람회 정보를 확인하세요.",
  filter: { regionGroup: "local" },
};

export const METROPOLITAN_SEO: Record<MetropolitanCity, RegionPageBase> = {
  busan: {
    path: "/metropolitan/busan",
    label: "부산",
    h1: "부산 웨딩박람회 일정",
    title: "부산 웨딩박람회 일정 2026 | BEXCO·해운대·무료초대권",
    description:
      "부산 웨딩박람회·웨딩페어 최신 일정을 확인하세요. BEXCO, 해운대 등 부산 대형 웨딩박람회 무료초대권 신청 정보를 매주 업데이트합니다.",
    keywords: ["부산 웨딩박람회", "부산 웨딩페어", "BEXCO 웨딩박람회", "해운대 웨딩박람회", "부산 결혼박람회"],
    intro:
      "부산에서 열리는 웨딩박람회·웨딩페어 일정입니다. BEXCO, 해운대 등 영남권 최대 규모 박람회 정보와 무료초대권 링크를 확인하세요.",
    filter: { regionGroup: "metropolitan", regionSub: "busan" },
  },
  incheon: {
    path: "/metropolitan/incheon",
    label: "인천",
    h1: "인천 웨딩박람회 일정",
    title: "인천 웨딩박람회 일정 2026 | 송도·구월동·무료초대권",
    description:
      "인천 웨딩박람회·웨딩페어 최신 일정을 확인하세요. 송도, 구월동, IWC 등 인천 지역 웨딩박람회 무료초대권 신청 정보를 매주 업데이트합니다.",
    keywords: ["인천 웨딩박람회", "인천 웨딩페어", "송도 웨딩박람회", "구월동 웨딩박람회", "인천 결혼박람회"],
    intro:
      "인천에서 열리는 웨딩박람회·웨딩페어 일정입니다. 송도, 구월동, 남동구 등 인천 지역 박람회 정보와 무료초대권 링크를 확인하세요.",
    filter: { regionGroup: "metropolitan", regionSub: "incheon" },
  },
  ulsan: {
    path: "/metropolitan/ulsan",
    label: "울산",
    h1: "울산 웨딩박람회 일정",
    title: "울산 웨딩박람회 일정 2026 | 무료초대권·웨딩페어",
    description:
      "울산 웨딩박람회·웨딩페어 일정과 무료초대권 신청 정보를 확인하세요. 울산 지역 결혼박람회 일정을 매주 업데이트합니다.",
    keywords: ["울산 웨딩박람회", "울산 웨딩페어", "울산 결혼박람회", "울산 무료초대권"],
    intro: "울산에서 열리는 웨딩박람회·웨딩페어 일정과 무료초대권 신청 링크를 확인하세요.",
    filter: { regionGroup: "metropolitan", regionSub: "ulsan" },
  },
  daegu: {
    path: "/metropolitan/daegu",
    label: "대구",
    h1: "대구 웨딩박람회 일정",
    title: "대구 웨딩박람회 일정 2026 | EXCO·수성구·무료초대권",
    description:
      "대구 웨딩박람회·웨딩페어 최신 일정을 확인하세요. EXCO, 수성구 등 대구 지역 웨딩박람회 무료초대권 정보를 매주 업데이트합니다.",
    keywords: ["대구 웨딩박람회", "대구 웨딩페어", "EXCO 웨딩박람회", "대구 결혼박람회"],
    intro: "대구에서 열리는 웨딩박람회·웨딩페어 일정입니다. EXCO 등 대구 지역 박람회 정보를 확인하세요.",
    filter: { regionGroup: "metropolitan", regionSub: "daegu" },
  },
  gwangju: {
    path: "/metropolitan/gwangju",
    label: "광주",
    h1: "광주 웨딩박람회 일정",
    title: "광주 웨딩박람회 일정 2026 | 김대중컨벤션·무료초대권",
    description:
      "광주 웨딩박람회·웨딩페어 일정과 무료초대권 신청 정보를 확인하세요. 호남권 웨딩박람회 일정을 매주 업데이트합니다.",
    keywords: ["광주 웨딩박람회", "광주 웨딩페어", "광주 결혼박람회", "호남 웨딩박람회"],
    intro: "광주에서 열리는 웨딩박람회·웨딩페어 일정과 무료초대권 링크를 확인하세요.",
    filter: { regionGroup: "metropolitan", regionSub: "gwangju" },
  },
  daejeon: {
    path: "/metropolitan/daejeon",
    label: "대전",
    h1: "대전 웨딩박람회 일정",
    title: "대전 웨딩박람회 일정 2026 | DCC·충청·무료초대권",
    description:
      "대전 웨딩박람회·웨딩페어 최신 일정을 확인하세요. DCC 대전컨벤션센터 등 충청권 웨딩박람회 무료초대권 정보를 매주 업데이트합니다.",
    keywords: ["대전 웨딩박람회", "대전 웨딩페어", "DCC 웨딩박람회", "충청 웨딩박람회"],
    intro: "대전에서 열리는 웨딩박람회·웨딩페어 일정입니다. DCC 등 충청권 박람회 정보를 확인하세요.",
    filter: { regionGroup: "metropolitan", regionSub: "daejeon" },
  },
};

export const LOCAL_SEO: Record<LocalSubregion, RegionPageBase> = {
  chungcheong: {
    path: "/local/chungcheong",
    label: "충청",
    h1: "충청 웨딩박람회 일정",
    title: "충청 웨딩박람회 일정 2026 | 천안·청주·무료초대권",
    description:
      "충청도(충북·충남) 웨딩박람회·웨딩페어 일정을 확인하세요. 천안, 청주, 세종 등 충청권 박람회 무료초대권 정보를 매주 업데이트합니다.",
    keywords: ["충청 웨딩박람회", "천안 웨딩박람회", "청주 웨딩박람회", "충남 웨딩박람회", "충북 웨딩박람회"],
    intro: "충청권에서 열리는 웨딩박람회·웨딩페어 일정입니다. 천안, 청주, 세종 등 지역 박람회 정보를 확인하세요.",
    filter: { regionGroup: "local", regionSub: "chungcheong" },
  },
  jeolla: {
    path: "/local/jeolla",
    label: "전라",
    h1: "전라 웨딩박람회 일정",
    title: "전라 웨딩박람회 일정 2026 | 전북·전남·무료초대권",
    description:
      "전라도(전북·전남) 웨딩박람회·웨딩페어 일정을 확인하세요. 전주, 여수, 목포 등 전라권 박람회 무료초대권 정보를 매주 업데이트합니다.",
    keywords: ["전라 웨딩박람회", "전주 웨딩박람회", "전북 웨딩박람회", "전남 웨딩박람회"],
    intro: "전라권에서 열리는 웨딩박람회·웨딩페어 일정입니다. 전북, 전남 지역 박람회 정보를 확인하세요.",
    filter: { regionGroup: "local", regionSub: "jeolla" },
  },
  gangwon: {
    path: "/local/gangwon",
    label: "강원",
    h1: "강원 웨딩박람회 일정",
    title: "강원 웨딩박람회 일정 2026 | 춘천·원주·무료초대권",
    description:
      "강원도 웨딩박람회·웨딩페어 일정을 확인하세요. 춘천, 원주, 강릉 등 강원 지역 박람회 무료초대권 정보를 매주 업데이트합니다.",
    keywords: ["강원 웨딩박람회", "춘천 웨딩박람회", "원주 웨딩박람회", "강릉 웨딩박람회"],
    intro: "강원도에서 열리는 웨딩박람회·웨딩페어 일정과 무료초대권 신청 링크를 확인하세요.",
    filter: { regionGroup: "local", regionSub: "gangwon" },
  },
  gyeongsang: {
    path: "/local/gyeongsang",
    label: "경상",
    h1: "경상 웨딩박람회 일정",
    title: "경상 웨딩박람회 일정 2026 | 경북·경남·무료초대권",
    description:
      "경상도(경북·경남) 웨딩박람회·웨딩페어 일정을 확인하세요. 포항, 창원, 진주 등 경상권 박람회 무료초대권 정보를 매주 업데이트합니다.",
    keywords: ["경상 웨딩박람회", "경북 웨딩박람회", "경남 웨딩박람회", "포항 웨딩박람회", "창원 웨딩박람회"],
    intro: "경상권에서 열리는 웨딩박람회·웨딩페어 일정입니다. 경북, 경남 지역 박람회 정보를 확인하세요.",
    filter: { regionGroup: "local", regionSub: "gyeongsang" },
  },
  jeju: {
    path: "/local/jeju",
    label: "제주",
    h1: "제주 웨딩박람회 일정",
    title: "제주 웨딩박람회 일정 2026 | 제주시·서귀포·무료초대권",
    description:
      "제주 웨딩박람회·웨딩페어 일정을 확인하세요. 제주시, 서귀포 등 제주 지역 결혼박람회 무료초대권 정보를 매주 업데이트합니다.",
    keywords: ["제주 웨딩박람회", "제주 웨딩페어", "제주 결혼박람회", "제주 무료초대권"],
    intro: "제주에서 열리는 웨딩박람회·웨딩페어 일정과 무료초대권 신청 링크를 확인하세요.",
    filter: { regionGroup: "local", regionSub: "jeju" },
  },
};

export const LOCAL_CITY_AREAS: Partial<
  Record<LocalSubregion, readonly { value: string; label: string }[]>
> = {
  chungcheong: [
    { value: "cheonan", label: "천안" },
    { value: "cheongju", label: "청주" },
  ],
  jeolla: [
    { value: "gwangju", label: "광주" },
    { value: "jeonju", label: "전주" },
  ],
  gangwon: [
    { value: "gangneung", label: "강릉" },
    { value: "chuncheon", label: "춘천" },
  ],
  gyeongsang: [
    { value: "changwon", label: "창원" },
    { value: "jinju", label: "진주" },
    { value: "pohang", label: "포항" },
  ],
};

export const LOCAL_CITY_SEO: Partial<
  Record<LocalSubregion, Record<string, RegionPageBase>>
> = {
  chungcheong: {
    cheonan: {
      path: "/local/chungcheong/cheonan",
      label: "천안",
      h1: "천안 웨딩박람회 일정",
      title: "천안 웨딩박람회 일정 2026 | 천안·아산·무료초대권",
      description:
        "천안 웨딩박람회·웨딩페어 최신 일정을 확인하세요. 천안, 아산 등 충남 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["천안 웨딩박람회", "천안 웨딩페어", "아산 웨딩박람회", "충남 웨딩박람회"],
      intro: "천안에서 열리는 웨딩박람회 일정입니다. 천안, 아산 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "chungcheong" },
    },
    cheongju: {
      path: "/local/chungcheong/cheongju",
      label: "청주",
      h1: "청주 웨딩박람회 일정",
      title: "청주 웨딩박람회 일정 2026 | 청주·오창·무료초대권",
      description:
        "청주 웨딩박람회·웨딩페어 최신 일정을 확인하세요. 청주, 오창 등 충북 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["청주 웨딩박람회", "청주 웨딩페어", "오창 웨딩박람회", "충북 웨딩박람회"],
      intro: "청주에서 열리는 웨딩박람회 일정입니다. 청주, 오창 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "chungcheong" },
    },
  },
  jeolla: {
    gwangju: {
      path: "/local/jeolla/gwangju",
      label: "광주",
      h1: "광주 웨딩박람회 일정",
      title: "광주 웨딩박람회 일정 2026 | 전라권·무료초대권",
      description:
        "광주 웨딩박람회·웨딩페어 일정을 확인하세요. 전라권 광주 지역 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["광주 웨딩박람회", "광주 웨딩페어", "전라 웨딩박람회", "광산 웨딩박람회"],
      intro: "광주에서 열리는 웨딩박람회 일정입니다. 전라권 광주 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "jeolla" },
    },
    jeonju: {
      path: "/local/jeolla/jeonju",
      label: "전주",
      h1: "전주 웨딩박람회 일정",
      title: "전주 웨딩박람회 일정 2026 | 전북·무료초대권",
      description:
        "전주 웨딩박람회·웨딩페어 최신 일정을 확인하세요. 전주, 완산, 덕진 등 전북 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["전주 웨딩박람회", "전주 웨딩페어", "전북 웨딩박람회"],
      intro: "전주에서 열리는 웨딩박람회 일정입니다. 전북 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "jeolla" },
    },
  },
  gangwon: {
    gangneung: {
      path: "/local/gangwon/gangneung",
      label: "강릉",
      h1: "강릉 웨딩박람회 일정",
      title: "강릉 웨딩박람회 일정 2026 | 동해안·무료초대권",
      description:
        "강릉 웨딩박람회·웨딩페어 일정을 확인하세요. 강릉, 경포 등 동해안 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["강릉 웨딩박람회", "강릉 웨딩페어", "동해안 웨딩박람회"],
      intro: "강릉에서 열리는 웨딩박람회 일정입니다. 동해안 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "gangwon" },
    },
    chuncheon: {
      path: "/local/gangwon/chuncheon",
      label: "춘천",
      h1: "춘천 웨딩박람회 일정",
      title: "춘천 웨딩박람회 일정 2026 | 강원·무료초대권",
      description:
        "춘천 웨딩박람회·웨딩페어 일정을 확인하세요. 춘천, 소양 등 강원 서부 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["춘천 웨딩박람회", "춘천 웨딩페어", "강원 웨딩박람회"],
      intro: "춘천에서 열리는 웨딩박람회 일정입니다. 강원 서부 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "gangwon" },
    },
  },
  gyeongsang: {
    changwon: {
      path: "/local/gyeongsang/changwon",
      label: "창원",
      h1: "창원 웨딩박람회 일정",
      title: "창원 웨딩박람회 일정 2026 | 마산·진해·무료초대권",
      description:
        "창원 웨딩박람회·웨딩페어 일정을 확인하세요. 창원, 마산, 진해 등 경남 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["창원 웨딩박람회", "창원 웨딩페어", "마산 웨딩박람회", "진해 웨딩박람회"],
      intro: "창원에서 열리는 웨딩박람회 일정입니다. 창원, 마산, 진해 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "gyeongsang" },
    },
    jinju: {
      path: "/local/gyeongsang/jinju",
      label: "진주",
      h1: "진주 웨딩박람회 일정",
      title: "진주 웨딩박람회 일정 2026 | 경남·무료초대권",
      description:
        "진주 웨딩박람회·웨딩페어 일정을 확인하세요. 진주 지역 경남 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["진주 웨딩박람회", "진주 웨딩페어", "경남 웨딩박람회"],
      intro: "진주에서 열리는 웨딩박람회 일정입니다. 경남 남부 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "gyeongsang" },
    },
    pohang: {
      path: "/local/gyeongsang/pohang",
      label: "포항",
      h1: "포항 웨딩박람회 일정",
      title: "포항 웨딩박람회 일정 2026 | 경북·무료초대권",
      description:
        "포항 웨딩박람회·웨딩페어 일정을 확인하세요. 포항 지역 경북 박람회 무료초대권 정보를 제공합니다.",
      keywords: ["포항 웨딩박람회", "포항 웨딩페어", "경북 웨딩박람회"],
      intro: "포항에서 열리는 웨딩박람회 일정입니다. 경북 동해안 지역 박람회 정보를 확인하세요.",
      filter: { regionGroup: "local", regionSub: "gyeongsang" },
    },
  },
};

export function getLocalCityConfig(region: string, city: string) {
  return LOCAL_CITY_SEO[region as LocalSubregion]?.[city];
}

export function getLocalCitySubLinks(region: LocalSubregion) {
  const areas = LOCAL_CITY_AREAS[region];
  const seo = LOCAL_CITY_SEO[region];
  if (!areas || !seo) return [];

  return areas.map((area) => ({
    href: seo[area.value].path,
    label: area.label,
  }));
}

export const ALL_LOCAL_CITY_PAGES = Object.values(LOCAL_CITY_SEO).flatMap((cities) =>
  Object.values(cities),
);

export const ALL_REGION_PAGES = [
  SEO_SEOUL,
  SEO_GYEONGGI,
  ...Object.values(GYEONGGI_AREA_SEO),
  SEO_METROPOLITAN_INDEX,
  ...Object.values(METROPOLITAN_SEO),
  SEO_LOCAL_INDEX,
  ...Object.values(LOCAL_SEO),
  ...ALL_LOCAL_CITY_PAGES,
];

export function buildPageMetadata(page: {
  path: string;
  title: string;
  description: string;
  keywords: string[];
}): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${page.path}`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title: page.title,
      description: page.description,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

type ExpoForJsonLd = {
  title: string;
  location: string;
  startDate: Date;
  endDate: Date;
  linkUrl: string | null;
};

export function buildEventListJsonLd(page: RegionPageBase, expos: ExpoForJsonLd[]) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteUrl}${page.path}#webpage`,
        url: `${siteUrl}${page.path}`,
        name: page.h1,
        description: page.description,
        inLanguage: "ko-KR",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${siteUrl}/#website`,
          name: SITE_NAME,
          url: siteUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "홈", item: siteUrl },
          { "@type": "ListItem", position: 2, name: page.label, item: `${siteUrl}${page.path}` },
        ],
      },
      {
        "@type": "ItemList",
        name: `${page.label} 웨딩박람회 목록`,
        numberOfItems: expos.length,
        itemListElement: expos.map((expo, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Event",
            name: expo.title,
            location: {
              "@type": "Place",
              name: expo.location,
              address: expo.location,
            },
            startDate: expo.startDate.toISOString(),
            endDate: expo.endDate.toISOString(),
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            url: expo.linkUrl ?? `${siteUrl}${page.path}`,
          },
        })),
      },
    ],
  };
}
