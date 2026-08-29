import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getContentById } from "@/lib/content-store";
import { ContentForm } from "@/components/admin/ContentForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditContentPage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const { id } = await params;
  const item = await getContentById(id);
  if (!item) notFound();
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl"><ContentForm mode="edit" initialData={{ id: item.id, title: item.title, slug: item.slug, excerpt: item.excerpt, contentHtml: item.contentHtml, coverImageUrl: item.coverImageUrl ?? "", category: item.category, author: item.author, seoTitle: item.seoTitle, seoDescription: item.seoDescription, keywords: item.keywords.join(", "), isPublished: item.isPublished, publishedAt: item.publishedAt.toISOString().slice(0, 10) }} /></div>
    </div>
  );
}
