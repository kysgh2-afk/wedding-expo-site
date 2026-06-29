import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: body.title,
      excerpt: body.excerpt,
      body: body.body,
      imageUrl: body.imageUrl,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
      isPublished: body.isPublished,
    },
  });

  return NextResponse.json(article);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.article.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
