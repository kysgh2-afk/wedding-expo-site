import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExpoForm } from "@/components/admin/ExpoForm";
import { formatInputDate } from "@/lib/date";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExpoPage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const expo = await prisma.expo.findUnique({ where: { id } });

  if (!expo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <ExpoForm
          mode="edit"
          initialData={{
            id: expo.id,
            title: expo.title,
            location: expo.location,
            regionGroup: expo.regionGroup,
            regionSub: expo.regionSub,
            regionLabel: expo.regionLabel,
            startDate: formatInputDate(expo.startDate),
            endDate: formatInputDate(expo.endDate),
            status: expo.status,
            imageUrl: expo.imageUrl ?? "",
            linkUrl: expo.linkUrl ?? "",
            sortOrder: expo.sortOrder,
            isPublished: expo.isPublished,
          }}
        />
      </div>
    </div>
  );
}
