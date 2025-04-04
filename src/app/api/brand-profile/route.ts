// app/api/brand-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { UserRole } from "@/lib/constants";
import { z } from "zod";

// Schema de validación
const profileSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa es requerido"),
  website: z.string().url("URL inválida").optional().nullable(),
  description: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (user.role !== UserRole.BRAND) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    const profile = await db.brandProfile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json(
      { error: "Error al obtener perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (user.role !== UserRole.BRAND) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    const data = await req.json();
    
    // Validar datos
    const validatedData = profileSchema.parse(data);

    // Verificar si el perfil existe
    const existingProfile = await db.brandProfile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Actualizar perfil
    const updatedProfile = await db.brandProfile.update({
      where: {
        userId: user.id,
      },
      data: validatedData,
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar perfil" },
      { status: 500 }
    );
  }
}