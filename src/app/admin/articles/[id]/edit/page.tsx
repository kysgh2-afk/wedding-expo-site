import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/components/admin/ArticleForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <ArticleForm
          mode="edit"
          initialData={{
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            body: article.body,
            imageUrl: article.imageUrl ?? "",
            sortOrder: article.sortOrder,
            isPublished: article.isPublished,
          }}
        />
      </div>
    </div>
  );
}
