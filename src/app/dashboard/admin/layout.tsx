// app/dashboard/admin/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/lib/constants";
import { Suspense } from "react";
import AdminSidebarWrapper from "@/components/dashboard/admin/sidebar-wrapper";
import AdminHeader from "@/components/dashboard/admin/header";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar que el usuario sea admin
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== UserRole.ADMIN) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebarWrapper />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <Suspense fallback={<div className="py-8 text-center">Cargando...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}