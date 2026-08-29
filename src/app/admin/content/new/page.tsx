import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { ContentForm } from "@/components/admin/ContentForm";

export default async function NewContentPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
  return <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-6"><div className="mx-auto max-w-7xl"><ContentForm mode="create" /></div></div>;
}
