import type { SerializedExpo } from "@/components/ExpoList";

export function serializeExpos<
  T extends {
    id: string;
    title: string;
    location: string;
    regionGroup: string;
    regionSub: string;
    regionLabel: string;
    startDate: Date;
    endDate: Date;
    status: string;
    imageUrl: string | null;
    linkUrl: string | null;
    clickCount: number;
  },
>(expos: T[]): SerializedExpo[] {
  return expos.map((expo) => ({
    id: expo.id,
    title: expo.title,
    location: expo.location,
    regionGroup: expo.regionGroup,
    regionLabel: expo.regionLabel,
    startDate: expo.startDate.toISOString(),
    endDate: expo.endDate.toISOString(),
    status: expo.status,
    imageUrl: expo.imageUrl,
    linkUrl: expo.linkUrl,
    clickCount: expo.clickCount,
  }));
}
