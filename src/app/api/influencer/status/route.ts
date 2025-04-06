// app/api/influencer/status/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || userId !== session.user.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Obtener el perfil del influencer
    const influencerProfile = await db.influencerProfile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        approvalStatus: true,
        rejectionReason: true,
      },
    });

    if (!influencerProfile) {
      return NextResponse.json(
        { message: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        status: influencerProfile.approvalStatus,
        rejectionReason: influencerProfile.rejectionReason 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener estado del influencer:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}