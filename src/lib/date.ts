import { format } from "date-fns";
import { ko } from "date-fns/locale";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatKoreanDateRange(start: Date, end: Date) {
  const startText = format(start, "yyyy.MM.dd", { locale: ko });
  const endText = format(end, "yyyy.MM.dd", { locale: ko });
  const startDay = DAY_LABELS[start.getDay()];
  const endDay = DAY_LABELS[end.getDay()];

  return `${startText}(${startDay}) - ${endText}(${endDay})`;
}

export function formatInputDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}
