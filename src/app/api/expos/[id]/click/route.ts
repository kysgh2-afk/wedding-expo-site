import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  const expo = await prisma.expo.findUnique({
    where: { id, isPublished: true },
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
