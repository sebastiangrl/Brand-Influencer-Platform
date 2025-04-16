// app/api/register/influencer/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import * as z from "zod";

// Schema de validación
const registerInfluencerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["INFLUENCER"]),
  instagramUsername: z.string().min(1, "El usuario de Instagram es requerido"),
  instagramFollowers: z.string().optional().nullable(),
  tiktokUsername: z.string().optional().nullable(),
  tiktokFollowers: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  niche: z.string().optional().nullable(),
  bio: z.string().min(10, "La biografía debe tener al menos 10 caracteres").optional().nullable(),
});

export async function POST(req: Request) {
  try {
    console.log("Iniciando registro de influencer");
    const body = await req.json();
    
    console.log("Datos recibidos:", JSON.stringify(body, null, 2));
    
    // Validar datos con Zod
    const validatedData = registerInfluencerSchema.parse(body);
    
    const {
      name,
      email,
      password,
      instagramUsername,
      instagramFollowers,
      tiktokUsername,
      tiktokFollowers,
      whatsapp,
      niche,
      bio
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

    // Calcular valores para la creación
    const instagramFollowersNum = instagramFollowers ? parseInt(instagramFollowers) : 0;
    const tiktokFollowersNum = tiktokFollowers ? parseInt(tiktokFollowers) : 0;
    
    // Calcular audienceSize como la suma de seguidores
    const audienceSize = Math.max(
      instagramFollowersNum + tiktokFollowersNum,
      100 // Mínimo de 100 para cumplir con requisitos de validación
    );

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
            role: "INFLUENCER",
          },
        });

        console.log("Usuario creado:", user.id);

        // Crear perfil de influencer con datos adicionales
        console.log("Creando perfil de influencer");
        const influencerProfile = await prisma.influencerProfile.create({
          data: {
            userId: user.id,
            nickname: name, // Usamos el nombre como nickname por defecto
            bio: bio || null,
            categories: niche ? [niche] : [], // Convertir nicho a un array para el campo categories
            instagramUsername: instagramUsername || null,
            instagramFollowers: instagramFollowersNum || null,
            instagramUrl: instagramUsername ? `https://instagram.com/${instagramUsername}` : null,
            tiktokUsername: tiktokUsername || null,
            tiktokFollowers: tiktokFollowersNum || null,
            tiktokUrl: tiktokUsername ? `https://tiktok.com/@${tiktokUsername}` : null,
            whatsappContact: whatsapp || null,
            niche: niche || null,
            audienceSize: audienceSize || null,
            approvalStatus: "PENDING",
          },
        });

        console.log("Perfil de influencer creado:", influencerProfile.id);

        return { user, influencerProfile };
      });

      // Devolver el usuario sin la contraseña
      const { password: _, ...userWithoutPassword } = result.user;
      
      console.log("Registro completado con éxito");
      return NextResponse.json(
        {
          user: userWithoutPassword,
          message: "Usuario registrado correctamente. Tu cuenta será revisada por nuestro equipo."
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
    console.error("Error al registrar influencer:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Datos inválidos", errors: error.errors },
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
      { message: "Error al registrar influencer. Por favor, inténtalo de nuevo." },
      { status: 500 }
    );
  }
}