// lib/db.ts
import { PrismaClient } from '@prisma/client';

// Declaración para TypeScript
declare global {
  var prismaClient: PrismaClient | undefined;
}

// Función para crear un cliente con opciones específicas
function createPrismaClient() {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        // Usar DIRECT_URL en vez de DATABASE_URL
        // Esto evita el pooling que puede causar problemas
        url: process.env.DIRECT_URL || process.env.DATABASE_URL
      }
    }
  });
}

// Implementación de singleton
export const db = global.prismaClient || createPrismaClient();

// Solo guarda en desarrollo para evitar memory leaks
if (process.env.NODE_ENV === 'development') {
  global.prismaClient = db;
}

// Manejo explícito de desconexión
process.on('beforeExit', async () => {
  await db.$disconnect();
});