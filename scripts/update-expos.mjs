import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const SOURCE_URL =
  process.env.EXPO_SOURCE_URL ??
  "https://ad.cpaad.co.kr/wedunited01drc/kysgh3";
const OUTPUT_PATH = resolve("src/data/expos.generated.json");

function decodeHtml(value) {
  const entities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (match, name) => entities[name] ?? match);
}

function textFromHtml(value) {
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function getClassHtml(card, className) {
  const match = card.match(
    new RegExp(
      `<(?:div|p)[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/(?:div|p)>`,
      "i",
    ),
  );
  return match?.[1] ?? "";
}

function inferRegion(location) {
  const normalized = location.replace(/^서울시\b/, "서울");
  if (normalized.startsWith("서울")) {
    return { regionGroup: "seoul", regionSub: "", regionLabel: "서울" };
  }
  if (normalized.startsWith("경기")) {
    return { regionGroup: "gyeonggi", regionSub: "", regionLabel: "경기" };
  }

  const metro = [
    ["부산", "busan"],
    ["인천", "incheon"],
    ["울산", "ulsan"],
    ["대구", "daegu"],
    ["광주", "gwangju"],
    ["대전", "daejeon"],
  ];
  const metroMatch = metro.find(([label]) => normalized.startsWith(label));
  if (metroMatch) {
    return {
      regionGroup: "metropolitan",
      regionSub: metroMatch[1],
      regionLabel: metroMatch[0],
    };
  }

  const local = [
    [/^(충북|충남|충청|세종)/, "chungcheong", "충청"],
    [/^(전북|전남|전라)/, "jeolla", "전라"],
    [/^강원/, "gangwon", "강원"],
    [/^(경북|경남|경상)/, "gyeongsang", "경상"],
    [/^제주/, "jeju", "제주"],
  ];
  const localMatch = local.find(([pattern]) => pattern.test(normalized));
  if (localMatch) {
    return {
      regionGroup: "local",
      regionSub: localMatch[1],
      regionLabel: localMatch[2],
    };
  }

  return { regionGroup: "local", regionSub: "", regionLabel: "기타" };
}

function seoulTodayParts() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function toIsoDate(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00.000+09:00`;
}

function inferYear(month, currentYear, currentMonth) {
  return month < currentMonth - 6 ? currentYear + 1 : currentYear;
}

function parseSchedule(dateText) {
  const today = seoulTodayParts();
  const currentYear = Number(today.year);
  const currentMonth = Number(today.month);

  if (/매주\s*(주말|토|일)/.test(dateText)) {
    const start = new Date(
      toIsoDate(currentYear, Number(today.month), Number(today.day)),
    );
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 365);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      isWeeklyWeekend: true,
    };
  }

  const matches = [...dateText.matchAll(/(\d{1,2})월\s*(\d{1,2})일/g)];
  if (matches.length === 0) return null;

  const startMonth = Number(matches[0][1]);
  const startDay = Number(matches[0][2]);
  const startYear = inferYear(startMonth, currentYear, currentMonth);
  const endMonth = Number(matches[1]?.[1] ?? startMonth);
  const endDay = Number(matches[1]?.[2] ?? startDay);
  const endYear = endMonth < startMonth ? startYear + 1 : startYear;

  return {
    startDate: new Date(toIsoDate(startYear, startMonth, startDay)).toISOString(),
    endDate: new Date(toIsoDate(endYear, endMonth, endDay)).toISOString(),
    isWeeklyWeekend: false,
  };
}

function normalizeUrl(value) {
  if (!value) return null;
  if (value.startsWith("//")) return `https:${value}`;
  return new URL(value, SOURCE_URL).href;
}

function parseCards(html) {
  const cardMatches = [
    ...html.matchAll(
      /<div[^>]*class=["'][^"']*\bgoods01\b[^"']*["'][^>]*>([\s\S]*?)<\/a>\s*<\/div>/gi,
    ),
  ];

  const items = cardMatches.flatMap((match, index) => {
    const card = match[1];
    const href = card.match(/<a[^>]+href=["']([^"']+)["']/i)?.[1];
    const imageUrl = card.match(
      /<img[^>]+src=(?:["']([^"']+)["']|([^\s>]+))/i,
    );
    const title = textFromHtml(getClassHtml(card, "ad_title"));
    const dateText = textFromHtml(getClassHtml(card, "ad_date"));
    const location = textFromHtml(getClassHtml(card, "ad_location"));
    const schedule = parseSchedule(dateText);

    if (!title || !location || !href || !schedule) return [];

    const linkUrl = normalizeUrl(href);
    const id = `source-${createHash("sha1")
      .update(linkUrl)
      .digest("hex")
      .slice(0, 20)}`;

    return [
      {
        id,
        title,
        location,
        ...inferRegion(location),
        ...schedule,
        status: "open",
        imageUrl: normalizeUrl(imageUrl?.[1] ?? imageUrl?.[2]),
        linkUrl,
        sortOrder: index,
        clickCount: 0,
        tags: [],
        isPublished: true,
      },
    ];
  });

  return [...new Map(items.map((item) => [item.linkUrl, item])).values()];
}

const html = process.env.EXPO_SOURCE_FILE
  ? await readFile(resolve(process.env.EXPO_SOURCE_FILE), "utf8")
  : await (async () => {
      const response = await fetch(SOURCE_URL, {
        headers: {
          accept: "text/html,application/xhtml+xml",
          "user-agent":
            "Mozilla/5.0 (compatible; WeddingLastScheduleUpdater/1.0; +https://weddinglast.com)",
        },
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        throw new Error(
          `Source request failed: ${response.status} ${response.statusText}`,
        );
      }
      return response.text();
    })();
const expos = parseCards(html);
if (expos.length < 10) {
  throw new Error(`Parsed only ${expos.length} expos; refusing to replace data.`);
}

const payload = {
  sourceUrl: SOURCE_URL,
  generatedAt: new Date().toISOString(),
  expos,
};

let existingExpos = null;
try {
  const existing = JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
  existingExpos = existing.expos;
} catch {
  // The first run has no generated file yet.
}

if (JSON.stringify(existingExpos) === JSON.stringify(expos)) {
  console.log(`No schedule changes (${expos.length} expos).`);
} else {
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Updated ${expos.length} expos in ${OUTPUT_PATH}`);
}
