// app/dashboard/brand/influencers/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";
import InfluencerList from "@/components/dashboard/brand/influencers/influencer-list";

export const dynamic = "force-dynamic";

async function getInfluencers() {
  try {
    const influencers = await db.influencerProfile.findMany({
      where: {
        approvalStatus: "APPROVED", // Solo influencers aprobados
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
      orderBy: {
        audienceSize: "desc", // Ordenar por tamaño de audiencia
      },
      take: 50, // Limitar a 50 influencers por carga
    });

    return influencers;
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return [];
  }
}

export default async function InfluencersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/auth/login?callbackUrl=/dashboard/brand/influencers");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const influencers = await getInfluencers();

  return (
    <div className="container mx-auto p-6">
      <InfluencerList initialInfluencers={influencers} />
    </div>
  );
}