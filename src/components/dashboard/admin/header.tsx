// components/dashboard/admin/header.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function AdminHeader() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin";
  
  // Obtener iniciales para el avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para determinar el título según la ruta actual
  const getPageTitle = () => {
    if (pathname === "/dashboard/admin") return "Panel de Administración";
    if (pathname === "/dashboard/admin/influencers") return "Gestión de Influencers";
    if (pathname === "/dashboard/admin/brands") return "Gestión de Marcas";
    if (pathname === "/dashboard/admin/settings") return "Configuración";
    return "Panel de Administración";
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <div className="relative">
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </button>
          </div>
          
          {/* Perfil */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 focus:outline-none hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {getInitials(userName)}
              </div>
              <span className="hidden md:inline-block font-medium">{userName}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {/* Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-2" />
                  Mi perfil
                </button>
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </button>
                <hr className="my-1" />
                <button
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}