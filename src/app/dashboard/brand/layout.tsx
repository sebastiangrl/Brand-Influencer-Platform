//src/app/dashboard/brand/layout.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/constants";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Componentes de UI
import BrandSidebar from "@/components/dashboard/brand/brand-sidebar";
import BrandNav from "@/components/dashboard/brand/brand-nav";
import { Progress } from "@/components/ui/progress";
import { BrandProfile } from "@/types/brand";

export default async function BrandDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Usar getServerSession con authOptions para obtener la sesión
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    console.log("Redirigiendo a login: Sin sesión de usuario");
    redirect("/auth/login?callbackUrl=/dashboard/brand");
  }

  if (session.user.role !== UserRole.BRAND) {
    console.log(`Redirigiendo: Usuario con rol ${session.user.role} intentando acceder a dashboard de marca`);
    // Si no es una marca, redirigir al dashboard correspondiente
    if (session.user.role === UserRole.ADMIN) {
      redirect("/dashboard/admin");
    } else {
      redirect("/dashboard/influencer");
    }
  }

  try {
    // Verificar si la marca tiene un perfil
    const brandProfileData = await db.brandProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            role: true
          }
        }
      }
    });

    // Si no tiene perfil, redirigir a crear uno
    if (!brandProfileData) {
      console.log("Redirigiendo a setup de perfil: La marca no tiene perfil");
      redirect("/dashboard/brand/create-profile");
    }

    // Convertir a tipo BrandProfile
    const brandProfile: BrandProfile = {
      id: brandProfileData.id,
      userId: brandProfileData.userId,
      companyName: brandProfileData.companyName,
      website: brandProfileData.website,
      logo: brandProfileData.logo,
      description: brandProfileData.description,
      industry: brandProfileData.industry,
      location: brandProfileData.location,
      contactPhone: brandProfileData.contactPhone,
      user: {
        id: brandProfileData.user.id,
        name: brandProfileData.user.name,
        email: brandProfileData.user.email,
        image: brandProfileData.user.image,
        createdAt: brandProfileData.user.createdAt,
        role: brandProfileData.user.role
      }
    };

    return (
      <div className="flex h-screen bg-gray-100">
        <BrandSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <BrandNav user={session.user} brand={brandProfile} />
          
          <main className="flex-1 overflow-y-auto p-4">
            <Suspense fallback={<Progress />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error en BrandDashboardLayout:", error);
    // En caso de error, mostrar un mensaje genérico o redirigir a una página de error
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Algo salió mal</h1>
          <p className="mb-4">Ha ocurrido un error al cargar el dashboard.</p>
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Volver al dashboard
          </a>
        </div>
      </div>
    );
  }
}