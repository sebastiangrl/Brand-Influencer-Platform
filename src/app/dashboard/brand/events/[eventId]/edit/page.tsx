// app/dashboard/brand/events/[eventId]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";
import EventForm from "@/components/dashboard/brand/events/event-form";

interface EditEventPageProps {
  params: {
    eventId: string;
  };
}

export const dynamic = "force-dynamic";

async function getEvent(eventId: string, userId: string) {
  try {
    const event = await db.event.findUnique({
      where: {
        id: eventId,
        createdById: userId, // Asegurar que el evento pertenece a esta marca
      },
    });

    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect(`/auth/login?callbackUrl=/dashboard/brand/events/${params.eventId}/edit`);
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const event = await getEvent(params.eventId, session.user.id);

  if (!event) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <EventForm event={event} isEditing={true} />
    </div>
  );
}