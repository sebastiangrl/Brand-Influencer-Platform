// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // No procesar rutas de API de autenticación
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  
  const path = req.nextUrl.pathname;
  
  // Lista de rutas públicas (actualizada con /auth/ prefix)
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // Lista de rutas de marketing (página inicial y otras rutas de marketing)
  const marketingRoutes = ["/", "/about", "/pricing", "/contact", "/terms", "/privacy"];
  const isMarketingRoute = marketingRoutes.some(route => path === route) ||
                           path.startsWith("/_next") ||
                           path.includes(".") ||
                           path.startsWith("/api/");

  // Si es una ruta pública o de marketing, permitir acceso sin restricción
  if (isPublicRoute || isMarketingRoute) {
    return NextResponse.next();
  }

  // Rutas de onboarding específicas
  if (path.startsWith("/onboarding")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    // Verificar que el usuario acceda al onboarding correspondiente a su rol
    if (path.startsWith("/onboarding/brand") && token?.role !== "BRAND") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    if (path.startsWith("/onboarding/influencer") && token?.role !== "INFLUENCER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    return NextResponse.next();
  }

  // Para rutas de dashboard, verificar autenticación
  if (path.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    // Redirigir según el rol
    if (path.startsWith("/dashboard/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/dashboard/brand") && token?.role !== "BRAND") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/dashboard/influencer") && token?.role !== "INFLUENCER") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    // Si es la ruta /dashboard, redirigir según el rol
    if (path === "/dashboard") {
      if (token?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      if (token?.role === "BRAND") {
        return NextResponse.redirect(new URL("/dashboard/brand", req.url));
      }
      if (token?.role === "INFLUENCER") {
        return NextResponse.redirect(new URL("/dashboard/influencer", req.url));
      }
    }
    
    return NextResponse.next();
  }

  // Para cualquier otra ruta privada, requerir autenticación
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Configuración para que el middleware solo se ejecute en las rutas especificadas
export const config = {
  matcher: [
    // Excluye explícitamente todas las rutas de API de autenticación
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.|api/stripe/webhook).*)",
  ],
};