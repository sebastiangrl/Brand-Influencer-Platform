// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import * as z from "zod";

const messageSchema = z.object({
  receiverId: z.string().min(1, "El destinatario es requerido"),
  content: z.string().min(1, "El mensaje no puede estar vacío"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = messageSchema.parse(body);

    // Verificar que el destinatario existe
    const receiver = await db.user.findUnique({
      where: {
        id: validatedData.receiverId,
      },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Destinatario no encontrado" },
        { status: 404 }
      );
    }

    // Crear mensaje
    const message = await db.message.create({
      data: {
        senderId: session.user.id,
        receiverId: validatedData.receiverId,
        content: validatedData.content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener parámetros de consulta
    const url = new URL(req.url);
    const withUser = url.searchParams.get("user");
    const unreadOnly = url.searchParams.get("unread") === "true";

    if (withUser) {
      // Obtener conversación con un usuario específico
      const messages = await db.message.findMany({
        where: {
          OR: [
            {
              senderId: session.user.id,
              receiverId: withUser,
            },
            {
              senderId: withUser,
              receiverId: session.user.id,
            },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Marcar mensajes como leídos
      if (messages.length > 0) {
        await db.message.updateMany({
          where: {
            receiverId: session.user.id,
            senderId: withUser,
            read: false,
          },
          data: {
            read: true,
          },
        });
      }

      return NextResponse.json(messages);
    } else {
      // Obtener todas las conversaciones
      const messagesQuery = await db.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id },
          ],
          ...(unreadOnly
            ? {
                read: false,
                receiverId: session.user.id,
              }
            : {}),
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Agrupar mensajes por conversación
      const conversations = [];
      const conversationUsers = new Set();

      for (const message of messagesQuery) {
        const otherUserId =
          message.senderId === session.user.id
            ? message.receiverId
            : message.senderId;

        if (!conversationUsers.has(otherUserId)) {
          conversationUsers.add(otherUserId);

          // Obtener el último mensaje de la conversación
          const lastMessage = messagesQuery.find(
            (m) =>
              (m.senderId === session.user.id && m.receiverId === otherUserId) ||
              (m.receiverId === session.user.id && m.senderId === otherUserId)
          );

          // Obtener el número de mensajes no leídos
          const unreadCount = messagesQuery.filter(
            (m) =>
              m.receiverId === session.user.id &&
              m.senderId === otherUserId &&
              !m.read
          ).length;

          // Obtener la información del otro usuario
          const otherUser =
            lastMessage.senderId === session.user.id
              ? lastMessage.receiver
              : lastMessage.sender;

          conversations.push({
            userId: otherUserId,
            user: otherUser,
            lastMessage,
            unreadCount,
          });
        }
      }

      return NextResponse.json(conversations);
    }
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}