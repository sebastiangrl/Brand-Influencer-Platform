import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      email, 
      password, 
      companyName,
      industry,
      website,
      contactPhone
    } = body;

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hash(password, 10);

    // Crear un nuevo usuario
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.BRAND,
      },
    });

    // Crear perfil de marca con datos adicionales
    await db.brandProfile.create({
      data: {
        userId: user.id,
        companyName: companyName || name,
        industry: industry || null,
        website: website || null,
        contactPhone: contactPhone || null,
      },
    });

    // Devolver el usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        user: userWithoutPassword,
        message: "Usuario registrado correctamente."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar marca:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}