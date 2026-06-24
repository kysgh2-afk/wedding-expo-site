import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { ExpoForm } from "@/components/admin/ExpoForm";

export default async function NewExpoPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <ExpoForm mode="create" />
      </div>
    </div>
  );
}
