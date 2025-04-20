//src/components/dashboard/influencer/mobile-nav-bar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { User, Calendar, Bell, BarChart2, ListChecks } from "lucide-react";

interface MobileNavBarProps {
  activeTab: string;
}

export default function MobileNavBar({ activeTab }: MobileNavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around max-w-md mx-auto shadow-lg">
      <Link href="/dashboard/influencer" className="flex flex-col items-center px-3 py-1 rounded-md">
        <User className={`w-5 h-5 ${activeTab === "profile" ? "text-violet-600" : "text-gray-500"}`} />
        <span className={`text-xs mt-1 ${activeTab === "profile" ? "text-violet-600 font-medium" : "text-gray-500"}`}>
          Perfil
        </span>
      </Link>
      
      <Link href="/dashboard/influencer/events" className="flex flex-col items-center px-3 py-1 rounded-md">
        <Calendar className={`w-5 h-5 ${activeTab === "events" ? "text-violet-600" : "text-gray-500"}`} />
        <span className={`text-xs mt-1 ${activeTab === "events" ? "text-violet-600 font-medium" : "text-gray-500"}`}>
          Eventos
        </span>
      </Link>
      
      <Link href="/dashboard/influencer/applications" className="flex flex-col items-center px-3 py-1 rounded-md">
        <ListChecks className={`w-5 h-5 ${activeTab === "applications" ? "text-violet-600" : "text-gray-500"}`} />
        <span className={`text-xs mt-1 ${activeTab === "applications" ? "text-violet-600 font-medium" : "text-gray-500"}`}>
          Solicitudes
        </span>
      </Link>
      
      <Link href="/dashboard/influencer/messages" className="flex flex-col items-center px-3 py-1 rounded-md">
        <Bell className="w-5 h-5 text-gray-500" />
        <span className="text-xs mt-1 text-gray-500">
          Mensajes
        </span>
      </Link>
      
      <Link href="/dashboard/influencer/stats" className="flex flex-col items-center px-3 py-1 rounded-md">
        <BarChart2 className={`w-5 h-5 ${activeTab === "stats" ? "text-violet-600" : "text-gray-500"}`} />
        <span className={`text-xs mt-1 ${activeTab === "stats" ? "text-violet-600 font-medium" : "text-gray-500"}`}>
          Stats
        </span>
      </Link>
    </div>
  );
}