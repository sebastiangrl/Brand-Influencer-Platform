// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Intenta realizar una consulta simple
    const usersCount = await db.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Conexión a la base de datos exitosa",
      usersCount,
      connectionInfo: {
        // Información de depuración
        nodeEnv: process.env.NODE_ENV,
        // No incluir credenciales completas en la respuesta
        databaseUrl: process.env.DATABASE_URL?.split('@')[1] || 'No disponible',
        directUrl: process.env.DIRECT_URL?.split('@')[1] || 'No disponible',
      }
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    
    return NextResponse.json({
      success: false,
      message: "Error al conectar con la base de datos",
      error: (error as Error).message,
      // Información adicional de depuración
      stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    }, { status: 500 });
  }
}