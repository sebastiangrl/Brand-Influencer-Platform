// app/api/brand/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole, EventStatus } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar si el usuario es una marca
    if (session.user.role !== UserRole.BRAND) {
      return NextResponse.json(
        { error: "Solo las marcas pueden ver sus estadísticas" },
        { status: 403 }
      );
    }

    // Obtener todos los eventos de la marca
    const allEvents = await db.event.findMany({
      where: {
        createdById: session.user.id,
      },
      include: {
        _count: {
          select: {
            interests: true,
          },
        },
      },
    });

    // Obtener eventos activos (publicados)
    const activeEvents = allEvents.filter(
      (event) => event.status === EventStatus.PUBLISHED
    );

    // Obtener total de aplicaciones recibidas
    const totalApplications = allEvents.reduce(
      (total, event) => total + (event._count?.interests || 0),
      0
    );

    // Obtener aplicaciones aprobadas
    const approvedApplications = await db.eventInterest.count({
      where: {
        event: {
          createdById: session.user.id,
        },
        approved: true,
      },
    });

    // Obtener estadísticas por mes para los últimos 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await db.eventInterest.groupBy({
      by: [
        {
          createdAt: {
            month: true,
            year: true,
          },
        },
      ],
      where: {
        event: {
          createdById: session.user.id,
        },
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: [
        {
          createdAt: {
            year: "asc",
          },
        },
        {
          createdAt: {
            month: "asc",
          },
        },
      ],
    });

    // Formatear los datos mensuales para presentación
    const monthNames = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const formattedMonthlyStats = monthlyStats.map((stat) => {
      const month = stat.createdAt.month;
      const year = stat.createdAt.year;
      return {
        name: `${monthNames[month - 1]} ${year}`,
        applicants: stat._count.id,
      };
    });

    // Obtener los influencers más frecuentes
    const topInfluencers = await db.eventInterest.groupBy({
      by: ["influencerId"],
      where: {
        event: {
          createdById: session.user.id,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    // Obtener detalles de los influencers principales
    const topInfluencersDetails = await Promise.all(
      topInfluencers.map(async (influencer) => {
        const profile = await db.influencerProfile.findUnique({
          where: {
            id: influencer.influencerId,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return {
          id: influencer.influencerId,
          userId: profile?.userId,
          name: profile?.nickname || profile?.user.name || "Desconocido",
          applications: influencer._count.id,
        };
      })
    );

    // Construir y retornar el objeto de estadísticas
    const stats = {
      totalEvents: allEvents.length,
      activeEvents: activeEvents.length,
      totalApplications,
      approvedApplications,
      monthlyApplications: formattedMonthlyStats,
      topInfluencers: topInfluencersDetails,
      eventsByStatus: {
        draft: allEvents.filter(e => e.status === EventStatus.DRAFT).length,
        published: allEvents.filter(e => e.status === EventStatus.PUBLISHED).length,
        closed: allEvents.filter(e => e.status === EventStatus.CLOSED).length,
        cancelled: allEvents.filter(e => e.status === EventStatus.CANCELLED).length,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}