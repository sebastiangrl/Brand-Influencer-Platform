// app/dashboard/brand/events/page.tsx
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole, EventStatus } from "@/lib/constants";
import EventList from "@/components/dashboard/brand/events/event-list";

export const dynamic = "force-dynamic";

async function getBrandEvents(userId: string) {
  try {
    const events = await db.event.findMany({
      where: {
        createdById: userId,
      },
      include: {
        _count: {
          select: {
            interests: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching brand events:", error);
    return [];
  }
}

export default async function BrandEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  const events = await getBrandEvents(session.user.id);
  
  return (
    <div className="container mx-auto p-6">
      <EventList initialEvents={events} />
    </div>
  );
}