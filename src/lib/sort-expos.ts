export type ExpoSortMode = "date" | "popular";

export type SortableExpo = {
  startDate: Date;
  endDate: Date;
  clickCount: number;
  isWeeklyWeekend?: boolean;
};

export function sortExpos<T extends SortableExpo>(expos: T[], mode: ExpoSortMode): T[] {
  const list = [...expos];

  if (mode === "popular") {
    return list.sort((a, b) => {
      const weeklyWeekendDiff =
        Number(Boolean(a.isWeeklyWeekend)) - Number(Boolean(b.isWeeklyWeekend));
      if (weeklyWeekendDiff !== 0) return weeklyWeekendDiff;

      if (b.clickCount !== a.clickCount) return b.clickCount - a.clickCount;
      return a.startDate.getTime() - b.startDate.getTime();
    });
  }

  return list.sort((a, b) => {
    const weeklyWeekendDiff =
      Number(Boolean(a.isWeeklyWeekend)) - Number(Boolean(b.isWeeklyWeekend));
    if (weeklyWeekendDiff !== 0) return weeklyWeekendDiff;

    const startDiff = a.startDate.getTime() - b.startDate.getTime();
    if (startDiff !== 0) return startDiff;
    return a.endDate.getTime() - b.endDate.getTime();
  });
}
