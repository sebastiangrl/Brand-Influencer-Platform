// app/api/influencer/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";

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

    // Verificar permisos según el rol
    if (session.user.role !== UserRole.ADMIN && 
        session.user.role !== UserRole.BRAND) {
      return NextResponse.json(
        { error: "No tienes permiso para acceder a esta información" },
        { status: 403 }
      );
    }

    const influencerId = params.id;

    // Obtener datos del influencer
    const influencer = await db.influencerProfile.findUnique({
      where: {
        id: influencerId,
        approvalStatus: "APPROVED", // Solo influencers aprobados
      },
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
    });

    if (!influencer) {
      return NextResponse.json(
        { error: "Influencer no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(influencer);
  } catch (error) {
    console.error("Error al obtener influencer:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}