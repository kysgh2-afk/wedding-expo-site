import { NextRequest, NextResponse } from "next/server";
import { recordExpoClick } from "@/lib/clicks";
import { getExpoById } from "@/lib/expo-store";
import { isExpoCurrent } from "@/lib/expo-calendar.mjs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== request.nextUrl.origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }
  const { id } = await context.params;
  const expo = await getExpoById(id);

  if (!expo || !expo.isPublished || !isExpoCurrent(expo.endDate)) {
    return NextResponse.json({ error: "박람회를 찾을 수 없습니다." }, { status: 404 });
  }

  try {
    const cookie = request.cookies.get("weddinglast-visitor")?.value;
    const visitorId = cookie && /^[0-9a-f-]{36}$/i.test(cookie) ? cookie : crypto.randomUUID();
    const result = await recordExpoClick(id, visitorId);
    const response = NextResponse.json({ success: true, counted: result.counted }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set("weddinglast-visitor", visitorId, {
      httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax",
      path: "/", maxAge: 365 * 24 * 3600,
    });
    return response;
  } catch (error) {
    console.error("[expo-click] Click storage failed:", error);
    return NextResponse.json(
      { error: "클릭 집계 저장소가 연결되지 않았습니다." },
      { status: 503 },
    );
  }
}
