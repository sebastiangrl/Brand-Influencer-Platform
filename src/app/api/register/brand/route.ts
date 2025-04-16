// app/api/register/brand/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import * as z from "zod";

// Schema de validación
const registerBrandSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["BRAND"]),
  companyName: z.string().min(2, "El nombre de la empresa es requerido"),
  industry: z.string().optional().nullable(),
  website: z.string().url("URL inválida").optional().nullable(),
  contactPhone: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    console.log("Iniciando registro de marca");
    const body = await req.json();
    
    console.log("Datos recibidos:", JSON.stringify(body, null, 2));
    
    // Validar datos
    const validatedData = registerBrandSchema.parse(body);
    
    const {
      name,
      email,
      password,
      companyName,
      industry,
      website,
      contactPhone
    } = validatedData;

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      console.log("Email ya registrado:", email);
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hash(password, 10);

    try {
      console.log("Iniciando transacción");
      // Realizar la operación en una transacción para garantizar consistencia
      const result = await db.$transaction(async (prisma) => {
        // Crear un nuevo usuario
        console.log("Creando usuario");
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: "BRAND",
          },
        });

        console.log("Usuario creado:", user.id);

        // Crear perfil de marca con datos adicionales
        console.log("Creando perfil de marca");
        const brandProfile = await prisma.brandProfile.create({
          data: {
            userId: user.id,
            companyName: companyName || name,
            industry: industry || null,
            website: website || null,
            contactPhone: contactPhone || null,
            subscription: "FREE",
            subscriptionStartDate: new Date(),
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          },
        });

        console.log("Perfil de marca creado:", brandProfile.id);

        return { user, brandProfile };
      });

      // Devolver el usuario sin la contraseña
      const { password: _, ...userWithoutPassword } = result.user;
      
      console.log("Registro completado con éxito");
      return NextResponse.json(
        {
          user: userWithoutPassword,
          message: "Usuario registrado correctamente. ¡Bienvenido a la plataforma!"
        },
        { status: 201 }
      );
    } catch (transactionError) {
      console.error("Error en la transacción:", transactionError);
      
      // Manejo específico de errores de la transacción
      return NextResponse.json(
        { message: "Error al crear el usuario. Detalles: " + (transactionError instanceof Error ? transactionError.message : "Error desconocido") },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error al registrar marca:", error);
    
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }));
      
      return NextResponse.json(
        { message: "Datos inválidos", errors: formattedErrors },
        { status: 400 }
      );
    }
    
    // Manejo más específico de errores de Prisma
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } };
      
      if (prismaError.code === 'P2002' && prismaError.meta?.target?.includes('email')) {
        return NextResponse.json(
          { message: "El correo electrónico ya está registrado" },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { message: "Error al registrar marca. Por favor, inténtalo de nuevo." },
      { status: 500 }
    );
  }
}