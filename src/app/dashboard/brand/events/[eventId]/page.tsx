//src/app/dashboard/brand/events/[eventId]/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@/lib/constants";
import EventDetail from "@/components/dashboard/brand/events/event-detail";
import { Event, EventInterest } from "@/types/brand";

interface EventPageProps {
  params: {
    eventId: string;
  };
}

export const dynamic = "force-dynamic";

async function getEventWithInterests(eventId: string, userId: string) {
  try {
    const event = await db.event.findUnique({
      where: {
        id: eventId,
        createdById: userId, // Asegura que el evento pertenece a esta marca
      },
      include: {
        interests: {
          include: {
            influencer: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true,
                    role: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect(`/auth/login?callbackUrl=/dashboard/brand/events/${params.eventId}`);
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const eventData = await getEventWithInterests(params.eventId, session.user.id);

  if (!eventData) {
    return notFound();
  }

  // Convertir el resultado de Prisma al formato que espera nuestro componente
  const event: Event & { interests: EventInterest[] } = {
    ...eventData,
    interests: eventData.interests as EventInterest[]
  };

  return <EventDetail event={event} />;
}