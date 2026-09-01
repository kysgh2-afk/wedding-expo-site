import { NextResponse } from "next/server";
import { readGitHubFile } from "@/lib/github-storage";

type RouteContext = { params: Promise<{ path: string[] }> };

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: RouteContext) {
  const { path } = await context.params;
  const pathname = path.join("/");

  if (!pathname.startsWith("uploads/") || pathname.includes("..")) {
    return NextResponse.json({ error: "올바르지 않은 이미지 주소입니다." }, { status: 400 });
  }

  const result = await readGitHubFile(`public/${pathname}`);
  if (!result) {
    return NextResponse.json({ error: "이미지를 찾을 수 없습니다." }, { status: 404 });
  }

  const extension = pathname.split(".").pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif",
    webp: "image/webp", avif: "image/avif", bmp: "image/bmp",
  };
  return new Response(new Uint8Array(result.bytes), {
    headers: {
      "Content-Type": contentTypes[extension ?? ""] ?? "application/octet-stream",
      "Content-Length": String(result.bytes.byteLength),
      ETag: `"${result.sha}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
