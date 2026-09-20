/** Compare calendar days in Korea, including legacy midnight end dates. */
export function koreaDay(value) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? new Date(time + 9 * 3600000).toISOString().slice(0, 10) : '';
}
export function isExpoCurrent(endDate, now = new Date()) {
  const end = koreaDay(endDate);
  return Boolean(end) && end >= koreaDay(now);
}
