// app/api/admin/influencers/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/lib/constants";
import { approveInfluencer } from "@/lib/admin-actions";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar si el usuario está autenticado y es administrador
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Aprobar al influencer
    await approveInfluencer(id);

    return NextResponse.json(
      { message: "Influencer aprobado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al aprobar influencer:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}