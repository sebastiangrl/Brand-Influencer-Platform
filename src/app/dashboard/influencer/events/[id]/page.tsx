// app/dashboard/influencer/events/[id]/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole, EventStatus } from "@/lib/constants";
import EventDetail from "@/components/dashboard/influencer/events/event-detail";

interface EventPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

async function verifyEventAccess(eventId: string) {
  // Verificar si el evento existe y está publicado
  const event = await db.event.findUnique({
    where: {
      id: eventId,
      status: EventStatus.PUBLISHED,
    },
  });

  return !!event;
}

export default async function InfluencerEventPage({ params }: EventPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect(`/auth/login?callbackUrl=/dashboard/influencer/events/${params.id}`);
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

  // Verificar acceso al evento
  const hasAccess = await verifyEventAccess(params.id);
  if (!hasAccess) {
    return redirect("/dashboard/influencer/events");
  }

  return (
    <div className="container mx-auto p-6">
      <EventDetail eventId={params.id} />
    </div>
  );
}