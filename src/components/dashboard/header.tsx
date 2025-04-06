// src/components/dashboard/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { UserMenu } from "@/components/shared/user-menu";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userRole = session?.user?.role;
  const isAuthenticated = status === "authenticated" && session?.user;

  const navItems = [
    {
      label: "Dashboard",
      href: `/dashboard/${userRole?.toLowerCase()}`,
      active: pathname === `/dashboard/${userRole?.toLowerCase()}`,
    },
  ];

  // Agregar elementos de navegación según el rol
  if (userRole === "BRAND") {
    navItems.push(
      {
        label: "Campañas",
        href: "/dashboard/brand/campaigns",
        active: pathname.includes("/dashboard/brand/campaigns"),
      },
      {
        label: "Influencers",
        href: "/dashboard/brand/influencers",
        active: pathname.includes("/dashboard/brand/influencers"),
      },
      {
        label: "Mensajes",
        href: "/dashboard/brand/messages",
        active: pathname.includes("/dashboard/brand/messages"),
      },
      {
        label: "Perfil",
        href: "/dashboard/brand/profile",
        active: pathname.includes("/dashboard/brand/profile"),
      }
    );
  } else if (userRole === "INFLUENCER") {
    navItems.push(
      {
        label: "Oportunidades",
        href: "/dashboard/influencer/events",
        active: pathname.includes("/dashboard/influencer/events"),
      },
      {
        label: "Mensajes",
        href: "/dashboard/influencer/messages",
        active: pathname.includes("/dashboard/influencer/messages"),
      },
      {
        label: "Perfil",
        href: "/dashboard/influencer/profile",
        active: pathname.includes("/dashboard/influencer/profile"),
      }
    );
  } else if (userRole === "ADMIN") {
    navItems.push(
      {
        label: "Usuarios",
        href: "/dashboard/admin/users",
        active: pathname.includes("/dashboard/admin/users"),
      },
      {
        label: "Verificaciones",
        href: "/dashboard/admin",
        active: pathname === "/dashboard/admin",
      },
      {
        label: "Reportes",
        href: "/dashboard/admin/reports",
        active: pathname.includes("/dashboard/admin/reports"),
      }
    );
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                BrandConnect
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <nav className="md:ml-6 md:flex md:items-center md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    item.active
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* User Menu */}
            <div className="ml-6 border-l border-gray-200 pl-6">
              {isAuthenticated && <UserMenu user={session.user} />}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <span className="sr-only">Abrir menú</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile user menu */}
          {isAuthenticated && (
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "Usuario"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm font-medium">
                        {(session.user.name?.charAt(0) || (session.user.email ? session.user.email.charAt(0) : "U")).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session.user.name || (session.user.email ? session.user.email.split('@')[0] : 'Usuario')}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link
                  href={`/dashboard/${userRole?.toLowerCase()}/profile`}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mi perfil
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}