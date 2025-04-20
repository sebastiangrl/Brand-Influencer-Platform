//src/components/dashboard/influencer/tabs/events-tab.tsx
"use client";

import React, { useState } from "react";
import { Calendar, Eye } from "lucide-react";

export default function EventsTab() {
  // Estado para manejar los eventos próximos (simulados)
  const [upcomingEvents] = useState([
    { 
      id: 1, 
      title: "Lanzamiento Producto", 
      brand: "Fashion Brand", 
      date: "15 Mayo", 
      time: "14:00", 
      compensation: "$150",
      status: "confirmed"
    },
    { 
      id: 2, 
      title: "Campaña Primavera", 
      brand: "Beauty Co.", 
      date: "22 Mayo", 
      time: "10:00", 
      compensation: "$200",
      status: "pending"
    }
  ]);

  return (
    <div className="space-y-5">
      {/* Próximos eventos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Próximos eventos</h2>
        </div>
        
        {upcomingEvents.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {upcomingEvents.map(event => (
              <div key={event.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">Con {event.brand}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    event.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-violet-500 mr-1" />
                    <span className="text-xs text-gray-600">{event.date}, {event.time}</span>
                  </div>
                  <div className="text-sm font-semibold text-violet-600">{event.compensation}</div>
                </div>
                
                <button className="mt-3 w-full py-2 px-3 bg-violet-100 text-violet-700 text-xs font-medium rounded-lg hover:bg-violet-200 transition-colors flex items-center justify-center">
                  <Eye className="w-3 h-3 mr-1" />
                  Ver detalles
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyEventsList />
        )}
      </div>
      
      {/* Historial de eventos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Historial de eventos</h2>
        </div>
        
        <div className="p-6 text-center">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-700">No hay eventos pasados</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
            Tu historial de colaboraciones aparecerá aquí
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar cuando no hay eventos
function EmptyEventsList() {
  return (
    <div className="p-6 text-center">
      <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
      <h3 className="text-sm font-medium text-gray-700">No hay eventos próximos</h3>
      <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
        Mantén actualizado tu perfil para recibir propuestas de marcas
      </p>
    </div>
  );
}