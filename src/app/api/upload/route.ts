import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { hasGitHubWriteCredentials, writeGitHubFile } from "@/lib/github-storage";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|avif|bmp|heic|heif)$/i.test(file.name);
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "로그인이 필요합니다. 관리자 페이지에서 다시 로그인해 주세요." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "파일이 필요합니다." }, { status: 400 });
    }

    if (!isImageFile(file)) {
      return NextResponse.json(
        { error: "이미지 파일만 업로드할 수 있습니다. (jpg, png, webp 등)" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "이미지는 3MB 이하만 업로드할 수 있습니다." }, { status: 400 });
    }

    if (!hasGitHubWriteCredentials()) {
      return NextResponse.json(
        { error: "GitHub 콘텐츠 저장소가 연결되지 않았습니다." },
        { status: 503 },
      );
    }

    const rawExt = path.extname(file.name).toLowerCase();
    const ext = /^\.(jpe?g|png|gif|webp|avif|bmp)$/.test(rawExt) ? rawExt : ".jpg";
    const mediaPath = `uploads/content/${Date.now()}-${crypto.randomUUID()}${ext}`;
    await writeGitHubFile(
      `public/${mediaPath}`,
      Buffer.from(await file.arrayBuffer()),
      `Upload WeddingLast content image: ${path.basename(mediaPath)}`,
    );
    const publicPath = mediaPath.split("/").map(encodeURIComponent).join("/");
    return NextResponse.json({ url: `/api/media/${publicPath}` });
  } catch (error) {
    console.error("[upload] failed:", error);

    const message = error instanceof Error
      ? `이미지 저장에 실패했습니다: ${error.message}`
      : "이미지 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
