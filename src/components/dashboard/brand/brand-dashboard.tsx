// components/dashboard/brand/brand-dashboard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BrandProfile, Event, Influencer } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  Search, 
  Users, 
  MessageSquare, 
  BarChart2, 
  Clock, 
  ArrowRight,
  CheckCircle,
  CalendarDays,
  TrendingUp
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatFollowers, formatDate, getInitials } from "@/lib/utils";
import InstagramIcon from "@/components/icons/instagram-icon";
import TiktokIcon from "@/components/icons/tiktok-icon";
import { useEffect, useState } from "react";
import { EventStatus } from "@/lib/constants";

interface BrandDashboardProps {
  brand: BrandProfile;
  recentEvents?: Event[];
  topInfluencers?: Influencer[];
  stats?: {
    totalEvents: number;
    activeEvents: number;
    totalApplications: number;
    approvedApplications: number;
  } | null;
}

export default function BrandDashboard({ 
  brand, 
  recentEvents = [], 
  topInfluencers = [],
  stats = null
}: BrandDashboardProps) {
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalApplications: 0,
    approvedApplications: 0,
  });

  const [applicationData, setApplicationData] = useState<any[]>([]);

  useEffect(() => {
    // Si tenemos stats del servidor, úsalos
    if (stats) {
      setDashboardStats(stats);
    } else {
      // De lo contrario, usa valores simulados
      setDashboardStats({
        totalEvents: 5,
        activeEvents: 3,
        totalApplications: 25,
        approvedApplications: 10,
      });
    }

    // Generar datos simulados para el gráfico si no hay datos
    if (recentEvents.length === 0) {
      // Datos de ejemplo para el gráfico
      const eventData = [
        { name: "Ene", applicants: 4 },
        { name: "Feb", applicants: 6 },
        { name: "Mar", applicants: 8 },
        { name: "Abr", applicants: 10 },
        { name: "May", applicants: 7 },
        { name: "Jun", applicants: 12 },
      ];
      setApplicationData(eventData);
    } else {
      // Convertir eventos reales a datos para el gráfico
      const processedEvents = recentEvents.map(event => ({
        name: event.title.substring(0, 10) + (event.title.length > 10 ? '...' : ''),
        applicants: event._count?.interests || 0
      }));
      setApplicationData(processedEvents);
    }
  }, [stats, recentEvents]);

  // Función para obtener el color de badge según el estado del evento
  const getStatusBadge = (status: string) => {
    switch (status) {
      case EventStatus.DRAFT:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Borrador</Badge>;
      case EventStatus.PUBLISHED:
        return <Badge variant="outline" className="bg-green-100 text-green-800">Publicado</Badge>;
      case EventStatus.CLOSED:
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Cerrado</Badge>;
      case EventStatus.CANCELLED:
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {brand.companyName}
        </h1>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalEvents}</div>
            <p className="text-xs text-gray-500">Eventos creados hasta la fecha</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Eventos activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeEvents}</div>
            <p className="text-xs text-gray-500">Eventos en búsqueda de influencers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aplicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalApplications}</div>
            <p className="text-xs text-gray-500">Total de aplicaciones recibidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Influencers aprobados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.approvedApplications}</div>
            <p className="text-xs text-gray-500">Influencers trabajando con tu marca</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico y Eventos Recientes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Aplicaciones por evento</CardTitle>
            <CardDescription>Número de aplicaciones recibidas</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applicants" fill="#8884d8" name="Aplicaciones" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Eventos recientes</CardTitle>
              <CardDescription>Tus eventos más recientes</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push("/dashboard/brand/events")}
            >
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.length > 0 ? (
                recentEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{event.title}</h3>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(event.startDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event._count?.interests || 0} aplicaciones
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/dashboard/brand/events/${event.id}`)}
                    >
                      Ver
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                  <p className="mb-4 text-gray-500">Aún no has creado eventos</p>
                  <Button
                    onClick={() => router.push("/dashboard/brand/events/create")}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Crear evento
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => router.push("/dashboard/brand/events/create")}
            >
              <Plus className="mr-2 h-4 w-4" /> Crear nuevo evento
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Influencers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Influencers destacados</CardTitle>
            <CardDescription>Influencers populares que podrían interesarte</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push("/dashboard/brand/influencers")}
          >
            Explorar todos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topInfluencers.length > 0 ? (
              topInfluencers.slice(0, 6).map((influencer) => (
                <div key={influencer.id} className="flex items-start gap-3 rounded-lg border p-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={influencer.user?.image || ""} alt={influencer.nickname || "Influencer"} />
                    <AvatarFallback>
                      {getInitials(influencer.nickname || influencer.user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate font-medium">{influencer.nickname || influencer.user?.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{influencer.niche || "Creador de contenido"}</p>
                    <div className="mt-1 flex gap-2">
                      {influencer.instagramFollowers && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <InstagramIcon className="h-3 w-3 text-purple-600" />
                          {formatFollowers(influencer.instagramFollowers)}
                        </span>
                      )}
                      {influencer.tiktokFollowers && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <TiktokIcon className="h-3 w-3" />
                          {formatFollowers(influencer.tiktokFollowers)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => router.push(`/dashboard/brand/influencers/${influencer.id}`)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
                <p className="mb-4 text-gray-500">No hay influencers disponibles</p>
                <Button
                  onClick={() => router.push("/dashboard/brand/influencers")}
                  size="sm"
                >
                  <Search className="mr-2 h-4 w-4" /> Buscar influencers
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button
            onClick={() => router.push("/dashboard/brand/events/create")}
            className="flex-1"
          >
            <Plus className="mr-2 h-4 w-4" /> Crear evento
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/brand/influencers")}
            className="flex-1"
          >
            <Search className="mr-2 h-4 w-4" /> Buscar influencers
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/brand/stats")}
            className="flex-1"
          >
            <BarChart2 className="mr-2 h-4 w-4" /> Ver estadísticas
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/brand/profile")}
            className="flex-1"
          >
            <Users className="mr-2 h-4 w-4" /> Mi perfil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}