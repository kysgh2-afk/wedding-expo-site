import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArticleDashboard } from "@/components/admin/ArticleDashboard";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const articles = await prisma.article.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <ArticleDashboard
          articles={articles.map((article) => ({
            ...article,
            createdAt: article.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
