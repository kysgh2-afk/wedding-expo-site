import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getRegionLabel } from "@/lib/constants";
import { normalizeTagsInput } from "@/lib/tags";
import { getActiveExpoDateFilter } from "@/lib/expos";
import { prisma } from "@/lib/prisma";

function normalizeRegion(body: {
  regionGroup?: string;
  regionSub?: string;
  regionLabel?: string;
}) {
  const regionGroup = body.regionGroup ?? "seoul";
  const needsSub = regionGroup === "metropolitan" || regionGroup === "local";
  const regionSub = needsSub ? (body.regionSub ?? "") : "";
  const regionLabel =
    body.regionLabel ?? getRegionLabel(regionGroup, regionSub);

  return { regionGroup, regionSub, regionLabel };
}

export async function GET() {
  const expos = await prisma.expo.findMany({
    where: {
      isPublished: true,
      ...getActiveExpoDateFilter(),
    },
    orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
  });

  return NextResponse.json(expos);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const region = normalizeRegion(body);

  const expo = await prisma.expo.create({
    data: {
      title: body.title,
      location: body.location,
      regionGroup: region.regionGroup,
      regionSub: region.regionSub,
      regionLabel: region.regionLabel,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: body.status ?? "open",
      imageUrl: body.imageUrl || null,
      linkUrl: body.linkUrl || null,
      sortOrder: Number(body.sortOrder ?? 0),
      tags: normalizeTagsInput(body.tags),
      isWeeklyWeekend: Boolean(body.isWeeklyWeekend),
      isPublished: body.isPublished ?? true,
    },
  });

  return NextResponse.json(expo, { status: 201 });
}
