import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getRegionLabel } from "@/lib/constants";
import { normalizeTagsInput } from "@/lib/tags";
import { getPublishedExpos } from "@/lib/expos";
import { createExpo, type ExpoWriteInput } from "@/lib/expo-store";

function normalizeRegion(body: Record<string, unknown>) {
  const regionGroup =
    typeof body.regionGroup === "string" ? body.regionGroup : "seoul";
  const needsSub = regionGroup === "metropolitan" || regionGroup === "local";
  const regionSub =
    needsSub && typeof body.regionSub === "string" ? body.regionSub : "";
  const regionLabel =
    typeof body.regionLabel === "string"
      ? body.regionLabel
      : getRegionLabel(regionGroup, regionSub);

  return { regionGroup, regionSub, regionLabel };
}

export async function GET() {
  return NextResponse.json(await getPublishedExpos());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const region = normalizeRegion(body);

  if (
    typeof body.title !== "string" ||
    !body.title.trim() ||
    typeof body.location !== "string" ||
    !body.location.trim() ||
    typeof body.startDate !== "string" ||
    typeof body.endDate !== "string"
  ) {
    return NextResponse.json({ error: "필수 입력값을 확인해 주세요." }, { status: 400 });
  }

  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "일정 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const input: ExpoWriteInput = {
    title: body.title.trim(),
    location: body.location.trim(),
    regionGroup: region.regionGroup,
    regionSub: region.regionSub,
    regionLabel: region.regionLabel,
    startDate,
    endDate,
    status: typeof body.status === "string" ? body.status : "open",
    imageUrl: typeof body.imageUrl === "string" && body.imageUrl ? body.imageUrl : null,
    linkUrl: typeof body.linkUrl === "string" && body.linkUrl ? body.linkUrl : null,
    sortOrder: Number(body.sortOrder ?? 0),
    tags: normalizeTagsInput(body.tags),
    isWeeklyWeekend: Boolean(body.isWeeklyWeekend),
    isPublished: body.isPublished !== false,
  };

  const expo = await createExpo(input);

  return NextResponse.json(expo, { status: 201 });
}
