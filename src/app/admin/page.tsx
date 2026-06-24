import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const expos = await prisma.expo.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <AdminDashboard
          expos={expos.map((expo) => ({
            ...expo,
            startDate: expo.startDate.toISOString(),
            endDate: expo.endDate.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
