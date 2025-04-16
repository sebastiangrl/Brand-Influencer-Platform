// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/lib/db";
import { UserRole, ApprovalStatus } from "@/lib/constants";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 días - asegurar que coincida con session maxAge
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: {
            influencerProfile: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Credenciales inválidas");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        // Verificar si el usuario es un influencer y su estado de aprobación
        if (user.role === "INFLUENCER" && user.influencerProfile) {
          if (user.influencerProfile.approvalStatus === "PENDING") {
            throw new Error("Tu cuenta está pendiente de aprobación. Te notificaremos cuando sea aprobada.");
          }
          
          if (user.influencerProfile.approvalStatus === "REJECTED") {
            throw new Error(`Tu solicitud fue rechazada. Motivo: ${user.influencerProfile.rejectionReason || "No especificado"}`);
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as UserRole,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.image = token.picture as string | null;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // Cuando se crea un nuevo JWT (sign in)
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.picture = user.image;
      }
      
      // Permitir actualización del token desde useSession
      if (trigger === "update" && session) {
        if (session.user?.name) token.name = session.user.name;
        if (session.user?.image) token.picture = session.user.image;
      }
      
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};