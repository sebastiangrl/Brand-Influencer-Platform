// components/dashboard/admin/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Influencers",
      href: "/dashboard/admin/influencers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Marcas",
      href: "/dashboard/admin/brands",
      icon: <Store className="w-5 h-5" />,
    },
    {
      name: "Configuración",
      href: "/dashboard/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white h-screen ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 ease-in-out flex flex-col relative`}
    >
      {/* Logo y nombre */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 overflow-hidden">
        <div className="flex items-center">
          {!isCollapsed ? (
            <span className="text-blue-400 text-2xl font-bold transition-all duration-300 ease-in-out">BrandConnect</span>
          ) : (
            <span className="text-blue-400 text-xl font-bold transition-all duration-300 ease-in-out">BC</span>
          )}
        </div>
      </div>

      {/* Botón para colapsar/expandir */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-2 p-1 bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600 transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Navegación principal */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? "bg-blue-900 text-blue-300"
                    : "text-gray-300 hover:bg-gray-700"
                } group`}
              >
                <span className="mr-3 flex-shrink-0">{item.icon}</span>
                <span className={`whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                }`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sección inferior */}
      <div className="px-2 py-4 mt-auto border-t border-gray-700">
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard/admin/help"
              className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 transition-colors group"
            >
              <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
              }`}>
                Ayuda y soporte
              </span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 transition-colors group"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
              }`}>
                Cerrar sesión
              </span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}