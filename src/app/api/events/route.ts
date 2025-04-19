// app/api/events/route.ts
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
  // Modificar los campos de fecha para aceptar strings
  deadline: z.string().datetime().transform(str => new Date(str)).optional().nullable(),
  startDate: z.string().datetime().transform(str => new Date(str)).optional().nullable(),
  endDate: z.string().datetime().transform(str => new Date(str)).optional().nullable(),
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
  images: z.array(z.string()).optional().default([]),
});

export async function POST(req: NextRequest) {
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
        { error: "Solo las marcas pueden crear eventos" },
        { status: 403 }
      );
    }

    // Verificar si la marca tiene un perfil
    const brandProfile = await db.brandProfile.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!brandProfile) {
      return NextResponse.json(
        { error: "Debes crear un perfil de marca primero" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = eventSchema.parse(body);

    // Crear evento
    const event = await db.event.create({
      data: {
        createdById: session.user.id,
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
        images: validatedData.images,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error al crear evento:", error);
    
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

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener parámetros de consulta
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const searchTerm = url.searchParams.get("search");

    // Construir condiciones de filtrado
    const filters: any = {};

    if (session.user.role === UserRole.BRAND) {
      // Si es una marca, mostrar solo sus eventos
      filters.createdById = session.user.id;
    } else if (session.user.role === UserRole.INFLUENCER) {
      // Si es un influencer, mostrar solo eventos publicados
      filters.status = EventStatus.PUBLISHED;
    }

    if (status) {
      filters.status = status;
    }

    if (category) {
      filters.categories = {
        has: category,
      };
    }

    if (searchTerm) {
      filters.OR = [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    // Obtener eventos
    const events = await db.event.findMany({
      where: filters,
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

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}