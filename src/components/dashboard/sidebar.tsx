// components/dashboard/sidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  Users,
  CalendarDays,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userRole = pathname.includes("/admin") ? "admin" : pathname.includes("/influencer") ? "influencer" : "brand";

  const navItems = [
    {
      name: "Dashboard",
      href: `/dashboard/${userRole}`,
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
  ];

  // Items específicos según el rol
  if (userRole === "admin") {
    navItems.push(
      {
        name: "Influencers",
        href: "/dashboard/admin/influencers",
        icon: <Users className="w-5 h-5" />,
      },
      {
        name: "Marcas",
        href: "/dashboard/admin/brands",
        icon: <Menu className="w-5 h-5" />,
      }
    );
  } else if (userRole === "influencer") {
    navItems.push(
      {
        name: "Campañas",
        href: "/dashboard/influencer/campaigns",
        icon: <Menu className="w-5 h-5" />,
      },
      {
        name: "Clientes",
        href: "/dashboard/influencer/clients",
        icon: <Users className="w-5 h-5" />,
      }
    );
  } else {
    // Brand
    navItems.push(
      {
        name: "Menú Digital",
        href: "/dashboard/brand/menu",
        icon: <Menu className="w-5 h-5" />,
      },
      {
        name: "Reservas",
        href: "/dashboard/brand/reservations",
        icon: <CalendarDays className="w-5 h-5" />,
      },
      {
        name: "Clientes",
        href: "/dashboard/brand/clients",
        icon: <Users className="w-5 h-5" />,
      }
    );
  }

  // Añadir elementos comunes para todos los roles
  navItems.push(
    {
      name: "Estadísticas",
      href: `/dashboard/${userRole}/statistics`,
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: "Configuración",
      href: `/dashboard/${userRole}/settings`,
      icon: <Settings className="w-5 h-5" />,
    }
  );

  return (
    <div 
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/" className="text-yellow-500 font-bold text-2xl">
            Mezzy
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-100 transition-colors ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-yellow-50 text-yellow-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className={`${isCollapsed ? "mx-auto" : "mr-3"}`}>{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto px-3 py-4 border-t border-gray-200">
        <ul className="space-y-1">
          <li>
            <Link
              href="/help"
              className="flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className={`${isCollapsed ? "mx-auto" : "mr-3"}`}>
                <HelpCircle className="w-5 h-5" />
              </span>
              {!isCollapsed && <span className="font-medium">Ayuda y soporte</span>}
            </Link>
          </li>
          <li>
            <button
              className="w-full flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => {
                // Lógica para cerrar sesión
              }}
            >
              <span className={`${isCollapsed ? "mx-auto" : "mr-3"}`}>
                <LogOut className="w-5 h-5" />
              </span>
              {!isCollapsed && <span className="font-medium">Cerrar sesión</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}