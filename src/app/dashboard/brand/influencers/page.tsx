// app/dashboard/brand/influencers/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole, ApprovalStatus } from "@/lib/constants";
import InfluencerList from "@/components/dashboard/brand/influencers/influencer-list";

export const dynamic = "force-dynamic";

async function getApprovedInfluencers() {
  try {
    const influencers = await db.influencerProfile.findMany({
      where: {
        approvalStatus: ApprovalStatus.APPROVED,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        instagramFollowers: "desc",
      },
    });

    return influencers;
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return [];
  }
}

export default async function BrandInfluencersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const influencers = await getApprovedInfluencers();
  
  return (
    <div className="container mx-auto p-6">
      <InfluencerList initialInfluencers={influencers} />
    </div>
  );
}