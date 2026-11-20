import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { verifyClickStorage } from "@/lib/clicks";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  try {
    const checks = await verifyClickStorage();
    return NextResponse.json({ ok: true, checks }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[click-storage-check] Verification failed:", error);
    return NextResponse.json({ ok: false, error: "클릭 저장소 검증에 실패했습니다." }, { status: 503 });
  }
}
