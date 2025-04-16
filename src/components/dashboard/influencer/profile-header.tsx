// components/dashboard/influencer/profile-header.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { User, Settings, Bell, Camera, Edit, Instagram, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { InfluencerProfile } from "@/types/influencer";

interface ProfileHeaderProps {
  influencer: InfluencerProfile;
  unreadNotifications: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileHeader({ 
  influencer, 
  unreadNotifications,
  activeTab,
  setActiveTab
}: ProfileHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // Manejar cierre de sesión
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="relative w-full h-[280px] overflow-hidden">
      {/* Imagen de portada con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/70 to-pink-500/70"></div>
      
      {/* Superposición de imagen de perfil */}
      <div className="absolute inset-0 flex items-center justify-center">
        {influencer.coverImage ? (
          <Image 
            src={influencer.coverImage} 
            alt="Imagen de perfil"
            className="w-full h-full object-cover opacity-40"
            width={500}
            height={280}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-600 to-pink-500"></div>
        )}
      </div>
      
      {/* Barra superior con acciones */}
      <div className="relative flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="text-white font-medium text-sm backdrop-blur-sm px-3 py-1 rounded-full bg-white/10">
            Hola, {influencer.user.name?.split(' ')[0] || 'Influencer'}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Menú de configuración */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            {/* Menú desplegable */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-100">
                <Link 
                  href="/dashboard/influencer/settings" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  <Settings className="w-4 h-4 mr-2 text-gray-500" />
                  Configuración
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
          
          <Link href="/dashboard/influencer/notifications">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-white" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
      
      {/* Información principal del perfil */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-0">
        <div className="flex items-end">
          <div className="relative">
            <div className="rounded-full w-20 h-20 bg-white p-1 shadow-lg">
              {influencer.profileImage ? (
                <Image 
                  src={influencer.profileImage} 
                  alt="Foto de perfil" 
                  className="w-full h-full rounded-full object-cover"
                  width={80}
                  height={80}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-violet-400 to-pink-300 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-pink-500 rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          <div className="ml-3 flex-1 text-white">
            <h1 className="text-xl font-bold truncate">
              {influencer.nickname || influencer.user.name || "Sin nombre"}
            </h1>
            <p className="text-sm opacity-80">
              {influencer.niche || "Influencer"}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {influencer.instagramUsername && (
                <a 
                  href={`https://instagram.com/${influencer.instagramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center"
                >
                  <Instagram className="w-3 h-3 mr-1" />
                  <span className="text-xs">@{influencer.instagramUsername}</span>
                </a>
              )}
            </div>
          </div>
          
          <button className="bg-white/20 backdrop-blur-md p-2 rounded-full">
            <Edit className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {/* Tabs de navegación */}
        <div className="flex mt-6 bg-white rounded-t-xl">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-4 text-center text-sm font-medium rounded-tl-xl transition-colors ${
              activeTab === "profile"
                ? "text-violet-700 border-b-2 border-violet-500"
                : "text-gray-600"
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
              activeTab === "events"
                ? "text-violet-700 border-b-2 border-violet-500"
                : "text-gray-600"
            }`}
          >
            Eventos
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-4 text-center text-sm font-medium rounded-tr-xl transition-colors ${
              activeTab === "stats"
                ? "text-violet-700 border-b-2 border-violet-500"
                : "text-gray-600"
            }`}
          >
            Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
}