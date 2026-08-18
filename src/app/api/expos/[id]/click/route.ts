import { NextResponse } from "next/server";
import { getActiveExpoDateFilter } from "@/lib/expos";
import { prisma } from "@/lib/prisma";
import generatedExpoData from "@/data/expos.generated.json";
import { recordSourceExpoClick } from "@/lib/clicks";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (id.startsWith("source-")) {
    const now = new Date();
    const expoExists = generatedExpoData.expos.some(
      (expo) =>
        expo.id === id && expo.isPublished && new Date(expo.endDate) >= now,
    );

    if (!expoExists) {
      return NextResponse.json({ error: "박람회를 찾을 수 없습니다." }, { status: 404 });
    }

    try {
      await recordSourceExpoClick(id);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("[expo-click] Source click storage failed:", error);
      return NextResponse.json(
        { error: "클릭 집계 저장소가 연결되지 않았습니다." },
        { status: 503 },
      );
    }
  }

  const expo = await prisma.expo.findFirst({
    where: {
      id,
      isPublished: true,
      ...getActiveExpoDateFilter(),
    },
    select: { id: true },
  });

  if (!expo) {
    return NextResponse.json({ error: "박람회를 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.expo.update({
    where: { id },
    data: { clickCount: { increment: 1 } },
  });

  return NextResponse.json({ success: true });
}
