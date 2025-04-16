// app/dashboard/influencer/events/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InfluencerDashboard from "@/components/dashboard/influencer/influencer-dashboard";
import { InfluencerProfile } from "@/types/influencer";
import { UserRole } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getInfluencerProfile(userId: string) {
  try {
    const influencerProfile = await db.influencerProfile.findFirst({
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

    return influencerProfile as unknown as InfluencerProfile;
  } catch (error) {
    console.error("Error fetching influencer profile:", error);
    return null;
  }
}

export default async function InfluencerEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login");
  }

  // Verificar si el usuario es un influencer
  if (session.user.role !== UserRole.INFLUENCER) {
    return redirect("/dashboard");
  }

  const influencerProfile = await getInfluencerProfile(session.user.id);

  if (!influencerProfile) {
    // Si no existe un perfil, redirigir a la página de creación de perfil
    return redirect("/dashboard/influencer/create-profile");
  }

  // Pasamos el perfil del influencer al componente principal
  // y configuramos la tab activa como "events"
  return <InfluencerDashboard influencer={influencerProfile} />;
}