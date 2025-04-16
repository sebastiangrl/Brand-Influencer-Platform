// app/api/events/interests/[id]/reject/route.ts
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
        { error: "No tienes permiso para rechazar este interés" },
        { status: 403 }
      );
    }

    // Eliminar interés (rechazar)
    await db.eventInterest.delete({
      where: {
        id: interestId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al rechazar interés:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}