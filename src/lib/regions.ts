import type { Metadata } from "next";
import type { MetropolitanCity, LocalSubregion } from "@/lib/constants";

export const SITE_NAME = "웨딩박람회 일정 모음";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
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

export const SEO_CONTENT = {
  path: "/content",
  label: "콘텐츠",
  h1: "웨딩 콘텐츠",
  title: "웨딩 콘텐츠 | 결혼 준비·박람회 꿀팁",
  description:
    "웨딩박람회 방문 팁, 결혼 준비 정보, 웨딩 관련 유용한 글을 모았습니다. 사진과 함께 읽기 쉬운 웨딩 콘텐츠를 확인하세요.",
  keywords: [
    "웨딩 콘텐츠",
    "결혼 준비",
    "웨딩박람회 꿀팁",
    "웨딩 정보",
    "결혼 준비 블로그",
  ],
  intro:
    "웨딩박람회와 결혼 준비에 도움이 되는 글을 모았습니다. 사진과 함께 차근차근 읽어보세요.",
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

export const ALL_REGION_PAGES = [
  SEO_SEOUL,
  SEO_GYEONGGI,
  SEO_METROPOLITAN_INDEX,
  ...Object.values(METROPOLITAN_SEO),
  SEO_LOCAL_INDEX,
  ...Object.values(LOCAL_SEO),
  SEO_CONTENT,
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
