// app/dashboard/brand/influencers/invite/[id]/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/lib/constants";
import InviteForm from "@/components/dashboard/brand/influencers/invite-form";

interface InviteInfluencerPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

async function verifyInfluencerAccess(influencerId: string): Promise<boolean> {
  // Verificar si el influencer existe y está aprobado
  const influencer = await db.influencerProfile.findUnique({
    where: {
      id: influencerId,
      approvalStatus: "APPROVED", // Solo influencers aprobados
    },
  });

  return !!influencer;
}

export default async function InviteInfluencerPage({ params }: InviteInfluencerPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect(`/auth/login?callbackUrl=/dashboard/brand/influencers/invite/${params.id}`);
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  // Verificar acceso al influencer
  const hasAccess = await verifyInfluencerAccess(params.id);
  if (!hasAccess) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <InviteForm influencerId={params.id} />
    </div>
  );
}