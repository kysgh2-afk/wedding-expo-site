import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getRegionLabel } from "@/lib/constants";
import { normalizeTagsInput } from "@/lib/tags";
import {
  deleteExpo,
  getExpoById,
  updateExpo,
  type ExpoWriteInput,
} from "@/lib/expo-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const expo = await getExpoById(id);

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
  const existing = await getExpoById(id);
  if (!existing) {
    return NextResponse.json({ error: "박람회를 찾을 수 없습니다." }, { status: 404 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const regionGroup =
    typeof body.regionGroup === "string" ? body.regionGroup : existing.regionGroup;
  const needsSub = regionGroup === "metropolitan" || regionGroup === "local";
  const regionSub = needsSub
    ? typeof body.regionSub === "string"
      ? body.regionSub
      : existing.regionSub
    : "";

  const startDate =
    typeof body.startDate === "string" ? new Date(body.startDate) : existing.startDate;
  const endDate =
    typeof body.endDate === "string" ? new Date(body.endDate) : existing.endDate;
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "일정 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const input: ExpoWriteInput = {
    title: typeof body.title === "string" ? body.title.trim() : existing.title,
    location:
      typeof body.location === "string" ? body.location.trim() : existing.location,
    regionGroup,
    regionSub,
    regionLabel:
      typeof body.regionLabel === "string"
        ? body.regionLabel
        : getRegionLabel(regionGroup, regionSub),
    startDate,
    endDate,
    status: typeof body.status === "string" ? body.status : existing.status,
    imageUrl:
      body.imageUrl === null
        ? null
        : typeof body.imageUrl === "string"
          ? body.imageUrl || null
          : existing.imageUrl,
    linkUrl:
      body.linkUrl === null
        ? null
        : typeof body.linkUrl === "string"
          ? body.linkUrl || null
          : existing.linkUrl,
    sortOrder:
      body.sortOrder !== undefined ? Number(body.sortOrder) : existing.sortOrder,
    tags: body.tags !== undefined ? normalizeTagsInput(body.tags) : existing.tags,
    isWeeklyWeekend:
      body.isWeeklyWeekend !== undefined
        ? Boolean(body.isWeeklyWeekend)
        : existing.isWeeklyWeekend,
    isPublished:
      body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
  };

  if (!input.title || !input.location) {
    return NextResponse.json({ error: "필수 입력값을 확인해 주세요." }, { status: 400 });
  }

  const expo = await updateExpo(id, input);

  return NextResponse.json(expo);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteExpo(id);
  if (!deleted) {
    return NextResponse.json({ error: "박람회를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
