// components/dashboard/brand/brand-dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BrandProfile } from "@/types/brand";

interface BrandDashboardProps {
  brand: BrandProfile;
}

export default function BrandDashboard({ brand }: BrandDashboardProps) {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalApplications: 0,
    approvedApplications: 0,
  });

  // Datos de ejemplo para el gráfico
  const eventData = [
    { name: "Ene", applicants: 4 },
    { name: "Feb", applicants: 6 },
    { name: "Mar", applicants: 8 },
    { name: "Abr", applicants: 10 },
    { name: "May", applicants: 7 },
    { name: "Jun", applicants: 12 },
  ];

  useEffect(() => {
    // Aquí obtendrías los datos reales de tu API
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/brand/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    // Comentado para evitar errores hasta que implementes el endpoint
    // fetchStats();

    // Datos de ejemplo por ahora
    setStats({
      totalEvents: 5,
      activeEvents: 3,
      totalApplications: 25,
      approvedApplications: 10,
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Bienvenido, {brand.companyName}
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-gray-500">Eventos creados hasta la fecha</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Eventos activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEvents}</div>
            <p className="text-xs text-gray-500">Eventos en búsqueda de influencers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aplicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-gray-500">Total de aplicaciones recibidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Influencers aprobados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedApplications}</div>
            <p className="text-xs text-gray-500">Influencers trabajando con tu marca</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Aplicaciones por evento</CardTitle>
            <CardDescription>Número de aplicaciones recibidas por mes</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applicants" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Eventos recientes</CardTitle>
            <CardDescription>Tus eventos más recientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex-1">
                    <h3 className="font-medium">Evento de ejemplo {index + 1}</h3>
                    <p className="text-sm text-gray-500">
                      {index * 3 + 5} aplicaciones • Publicado hace {index + 1} días
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/dashboard/brand/events`)}
                    className="rounded-md bg-primary px-3 py-1 text-sm text-white"
                  >
                    Ver
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/dashboard/brand/events/create")}
              className="mt-4 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Crear nuevo evento
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}