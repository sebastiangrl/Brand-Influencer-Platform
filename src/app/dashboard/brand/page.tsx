// app/dashboard/brand/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BrandDashboard from "@/components/dashboard/brand/brand-dashboard";
import { BrandProfile } from "@/types/brand";
import { UserRole } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getBrandProfile(userId: string) {
  try {
    const brandProfile = await db.brandProfile.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            role: true,
          },
        },
      },
    });

    return brandProfile as unknown as BrandProfile;
  } catch (error) {
    console.error("Error fetching brand profile:", error);
    return null;
  }
}

export default async function BrandDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const brandProfile = await getBrandProfile(session.user.id);

  if (!brandProfile) {
    // Si no existe un perfil, redirigir a la página de creación de perfil
    return redirect("/dashboard/brand/create-profile");
  }

  return <BrandDashboard brand={brandProfile} />;
}