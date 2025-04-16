// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole, EventStatus } from "@/lib/constants";
import * as z from "zod";

const eventSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  requirements: z.string().optional().nullable(),
  compensation: z.string().min(1),
  deadline: z.date().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  location: z.string().optional().nullable(),
  status: z.enum([
    EventStatus.DRAFT,
    EventStatus.PUBLISHED,
    EventStatus.CLOSED,
    EventStatus.CANCELLED,
  ]),
  maxInfluencers: z.number().int().positive().optional().nullable(),
  minFollowers: z.number().int().positive().optional().nullable(),
  categories: z.array(z.string()).min(1),
  images: z.array(z.string()).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const eventId = params.id;

    // Obtener evento
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            brandProfile: {
              select: {
                companyName: true,
                logo: true,
                industry: true,
                location: true,
              },
            },
          },
        },
        interests: {
          include: {
            influencer: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            interests: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Si es un influencer, solo puede ver eventos publicados
    if (
      session.user.role === UserRole.INFLUENCER &&
      event.status !== EventStatus.PUBLISHED &&
      event.createdById !== session.user.id
    ) {
      return NextResponse.json(
        { error: "No tienes permiso para ver este evento" },
        { status: 403 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error al obtener evento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const eventId = params.id;

    // Obtener evento
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el usuario es el propietario del evento
    if (event.createdById !== session.user.id && session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "No tienes permiso para editar este evento" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = eventSchema.parse(body);

    // Actualizar evento
    const updatedEvent = await db.event.update({
      where: {
        id: eventId,
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        requirements: validatedData.requirements,
        compensation: validatedData.compensation,
        deadline: validatedData.deadline,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        location: validatedData.location,
        status: validatedData.status,
        maxInfluencers: validatedData.maxInfluencers,
        minFollowers: validatedData.minFollowers,
        categories: validatedData.categories,
        images: validatedData.images || event.images,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const eventId = params.id;

    // Obtener evento
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si el usuario es el propietario del evento
    if (event.createdById !== session.user.id && session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar este evento" },
        { status: 403 }
      );
    }

    // Eliminar evento
    await db.eventInterest.deleteMany({
      where: {
        eventId,
      },
    });

    await db.event.delete({
      where: {
        id: eventId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}