// components/dashboard/brand/navigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut 
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function BrandNavigation() {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard/brand",
      icon: LayoutDashboard,
    },
    {
      name: "Eventos",
      href: "/dashboard/brand/events",
      icon: CalendarDays,
    },
    {
      name: "Influencers",
      href: "/dashboard/brand/influencers",
      icon: Users,
    },
    {
      name: "Mensajes",
      href: "/dashboard/brand/messages",
      icon: MessageSquare,
    },
    {
      name: "Perfil",
      href: "/dashboard/brand/profile",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Brand Dashboard</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-2 py-2 text-sm font-medium",
              pathname === item.href
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            )}
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5",
                pathname === item.href
                  ? "text-white"
                  : "text-gray-400 group-hover:text-gray-300"
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="flex shrink-0 p-4">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}