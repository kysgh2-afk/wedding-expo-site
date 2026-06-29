type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadImageFile(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;

  try {
    response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
  } catch {
    return { ok: false, error: "네트워크 오류로 업로드에 실패했습니다." };
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    return {
      ok: false,
      error: `업로드 서버 오류 (${response.status}). 관리자 로그인 상태와 Vercel Blob 설정을 확인해 주세요.`,
    };
  }

  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok) {
    return { ok: false, error: data.error || "이미지 업로드에 실패했습니다." };
  }

  if (!data.url) {
    return { ok: false, error: "업로드 응답에 이미지 URL이 없습니다." };
  }

  return { ok: true, url: data.url };
}
