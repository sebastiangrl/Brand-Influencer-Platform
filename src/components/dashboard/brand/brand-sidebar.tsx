// components/dashboard/brand/brand-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Search,
  PlusCircle, 
  MessageSquare, 
  BarChart, 
  User, 
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BrandSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard/brand",
      icon: LayoutDashboard,
    },
    {
      name: "Mis Eventos",
      href: "/dashboard/brand/events",
      icon: Calendar,
    },
    {
      name: "Crear Evento",
      href: "/dashboard/brand/events/create",
      icon: PlusCircle,
    },
    {
      name: "Buscar Influencers",
      href: "/dashboard/brand/influencers",
      icon: Search,
    },
    {
      name: "Mensajes",
      href: "/dashboard/brand/messages",
      icon: MessageSquare,
    },
    {
      name: "Estadísticas",
      href: "/dashboard/brand/stats",
      icon: BarChart,
    },
    {
      name: "Mi Perfil",
      href: "/dashboard/brand/profile",
      icon: User,
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-white shadow">
      <div className="flex items-center justify-center h-16 border-b">
        <h2 className="text-xl font-semibold">Panel de Marca</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100",
                    isActive(item.href) ? "bg-gray-100 font-medium" : ""
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}