import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|avif|bmp|heic|heif)$/i.test(file.name);
}

function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token || null;
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
      return NextResponse.json({ error: "이미지는 10MB 이하만 업로드할 수 있습니다." }, { status: 400 });
    }

    const ext = path.extname(file.name) || ".jpg";
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    const blobToken = getBlobToken();

    if (blobToken) {
      const blob = await put(filename, file, {
        access: "public",
        token: blobToken,
        contentType: file.type || undefined,
      });
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Vercel 배포 환경에서는 Blob Storage 연결이 필요합니다. Vercel 프로젝트 → Storage → Blob 생성 후 BLOB_READ_WRITE_TOKEN 환경 변수를 추가하고 다시 배포해 주세요.",
        },
        { status: 503 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const localName = path.basename(filename);
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, localName), buffer);

    return NextResponse.json({ url: `/uploads/${localName}` });
  } catch (error) {
    console.error("[upload] failed:", error);

    const message =
      error instanceof Error && error.message.includes("Blob")
        ? "이미지 저장소(Blob) 설정을 확인해 주세요. Vercel Storage가 프로젝트에 연결되어 있는지 확인하세요."
        : "이미지 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
