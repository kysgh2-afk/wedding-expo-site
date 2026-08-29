import { NextResponse } from "next/server";
import { recordExpoClick } from "@/lib/clicks";
import { getExpoById } from "@/lib/expo-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const expo = await getExpoById(id);

  if (!expo || !expo.isPublished || expo.endDate < new Date()) {
    return NextResponse.json({ error: "박람회를 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    await recordExpoClick(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[expo-click] Click storage failed:", error);
    return NextResponse.json(
      { error: "클릭 집계 저장소가 연결되지 않았습니다." },
      { status: 503 },
    );
  }
}
