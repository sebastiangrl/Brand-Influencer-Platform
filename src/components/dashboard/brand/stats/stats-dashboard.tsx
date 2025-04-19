// components/dashboard/brand/stats/stats-dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { BrandProfile, Event } from "@/types/brand";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsOverview from "./stats-overview";
import EventsStats from "./event-stats";
import InfluencersStats from "./influencers-stats";

interface StatsDashboardProps {
  brand: BrandProfile;
  events: Event[];
}

export default function StatsDashboard({ brand, events }: StatsDashboardProps) {
  const [timeRange, setTimeRange] = useState<string>("last30days");
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Estadísticas generales (simuladas)
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalInfluencers: 0,
    totalReach: 0,
    totalImpressions: 0,
    totalEngagement: 0,
  });

  // Datos para gráficos (simulados)
  const [eventData, setEventData] = useState<any[]>([]);
  const [reachData, setReachData] = useState<any[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  // Cargar datos de estadísticas
  useEffect(() => {
    // En un caso real, harías una llamada a la API para obtener las estadísticas
    // según el rango de tiempo seleccionado
    
    // Simulación de datos de estadísticas
    const loadStats = () => {
      // Contar eventos activos
      const activeEventsCount = events.filter(
        (event) => event.status === "PUBLISHED"
      ).length;
      
      // Datos simulados
      setStats({
        totalEvents: events.length,
        activeEvents: activeEventsCount,
        totalInfluencers: 28,
        totalReach: 125000,
        totalImpressions: 320000,
        totalEngagement: 22500,
      });
      
      // Datos para gráfico de eventos por mes
      const monthlyEventData = [
        { name: "Ene", eventos: 2, aplicaciones: 12 },
        { name: "Feb", eventos: 3, aplicaciones: 18 },
        { name: "Mar", eventos: 5, aplicaciones: 29 },
        { name: "Abr", eventos: 4, aplicaciones: 24 },
        { name: "May", eventos: 6, aplicaciones: 35 },
        { name: "Jun", eventos: 5, aplicaciones: 32 },
      ];
      setEventData(monthlyEventData);
      
      // Datos para gráfico de alcance
      const reachPerformanceData = [
        { name: "Sem 1", alcance: 15000, impresiones: 42000, engagement: 3600 },
        { name: "Sem 2", alcance: 22000, impresiones: 56000, engagement: 4800 },
        { name: "Sem 3", alcance: 28000, impresiones: 72000, engagement: 5300 },
        { name: "Sem 4", alcance: 31000, impresiones: 78000, engagement: 5700 },
        { name: "Sem 5", alcance: 29000, impresiones: 72000, engagement: 5100 },
      ];
      setReachData(reachPerformanceData);
      
      // Datos para gráfico de plataformas
      const platformDistributionData = [
        { name: "Instagram", value: 65 },
        { name: "TikTok", value: 25 },
        { name: "YouTube", value: 8 },
        { name: "Facebook", value: 2 },
      ];
      setPlatformData(platformDistributionData);
      
      // Datos para gráfico de categorías
      const categoriesData = [
        { name: "Moda", value: 35 },
        { name: "Belleza", value: 20 },
        { name: "Lifestyle", value: 15 },
        { name: "Fitness", value: 12 },
        { name: "Gastronomía", value: 8 },
        { name: "Viajes", value: 6 },
        { name: "Otros", value: 4 },
      ];
      setCategoryData(categoriesData);
    };
    
    loadStats();
  }, [events, timeRange]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="space-y-6">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <h1 className="text-2xl font-bold text-gray-900">Estadísticas y Análisis</h1>
            
            <div className="mt-4 flex items-center space-x-2 md:mt-0">
              <Select
                value={timeRange}
                onValueChange={setTimeRange}
              >
                <SelectTrigger className="w-[180px]">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Periodo de tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Últimos 7 días</SelectItem>
                  <SelectItem value="last30days">Últimos 30 días</SelectItem>
                  <SelectItem value="last90days">Últimos 90 días</SelectItem>
                  <SelectItem value="lastYear">Último año</SelectItem>
                  <SelectItem value="allTime">Todo el tiempo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visión general</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="influencers">Influencers</TabsTrigger>
            </TabsList>
            
            {/* Componentes separados para cada tab */}
            <TabsContent value="overview" className="space-y-6">
              <StatsOverview 
                stats={stats} 
                eventData={eventData} 
                reachData={reachData} 
                platformData={platformData} 
              />
            </TabsContent>
            
            <TabsContent value="events" className="space-y-6">
              <EventsStats 
                events={events}
                categoryData={categoryData}
              />
            </TabsContent>
            
            <TabsContent value="influencers" className="space-y-6">
              <InfluencersStats 
                platformData={platformData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Función de utilidad para formatear números grandes
export const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};