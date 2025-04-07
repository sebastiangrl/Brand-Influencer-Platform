import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";
import { UserRole, ApprovalStatus } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
        role: UserRole.INFLUENCER,
      },
    });

    // Crear perfil de influencer con datos adicionales
    await db.influencerProfile.create({
      data: {
        userId: user.id,
        nickname: name, // Usamos el nombre como nickname por defecto
        approvalStatus: ApprovalStatus.PENDING,
        bio: bio || null,
        instagramUsername: instagramUsername || null,
        instagramFollowers: instagramFollowers ? parseInt(instagramFollowers) : null,
        tiktokUsername: tiktokUsername || null,
        tiktokFollowers: tiktokFollowers ? parseInt(tiktokFollowers) : null,
        whatsappContact: whatsapp || null,
        niche: niche || null,
        // Podríamos agregar más campos según sea necesario
      },
    });

    // TODO: Enviar correo al administrador para notificarle de la nueva solicitud
    // utilizando la biblioteca Resend que ya tienes en tus dependencias

    // Devolver el usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        user: userWithoutPassword,
        message: "Usuario registrado correctamente. Tu cuenta será revisada por nuestro equipo."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al registrar influencer:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}