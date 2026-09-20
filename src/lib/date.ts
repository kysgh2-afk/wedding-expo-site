import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { koreaDay } from "@/lib/expo-calendar.mjs";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatKoreanDateRange(start: Date, end: Date) {
  const startText = koreaDay(start).replaceAll('-', '.');
  const endText = koreaDay(end).replaceAll('-', '.');
  const startDay = DAY_LABELS[new Date(koreaDay(start)).getUTCDay()];
  const endDay = DAY_LABELS[new Date(koreaDay(end)).getUTCDay()];

  return `${startText}(${startDay}) - ${endText}(${endDay})`;
}

export const WEEKLY_WEEKEND_LABEL = "매주 토~일 개최";

export function formatExpoSchedule(
  start: Date,
  end: Date,
  isWeeklyWeekend = false,
) {
  if (isWeeklyWeekend) return WEEKLY_WEEKEND_LABEL;
  return formatKoreanDateRange(start, end);
}

export function formatInputDate(date: Date) {
  return koreaDay(date);
}

export function formatKoreanDate(date: Date) {
  return format(date, "yyyy년 M월 d일", { locale: ko });
}
