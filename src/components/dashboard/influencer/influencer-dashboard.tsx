// components/dashboard/influencer/influencer-dashboard.tsx
"use client";

import React, { useState } from "react";
import { InfluencerProfile } from "@/types/influencer";
import ProfileTab from "@/components/dashboard/influencer/tabs/profile-tab";
import EventsTab from "@/components/dashboard/influencer/tabs/events-tab";
import StatsTab from "@/components/dashboard/influencer/tabs/stats-tab";
import ProfileHeader from "@/components/dashboard/influencer/profile-header";
import MobileNavBar from "@/components/dashboard/influencer/mobile-nav-bar";

interface InfluencerDashboardProps {
  influencer: InfluencerProfile;
}

export default function InfluencerDashboard({ influencer }: InfluencerDashboardProps) {
  const [activeTab, setActiveTab] = useState("profile");

  // Determinar el tab inicial basado en la URL (opcional, podría implementarse más adelante)
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/events")) {
      setActiveTab("events");
    } else if (path.includes("/stats")) {
      setActiveTab("stats");
    }
  }, []);

  // Estado para manejar las notificaciones (simuladas)
  const [notifications] = useState([
    { id: 1, title: "¡Nueva oportunidad!", message: "Marca de moda busca colaboración", read: false },
    { id: 2, title: "Solicitud aprobada", message: "Tu perfil ha sido verificado", read: true },
  ]);

  // Calcular notificaciones no leídas
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    // Contenedor principal que limita el ancho en desktop pero mantiene apariencia móvil
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white min-h-screen relative pb-16 shadow-lg">
        {/* Cabecera con perfil y estadísticas principales */}
        <ProfileHeader 
          influencer={influencer} 
          unreadNotifications={unreadNotifications}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {/* Contenido principal según la pestaña seleccionada */}
        <div className="px-4 pb-4">
          {activeTab === "profile" && (
            <ProfileTab influencer={influencer} />
          )}
          
          {activeTab === "events" && (
            <EventsTab />
          )}
          
          {activeTab === "stats" && (
            <StatsTab />
          )}
        </div>
        
        {/* Barra de navegación inferior */}
        <MobileNavBar activeTab={activeTab} />
      </div>
    </div>
  );
}