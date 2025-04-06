import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ApprovalStatus, UserRole } from "./lib/constants";

export async function middleware(req: NextRequest) {
  // No procesar rutas de API de autenticación ni rutas estáticas
  if (
    req.nextUrl.pathname.startsWith('/api/auth') || 
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('.') ||
    req.nextUrl.pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Intentar obtener el token con opciones más explícitas
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  
  const isAuthenticated = !!token;
  
  const path = req.nextUrl.pathname;
  
  // Lista de rutas públicas
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/error", "/auth/forgot-password"];
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // Lista de rutas de marketing
  const marketingRoutes = ["/", "/about", "/pricing", "/contact", "/features", "/terms", "/privacy"];
  const isMarketingRoute = marketingRoutes.some(route => path === route);

  // Rutas de influencers pendientes o rechazados
  const pendingRoutes = ["/onboarding/influencer/pending-approval", "/onboarding/influencer/rejected"];
  const isPendingRoute = pendingRoutes.some(route => path === route);

  // Si es una ruta pública, de marketing o de pending/rejected, permitir acceso sin restricción
  if (isPublicRoute || isMarketingRoute || isPendingRoute) {
    return NextResponse.next();
  }

  // Verificar autenticación para el resto de rutas
  if (!isAuthenticated) {
    // Guarda la URL original para redireccionar después de inicio de sesión
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url));
  }

  // Rutas específicas para flujos de aprobación de influencers
  if (path.startsWith("/dashboard/influencer")) {
    // Verificar si el usuario es INFLUENCER
    if (token?.role !== UserRole.INFLUENCER) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    // Verificar estado de aprobación para influencers
    try {
      // Hacer una solicitud a la API para verificar el estado de aprobación
      const response = await fetch(`${req.nextUrl.origin}/api/influencer/status?userId=${token.id}`, {
        headers: {
          'Cookie': req.headers.get('cookie') || '',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API response: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === ApprovalStatus.PENDING) {
        return NextResponse.redirect(new URL("/onboarding/influencer/pending-approval", req.url));
      }
      
      if (data.status === ApprovalStatus.REJECTED) {
        return NextResponse.redirect(new URL("/onboarding/influencer/rejected", req.url));
      }
    } catch (error) {
      console.error("Error al verificar estado del influencer:", error);
      // En caso de error, permitimos continuar para no bloquear la navegación
    }
  }

  // Rutas de onboarding específicas
  if (path.startsWith("/onboarding")) {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url));
    }
    
    // Verificar que el usuario acceda al onboarding correspondiente a su rol
    if (path.startsWith("/onboarding/brand") && token?.role !== UserRole.BRAND) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/onboarding/influencer") && token?.role !== UserRole.INFLUENCER) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    return NextResponse.next();
  }

  // Para rutas de dashboard, verificar autenticación y roles
  if (path.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url));
    }
    
    // Redirigir según el rol
    if (path.startsWith("/dashboard/admin") && token?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/dashboard/brand") && token?.role !== UserRole.BRAND) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    if (path.startsWith("/dashboard/influencer") && token?.role !== UserRole.INFLUENCER) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    
    // Si es la ruta /dashboard, redirigir según el rol
    if (path === "/dashboard") {
      if (token?.role === UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      }
      if (token?.role === UserRole.BRAND) {
        return NextResponse.redirect(new URL("/dashboard/brand", req.url));
      }
      if (token?.role === UserRole.INFLUENCER) {
        return NextResponse.redirect(new URL("/dashboard/influencer", req.url));
      }
    }
    
    return NextResponse.next();
  }

  // Para cualquier otra ruta privada, requerir autenticación
  if (!isAuthenticated) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, req.url));
  }

  return NextResponse.next();
}

// Configuración para que el middleware solo se ejecute en las rutas especificadas
export const config = {
  matcher: [
    // Incluye todas las rutas excepto las específicas mencionadas
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook).*)",
  ],
};