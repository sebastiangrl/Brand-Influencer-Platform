// app/api/influencer/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Verificar si el usuario es un influencer
    if (session.user.role !== UserRole.INFLUENCER) {
      return NextResponse.json(
        { error: "Solo los influencers pueden acceder a esta información" },
        { status: 403 }
      );
    }

    // Obtener el perfil del influencer
    const influencerProfile = await db.influencerProfile.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!influencerProfile) {
      return NextResponse.json(
        { error: "Perfil de influencer no encontrado" },
        { status: 404 }
      );
    }

    // Obtener todas las aplicaciones/intereses del influencer
    const applications = await db.eventInterest.findMany({
      where: {
        influencerId: influencerProfile.id,
      },
      include: {
        event: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                brandProfile: {
                  select: {
                    companyName: true,
                    logo: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error al obtener aplicaciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}