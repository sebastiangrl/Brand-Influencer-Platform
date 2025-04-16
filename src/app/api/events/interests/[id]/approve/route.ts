// app/api/events/interests/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const interestId = params.id;

    // Obtener interés
    const interest = await db.eventInterest.findUnique({
      where: {
        id: interestId,
      },
      include: {
        event: true,
      },
    });

    if (!interest) {
      return NextResponse.json(
        { error: "Interés no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el usuario es el creador del evento
    if (interest.event.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "No tienes permiso para aprobar este interés" },
        { status: 403 }
      );
    }

    // Verificar si no se excede el límite de influencers
    if (interest.event.maxInfluencers) {
      const approvedCount = await db.eventInterest.count({
        where: {
          eventId: interest.eventId,
          approved: true,
        },
      });

      if (approvedCount >= interest.event.maxInfluencers) {
        return NextResponse.json(
          { error: "Se ha alcanzado el límite máximo de influencers para este evento" },
          { status: 400 }
        );
      }
    }

    // Aprobar interés
    const updatedInterest = await db.eventInterest.update({
      where: {
        id: interestId,
      },
      data: {
        approved: true,
      },
    });

    return NextResponse.json(updatedInterest);
  } catch (error) {
    console.error("Error al aprobar interés:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}