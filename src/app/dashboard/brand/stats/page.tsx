// app/dashboard/brand/stats/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";
import StatsDashboard from "@/components/dashboard/brand/stats/stats-dashboard";

export const dynamic = "force-dynamic";

async function getBrandData(userId: string) {
  try {
    // Obtener el perfil de la marca
    const brandProfile = await db.brandProfile.findUnique({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!brandProfile) {
      return { brandProfile: null, events: [] };
    }

    // Obtener los eventos de la marca
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
    });

    return { brandProfile, events };
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return { brandProfile: null, events: [] };
  }
}

export default async function StatsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/auth/login?callbackUrl=/dashboard/brand/stats");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const { brandProfile, events } = await getBrandData(session.user.id);

  if (!brandProfile) {
    return redirect("/dashboard/brand/profile?setup=true");
  }

  return (
    <div className="container mx-auto p-6">
      <StatsDashboard brand={brandProfile} events={events} />
    </div>
  );
}