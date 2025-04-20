// app/dashboard/influencer/applications/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/constants";
import MyApplications from "@/components/dashboard/influencer/events/my-applications";

export const dynamic = "force-dynamic";

export default async function InfluencerApplicationsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/auth/login?callbackUrl=/dashboard/influencer/applications");
  }

  // Verificar si el usuario es un influencer
  if (session.user.role !== UserRole.INFLUENCER) {
    return redirect("/dashboard");
  }

  // Verificar si tiene un perfil de influencer
  const influencerProfile = await db.influencerProfile.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (!influencerProfile) {
    return redirect("/dashboard/influencer/create-profile");
  }

  // Si el perfil está pendiente o rechazado, redirigir a la página apropiada
  if (influencerProfile.approvalStatus === "PENDING") {
    return redirect("/onboarding/influencer/pending-approval");
  } else if (influencerProfile.approvalStatus === "REJECTED") {
    return redirect("/onboarding/influencer/rejected");
  }

  return (
    <div className="container mx-auto p-6">
      <MyApplications />
    </div>
  );
}