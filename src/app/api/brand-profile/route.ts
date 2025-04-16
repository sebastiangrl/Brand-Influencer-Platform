// app/api/brand-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole, SubscriptionPlan } from "@/lib/constants";
import * as z from "zod";

// Schema de validación
const profileSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa es requerido"),
  website: z.string().url("URL inválida").optional().nullable(),
  description: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (session.user.role !== UserRole.BRAND) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    const profile = await db.brandProfile.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            role: true,
          },
        },
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (session.user.role !== UserRole.BRAND) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    // Verificar si ya existe un perfil para este usuario
    const existingProfile = await db.brandProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Ya tienes un perfil de marca" },
        { status: 400 }
      );
    }

    const data = await req.json();
    
    // Validar datos
    const validatedData = profileSchema.parse(data);

    // Crear perfil de marca
    const brandProfile = await db.brandProfile.create({
      data: {
        userId: session.user.id,
        companyName: validatedData.companyName,
        website: validatedData.website,
        logo: validatedData.logo,
        description: validatedData.description,
        industry: validatedData.industry,
        location: validatedData.location,
        contactPhone: validatedData.contactPhone,
        subscription: SubscriptionPlan.FREE,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      },
    });

    return NextResponse.json(brandProfile, { status: 201 });
  } catch (error) {
    console.error("Error al crear perfil:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al crear perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (session.user.role !== UserRole.BRAND) {
      return NextResponse.json({ error: "Acceso no autorizado" }, { status: 403 });
    }

    const data = await req.json();
    
    // Validar datos
    const validatedData = profileSchema.parse(data);

    // Verificar si el perfil existe
    const existingProfile = await db.brandProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 });
    }

    // Actualizar imagen del usuario si se proporciona
    if (validatedData.logo) {
      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: validatedData.logo,
        },
      });
    }

    // Actualizar perfil
    const updatedProfile = await db.brandProfile.update({
      where: {
        userId: session.user.id,
      },
      data: {
        companyName: validatedData.companyName,
        website: validatedData.website,
        logo: validatedData.logo,
        description: validatedData.description,
        industry: validatedData.industry,
        location: validatedData.location,
        contactPhone: validatedData.contactPhone,
      },
    });

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      profile: updatedProfile,
    });
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