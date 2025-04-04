// app/dashboard/influencer/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function InfluencerDashboard() {
  const { data: session } = useSession();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Influencer</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Bienvenido, {session?.user?.name || "Usuario"}
        </h2>
        
        <p className="mb-4">
          Desde aquí podrás ver oportunidades y conectar con marcas.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-100">
            <h3 className="font-medium text-blue-800">Oportunidades disponibles</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded border border-green-100">
            <h3 className="font-medium text-green-800">Colaboraciones</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded border border-purple-100">
            <h3 className="font-medium text-purple-800">Mensajes sin leer</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}