import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAllContent } from "@/lib/content-store";
import { ContentDashboard } from "@/components/admin/ContentDashboard";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  const items = await getAllContent();
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl"><ContentDashboard items={items.map((item) => ({ ...item, publishedAt: item.publishedAt.toISOString(), createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() }))} /></div>
    </div>
  );
}
