// app/dashboard/brand/influencers/[influencerId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";
import InfluencerDetail from "@/components/dashboard/brand/influencers/influencer-detail";

interface InfluencerDetailPageProps {
  params: {
    influencerId: string;
  };
}

export const dynamic = "force-dynamic";

async function getInfluencer(influencerId: string) {
  try {
    const influencer = await db.influencerProfile.findUnique({
      where: {
        id: influencerId,
        approvalStatus: "APPROVED", // Solo mostrar influencers aprobados
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

    return influencer;
  } catch (error) {
    console.error("Error fetching influencer:", error);
    return null;
  }
}

export default async function InfluencerDetailPage({ params }: InfluencerDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/auth/login?callbackUrl=/dashboard/brand/influencers");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const { influencerId } = params;
  const influencer = await getInfluencer(influencerId);

  if (!influencer) {
    return notFound();
  }

  return <InfluencerDetail influencer={influencer} />;
}