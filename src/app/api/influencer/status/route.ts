// app/api/influencer/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    
    // Obtener userId de los parámetros de consulta o usar el del usuario actual
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || session.user.id;
    
    // Los administradores pueden verificar el estado de cualquier influencer
    // Los influencers solo pueden verificar su propio estado
    if (session.user.role !== UserRole.ADMIN && userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }
    
    // Verificar si el usuario es un influencer
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    if (!user || user.role !== UserRole.INFLUENCER) {
      return NextResponse.json({ error: "El usuario no es un influencer" }, { status: 400 });
    }
    
    // Obtener el estado de aprobación del influencer
    const influencerProfile = await db.influencerProfile.findUnique({
      where: { userId: userId },
      select: { 
        approvalStatus: true,
        rejectionReason: true,
        approvedAt: true
      },
    });
    
    if (!influencerProfile) {
      return NextResponse.json({ error: "Perfil de influencer no encontrado" }, { status: 404 });
    }
    
    return NextResponse.json({
      status: influencerProfile.approvalStatus,
      rejectionReason: influencerProfile.rejectionReason,
      approvedAt: influencerProfile.approvedAt
    });
    
  } catch (error) {
    console.error("Error al verificar estado del influencer:", error);
    return NextResponse.json(
      { error: "Error al verificar estado del influencer" },
      { status: 500 }
    );
  }
}