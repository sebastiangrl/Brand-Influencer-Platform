// app/api/influencer-profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { UserRole, ApprovalStatus } from "@prisma/client";

// Schema de validación
const updateInfluencerProfileSchema = z.object({
  nickname: z.string().min(2, "El nombre de usuario es requerido"),
  bio: z.string().min(10, "La biografía debe tener al menos 10 caracteres"),
  categories: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
  image: z.string().optional().nullable(),
  instagramUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  tiktokUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  youtubeUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  facebookUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  twitterUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  audienceSize: z.number().min(100, "El tamaño de audiencia debe ser al menos 100").optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    if (session.user.role !== UserRole.INFLUENCER) {
      return NextResponse.json(
        { message: "Acceso denegado" },
        { status: 403 }
      );
    }

    const influencerProfile = await db.influencerProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!influencerProfile) {
      return NextResponse.json(
        { message: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(influencerProfile);
  } catch (error) {
    console.error("Error al obtener perfil de influencer:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    if (session.user.role !== UserRole.INFLUENCER) {
      return NextResponse.json(
        { message: "Acceso denegado" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = updateInfluencerProfileSchema.parse(body);

    // Buscar el perfil de influencer existente
    const existingProfile = await db.influencerProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { message: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Si es la primera vez que se actualiza el perfil, cambiar estado a PENDING
    const approvalStatus = existingProfile.approvalStatus === ApprovalStatus.PENDING
      ? ApprovalStatus.PENDING
      : ApprovalStatus.PENDING;

    // Actualizar la imagen del usuario
    if (validatedData.image) {
      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: validatedData.image,
        },
      });
    }

    // Actualizar el perfil
    const updatedProfile = await db.influencerProfile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        nickname: validatedData.nickname,
        bio: validatedData.bio,
        categories: validatedData.categories,
        instagramUrl: validatedData.instagramUrl,
        tiktokUrl: validatedData.tiktokUrl,
        youtubeUrl: validatedData.youtubeUrl,
        facebookUrl: validatedData.facebookUrl,
        twitterUrl: validatedData.twitterUrl,
        audienceSize: validatedData.audienceSize,
        approvalStatus: approvalStatus,
      },
    });

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      profile: updatedProfile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Datos inválidos", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Error al actualizar perfil de influencer:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}