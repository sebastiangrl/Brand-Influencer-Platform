// app/dashboard/influencer/page.tsx
"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InfluencerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    eventsAvailable: 0,
    collaborations: 0,
    unreadMessages: 0,
    profileCompletion: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // En un caso real, obtendrías estos datos de tu API
  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setStats({
        eventsAvailable: 12,
        collaborations: 3,
        unreadMessages: 5,
        profileCompletion: 70,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Saludo y estado del perfil */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              ¡Hola, {session?.user?.name || "Influencer"}!
            </h2>
            <p className="mt-1 text-gray-600">
              {stats.profileCompletion < 100 
                ? `Tu perfil está completo al ${stats.profileCompletion}%. Complétalo para aumentar tus oportunidades.` 
                : "¡Excelente! Tu perfil está completo."}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Link 
              href="/dashboard/influencer/profile" 
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {stats.profileCompletion < 100 ? "Completar perfil" : "Ver perfil"}
            </Link>
          </div>
        </div>
        
        {stats.profileCompletion < 100 && (
          <div className="mt-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${stats.profileCompletion}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Estadísticas principales */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Oportunidades disponibles */}
        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Oportunidades disponibles
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {isLoading ? "..." : stats.eventsAvailable}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/influencer/events" className="font-medium text-blue-600 hover:text-blue-500">
                Ver todas
              </Link>
            </div>
          </div>
        </div>
        
        {/* Colaboraciones activas */}
        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Colaboraciones activas
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {isLoading ? "..." : stats.collaborations}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/influencer/collaborations" className="font-medium text-blue-600 hover:text-blue-500">
                Ver detalles
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mensajes no leídos */}
        <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Mensajes no leídos
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {isLoading ? "..." : stats.unreadMessages}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/influencer/messages" className="font-medium text-blue-600 hover:text-blue-500">
                Ver mensajes
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Oportunidades recientes */}
      <div className="mb-8">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Oportunidades recientes
            </h3>
          </div>
          
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Cargando oportunidades...</div>
          ) : stats.eventsAvailable > 0 ? (
            <ul className="divide-y divide-gray-200">
              {[...Array(3)].map((_, i) => (
                <li key={i}>
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Campaña para {['Instagram', 'TikTok', 'YouTube'][i % 3]}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {['Moda', 'Tecnología', 'Viajes'][i % 3]} • Compensación: {['$500', 'Productos', '$300-500'][i % 3]}
                        </p>
                      </div>
                      <Link 
                        href={`/dashboard/influencer/events/${i + 1}`}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No hay oportunidades disponibles en este momento.
            </div>
          )}
          
          {stats.eventsAvailable > 3 && (
            <div className="border-t border-gray-200 px-6 py-4 text-center">
              <Link 
                href="/dashboard/influencer/events" 
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Ver todas las oportunidades
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}