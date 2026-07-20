import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.expo.count();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error("[health] Database check failed:", error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
