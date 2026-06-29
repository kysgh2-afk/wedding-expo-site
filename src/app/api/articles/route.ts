import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();

  const article = await prisma.article.create({
    data: {
      title: body.title,
      excerpt: body.excerpt ?? "",
      body: body.body,
      imageUrl: body.imageUrl || null,
      sortOrder: Number(body.sortOrder ?? 0),
      isPublished: body.isPublished ?? true,
    },
  });

  return NextResponse.json(article, { status: 201 });
}
