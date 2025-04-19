// app/dashboard/brand/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/constants";
import BrandDashboard from "@/components/dashboard/brand/brand-dashboard";
import { BrandProfile, Event, Influencer } from "@/types/brand";

export const dynamic = "force-dynamic";

async function getDashboardData(userId: string) {
  try {
    // Obtener el perfil de la marca
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

    if (!brandProfile) {
      return { brand: null, events: [], influencers: [] };
    }

    // Obtener los eventos recientes de la marca
    const events = await db.event.findMany({
      where: {
        createdById: userId,
      },
      include: {
        _count: {
          select: {
            interests: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Solo obtener los 5 eventos más recientes
    });

    // Obtener influencers destacados
    const influencers = await db.influencerProfile.findMany({
      where: {
        approvalStatus: "APPROVED",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            role: true,
          },
        },
      },
      orderBy: {
        audienceSize: "desc",
      },
      take: 6, // Solo obtener los 6 influencers con mayor audiencia
    });

    // Calcular estadísticas
    const statsData = {
      totalEvents: await db.event.count({
        where: {
          createdById: userId,
        },
      }),
      activeEvents: await db.event.count({
        where: {
          createdById: userId,
          status: "PUBLISHED",
        },
      }),
      totalApplications: await db.eventInterest.count({
        where: {
          event: {
            createdById: userId,
          },
        },
      }),
      approvedApplications: await db.eventInterest.count({
        where: {
          event: {
            createdById: userId,
          },
          approved: true,
        },
      }),
    };

    return { 
      brand: brandProfile as unknown as BrandProfile, 
      events: events as unknown as Event[], 
      influencers: influencers as unknown as Influencer[],
      stats: statsData
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { brand: null, events: [], influencers: [], stats: null };
  }
}

export default async function BrandDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/auth/login?callbackUrl=/dashboard/brand");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const { brand, events, influencers, stats } = await getDashboardData(session.user.id);

  if (!brand) {
    // Si no existe un perfil, redirigir a la página de creación de perfil
    return redirect("/dashboard/brand/create-profile");
  }

  return (
    <div className="container mx-auto p-6">
      <BrandDashboard 
        brand={brand} 
        recentEvents={events} 
        topInfluencers={influencers}
        stats={stats}
      />
    </div>
  );
}