import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  createContent,
  getPublishedContent,
  slugifyContent,
  type ContentWriteInput,
} from "@/lib/content-store";

function normalizeKeywords(value: unknown) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string").slice(0, 12);
  if (typeof value !== "string") return [];
  return value.split(/[,#]/).map((item) => item.trim()).filter(Boolean).slice(0, 12);
}

function parseInput(body: Record<string, unknown>): ContentWriteInput | null {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const contentHtml = typeof body.contentHtml === "string" ? body.contentHtml.trim() : "";
  if (!title || !excerpt || !contentHtml) return null;

  const publishedAt = typeof body.publishedAt === "string" ? new Date(body.publishedAt) : new Date();
  if (Number.isNaN(publishedAt.getTime())) return null;

  return {
    title,
    slug: slugifyContent(typeof body.slug === "string" ? body.slug : title),
    excerpt,
    contentHtml,
    coverImageUrl: typeof body.coverImageUrl === "string" && body.coverImageUrl.trim() ? body.coverImageUrl.trim() : null,
    category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : "웨딩 가이드",
    author: typeof body.author === "string" && body.author.trim() ? body.author.trim() : "웨딩라스트 편집팀",
    seoTitle: typeof body.seoTitle === "string" && body.seoTitle.trim() ? body.seoTitle.trim() : title,
    seoDescription: typeof body.seoDescription === "string" && body.seoDescription.trim() ? body.seoDescription.trim() : excerpt,
    keywords: normalizeKeywords(body.keywords),
    isPublished: body.isPublished !== false,
    publishedAt,
  };
}

export async function GET() {
  return NextResponse.json(await getPublishedContent());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const input = parseInput((await request.json()) as Record<string, unknown>);
  if (!input) return NextResponse.json({ error: "제목, 요약, 본문을 확인해 주세요." }, { status: 400 });

  try {
    return NextResponse.json(await createContent(input), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "저장에 실패했습니다." }, { status: 400 });
  }
}
