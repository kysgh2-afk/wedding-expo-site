import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteContent, getContentById, updateContent } from "@/lib/content-store";

type RouteContext = { params: Promise<{ id: string }> };

function normalizeKeywords(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string").slice(0, 12);
  if (typeof value !== "string") return [];
  return value.split(/[,#]/).map((item) => item.trim()).filter(Boolean).slice(0, 12);
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await getContentById(id);
  if (!existing) return NextResponse.json({ error: "콘텐츠를 찾을 수 없습니다." }, { status: 404 });

  const body = (await request.json()) as Record<string, unknown>;
  const title = typeof body.title === "string" ? body.title.trim() : existing.title;
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : existing.excerpt;
  const contentHtml = typeof body.contentHtml === "string" ? body.contentHtml.trim() : existing.contentHtml;
  const publishedAt = typeof body.publishedAt === "string" ? new Date(body.publishedAt) : existing.publishedAt;
  if (!title || !excerpt || !contentHtml || Number.isNaN(publishedAt.getTime())) {
    return NextResponse.json({ error: "제목, 요약, 본문을 확인해 주세요." }, { status: 400 });
  }

  try {
    const item = await updateContent(id, {
      title,
      slug: typeof body.slug === "string" ? body.slug : existing.slug,
      excerpt,
      contentHtml,
      coverImageUrl: body.coverImageUrl === null ? null : typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() || null : existing.coverImageUrl,
      category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : existing.category,
      author: typeof body.author === "string" && body.author.trim() ? body.author.trim() : existing.author,
      seoTitle: typeof body.seoTitle === "string" && body.seoTitle.trim() ? body.seoTitle.trim() : title,
      seoDescription: typeof body.seoDescription === "string" && body.seoDescription.trim() ? body.seoDescription.trim() : excerpt,
      keywords: body.keywords !== undefined ? normalizeKeywords(body.keywords) : existing.keywords,
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existing.isPublished,
      publishedAt,
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "저장에 실패했습니다." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }
  const { id } = await context.params;
  if (!(await deleteContent(id))) return NextResponse.json({ error: "콘텐츠를 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json({ success: true });
}
