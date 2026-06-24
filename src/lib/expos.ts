import { prisma } from "@/lib/prisma";

type ExpoFilter = {
  regionGroup: string;
  regionSub?: string;
};

export async function getPublishedExpos(filter?: ExpoFilter) {
  return prisma.expo.findMany({
    where: {
      isPublished: true,
      ...(filter?.regionGroup ? { regionGroup: filter.regionGroup } : {}),
      ...(filter?.regionSub ? { regionSub: filter.regionSub } : {}),
    },
    orderBy: [{ startDate: "asc" }, { endDate: "asc" }],
  });
}
