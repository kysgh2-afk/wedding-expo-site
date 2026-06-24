import { NextResponse } from "next/server";
import { isAdminAuthenticated, verifyAdminPassword, setAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const password = typeof body.password === "string" ? body.password : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}
