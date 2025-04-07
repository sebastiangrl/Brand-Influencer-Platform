// app/dashboard/admin/influencers/page.tsx
import { db } from "@/lib/db";
import { ApprovalStatus } from "@/lib/constants";
import InfluencersDashboard from "@/components/dashboard/admin/influencers/page";
import { InfluencerProfile } from "@/types/influencer";

export const dynamic = "force-dynamic";

async function getApprovedInfluencers() {
  try {
    const influencerProfiles = await db.influencerProfile.findMany({
      where: {
        approvalStatus: ApprovalStatus.APPROVED,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
    });

    return influencerProfiles as unknown as InfluencerProfile[];
  } catch (error) {
    console.error("Error fetching approved influencers:", error);
    return [];
  }
}

export default async function InfluencersPage() {
  const approvedInfluencers = await getApprovedInfluencers();

  return <InfluencersDashboard initialInfluencers={approvedInfluencers} />;
}