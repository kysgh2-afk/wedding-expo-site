import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getRegionLabel } from "@/lib/constants";
import { normalizeTagsInput } from "@/lib/tags";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const expo = await prisma.expo.findUnique({ where: { id } });

  if (!expo) {
    return NextResponse.json({ error: "박람회를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(expo);
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const regionGroup = body.regionGroup;
  const needsSub = regionGroup === "metropolitan" || regionGroup === "local";
  const regionSub = needsSub ? body.regionSub : body.regionSub ?? "";

  const expo = await prisma.expo.update({
    where: { id },
    data: {
      title: body.title,
      location: body.location,
      regionGroup: body.regionGroup,
      regionSub,
      regionLabel:
        body.regionLabel ??
        getRegionLabel(body.regionGroup ?? "seoul", regionSub ?? ""),
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      status: body.status,
      imageUrl: body.imageUrl,
      linkUrl: body.linkUrl,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      tags: body.tags !== undefined ? normalizeTagsInput(body.tags) : undefined,
      isPublished: body.isPublished,
    },
  });

  return NextResponse.json(expo);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.expo.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
