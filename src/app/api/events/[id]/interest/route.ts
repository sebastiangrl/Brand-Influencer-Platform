// app/api/events/[id]/interest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole, EventStatus } from "@/lib/constants";
import * as z from "zod";

// Esquema para validar el request
const interestSchema = z.object({
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

    // Verificar si el usuario es un influencer
    if (session.user.role !== UserRole.INFLUENCER) {
      return NextResponse.json(
        { error: "Solo los influencers pueden expresar interés en eventos" },
        { status: 403 }
      );
    }

    const eventId = params.id;

    // Verificar si el evento existe y está publicado
    const event = await db.event.findUnique({
      where: {
        id: eventId,
        status: EventStatus.PUBLISHED,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado o no está publicado" },
        { status: 404 }
      );
    }

    // Verificar si el influencer tiene un perfil
    const influencerProfile = await db.influencerProfile.findFirst({
      where: {
        userId: session.user.id,
        approvalStatus: "APPROVED", // Solo influencers aprobados
      },
    });

    if (!influencerProfile) {
      return NextResponse.json(
        { error: "No tienes un perfil de influencer aprobado" },
        { status: 403 }
      );
    }

    // Verificar si ya existe un interés para este evento e influencer
    const existingInterest = await db.eventInterest.findUnique({
      where: {
        eventId_influencerId: {
          eventId: eventId,
          influencerId: influencerProfile.id,
        },
      },
    });

    if (existingInterest) {
      return NextResponse.json(
        { error: "Ya has expresado interés en este evento" },
        { status: 400 }
      );
    }

    // Verificar requisitos del evento (seguidores mínimos)
    if (event.minFollowers) {
      const totalFollowers = 
        (influencerProfile.instagramFollowers || 0) + 
        (influencerProfile.tiktokFollowers || 0);
      
      if (totalFollowers < event.minFollowers) {
        return NextResponse.json(
          { error: "No cumples con el requisito mínimo de seguidores para este evento" },
          { status: 400 }
        );
      }
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

    // Validar y procesar el mensaje opcional
    const body = await req.json();
    const { message } = interestSchema.parse(body);

    // Crear el interés
    const interest = await db.eventInterest.create({
      data: {
        eventId: eventId,
        influencerId: influencerProfile.id,
        userId: session.user.id,
        message: message || null,
        approved: false,
      },
    });

    return NextResponse.json(interest, { status: 201 });
  } catch (error) {
    console.error("Error al expresar interés:", error);
    
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

// Para verificar si ya se ha expresado interés
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

    // Verificar si el usuario es un influencer
    if (session.user.role !== UserRole.INFLUENCER) {
      return NextResponse.json(
        { hasInterest: false }
      );
    }

    // Obtener el perfil del influencer
    const influencerProfile = await db.influencerProfile.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!influencerProfile) {
      return NextResponse.json({ hasInterest: false });
    }

    // Buscar si existe interés
    const interest = await db.eventInterest.findUnique({
      where: {
        eventId_influencerId: {
          eventId: eventId,
          influencerId: influencerProfile.id,
        },
      },
    });

    return NextResponse.json({
      hasInterest: !!interest,
      interest: interest || null,
    });
  } catch (error) {
    console.error("Error al verificar interés:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Para eliminar un interés pendiente
export async function DELETE(
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

    // Verificar si el usuario es un influencer
    if (session.user.role !== UserRole.INFLUENCER) {
      return NextResponse.json(
        { error: "Solo los influencers pueden cancelar su interés" },
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

    // Buscar el interés
    const interest = await db.eventInterest.findUnique({
      where: {
        eventId_influencerId: {
          eventId: eventId,
          influencerId: influencerProfile.id,
        },
      },
    });

    if (!interest) {
      return NextResponse.json(
        { error: "No has expresado interés en este evento" },
        { status: 404 }
      );
    }

    // Solo permitir eliminar intereses no aprobados
    if (interest.approved) {
      return NextResponse.json(
        { error: "No puedes cancelar un interés que ya ha sido aprobado" },
        { status: 400 }
      );
    }

    // Eliminar el interés
    await db.eventInterest.delete({
      where: {
        id: interest.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar interés:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}