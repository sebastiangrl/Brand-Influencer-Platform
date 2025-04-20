// app/api/events/[id]/invite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole, EventStatus } from "@/lib/constants";
import * as z from "zod";

// Esquema para validar el request
const inviteSchema = z.object({
  influencerId: z.string(),
  message: z.string().max(1000).optional(),
});

export async function POST(
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

    // Verificar si el usuario es una marca
    if (session.user.role !== UserRole.BRAND) {
      return NextResponse.json(
        { error: "Solo las marcas pueden invitar influencers" },
        { status: 403 }
      );
    }

    const eventId = params.id;

    // Verificar si el evento existe y pertenece a la marca
    const event = await db.event.findUnique({
      where: {
        id: eventId,
        createdById: session.user.id,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado o no tienes permiso para acceder a él" },
        { status: 404 }
      );
    }

    // Verificar si el evento está en un estado válido para invitaciones
    if (event.status === EventStatus.CLOSED || event.status === EventStatus.CANCELLED) {
      return NextResponse.json(
        { error: "No se pueden enviar invitaciones a eventos cerrados o cancelados" },
        { status: 400 }
      );
    }

    // Validar y procesar el cuerpo de la solicitud
    const body = await req.json();
    const { influencerId, message } = inviteSchema.parse(body);

    // Verificar si el influencer existe y está aprobado
    const influencer = await db.influencerProfile.findUnique({
      where: {
        id: influencerId,
        approvalStatus: "APPROVED", // Solo influencers aprobados
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!influencer) {
      return NextResponse.json(
        { error: "Influencer no encontrado o no está aprobado" },
        { status: 404 }
      );
    }

    // Verificar si ya existe un interés para este evento e influencer
    const existingInterest = await db.eventInterest.findUnique({
      where: {
        eventId_influencerId: {
          eventId: eventId,
          influencerId: influencerId,
        },
      },
    });

    if (existingInterest) {
      return NextResponse.json(
        { error: "Ya se ha invitado o el influencer ya mostró interés en este evento" },
        { status: 400 }
      );
    }

    // Verificar si el evento ha alcanzado el máximo de influencers
    if (event.maxInfluencers) {
      const approvedCount = await db.eventInterest.count({
        where: {
          eventId: eventId,
          approved: true,
        },
      });

      if (approvedCount >= event.maxInfluencers) {
        return NextResponse.json(
          { error: "El evento ha alcanzado el máximo de influencers permitidos" },
          { status: 400 }
        );
      }
    }

    // Crear el interés/invitación (auto-aprobado al ser invitación de la marca)
    const interest = await db.eventInterest.create({
      data: {
        eventId: eventId,
        influencerId: influencerId,
        userId: influencer.user.id,
        message: message || null,
        approved: true, // Automáticamente aprobado por ser invitación directa
      },
    });

    // Opcionalmente: Enviar notificación al influencer (implementación futura)

    return NextResponse.json(interest, { status: 201 });
  } catch (error) {
    console.error("Error al invitar influencer:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Para obtener todas las invitaciones enviadas para un evento
export async function GET(
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

    const eventId = params.id;

    // Verificar si el evento pertenece a la marca
    if (session.user.role === UserRole.BRAND) {
      const event = await db.event.findUnique({
        where: {
          id: eventId,
          createdById: session.user.id,
        },
      });

      if (!event) {
        return NextResponse.json(
          { error: "Evento no encontrado o no tienes permiso para acceder a él" },
          { status: 404 }
        );
      }
    }

    // Obtener las invitaciones/intereses
    const interests = await db.eventInterest.findMany({
      where: {
        eventId: eventId,
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

    return NextResponse.json(interests);
  } catch (error) {
    console.error("Error al obtener invitaciones:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}