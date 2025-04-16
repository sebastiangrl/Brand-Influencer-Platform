// app/dashboard/brand/events/[eventId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";
import EventDetail from "@/components/dashboard/brand/events/event-detail";

interface EventPageProps {
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

async function getEventInterests(eventId: string) {
  try {
    const interests = await db.eventInterest.findMany({
      where: {
        eventId,
      },
      include: {
        influencer: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return interests;
  } catch (error) {
    console.error("Error fetching event interests:", error);
    return [];
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/auth/login?callbackUrl=/dashboard/brand/events");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const { eventId } = params;
  const event = await getEvent(eventId, session.user.id);

  if (!event) {
    return notFound();
  }

  const interests = await getEventInterests(eventId);

  return (
    <div className="container mx-auto p-6">
      <EventDetail event={event} interests={interests} />
    </div>
  );
}