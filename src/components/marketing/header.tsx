// src/components/marketing/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Características", href: "/features" },
  { name: "Precios", href: "/pricing" },
  { name: "Contacto", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            BrandConnect
          </Link>
        </div>
        
        {/* Navegación en pantallas medianas y grandes */}
        <nav className="hidden space-x-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                pathname === item.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              } transition-colors`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        {/* Botones de autenticación */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600">
            Iniciar sesión
          </Link>
          <Link href="/register">
            <Button variant="default">Registrarse</Button>
          </Link>
        </div>
        
        {/* Menú móvil - simplificado para este ejemplo */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}