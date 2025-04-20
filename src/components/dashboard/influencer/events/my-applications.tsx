//src/components/dashboard/influencer/events/my-applications.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  Filter,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventInterest {
  id: string;
  eventId: string;
  influencerId: string;
  userId: string;
  message: string | null;
  approved: boolean;
  createdAt: string;
  event: {
    id: string;
    title: string;
    description: string;
    compensation: string | null;
    deadline: string | null;
    startDate: string | null;
    endDate: string | null;
    location: string | null;
    categories: string[];
    images: string[];
    createdBy: {
      id: string;
      name: string | null;
      brandProfile: {
        companyName: string;
        logo: string | null;
      } | null;
    };
  };
}

export default function MyApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState<EventInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/influencer/applications");
        
        if (!response.ok) {
          throw new Error("Error al cargar aplicaciones");
        }
        
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("No se pudieron cargar tus aplicaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filtrar aplicaciones según búsqueda y filtros
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.event.createdBy.brandProfile?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "approved" && app.approved) ||
      (statusFilter === "pending" && !app.approved);
    
    return matchesSearch && matchesStatus;
  });

  // Agrupar por estado
  const pendingApplications = filteredApplications.filter(app => !app.approved);
  const approvedApplications = filteredApplications.filter(app => app.approved);

  // Manejar cancelación de aplicación
  const handleCancelApplication = async (eventId: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta aplicación?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/events/${eventId}/interest`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al cancelar aplicación");
      }

      // Actualizar lista de aplicaciones
      setApplications(applications.filter(app => app.eventId !== eventId));
      toast.success("Aplicación cancelada correctamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo cancelar la aplicación");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-violet-900">
          Mis Aplicaciones
        </h1>
      </div>

      {/* Filtros */}
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por título o marca..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="approved">Aprobados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de aplicaciones */}
      {filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <div className="mb-4 rounded-full bg-violet-100 p-3">
            <CalendarDays className="h-6 w-6 text-violet-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No hay aplicaciones</h3>
          <p className="mb-4 text-sm text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No se encontraron aplicaciones con los filtros aplicados."
              : "Aún no has aplicado a ningún evento."}
          </p>
          <Button onClick={() => router.push("/dashboard/influencer/events")}>
            Explorar eventos
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pendientes ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Aprobados ({approvedApplications.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {pendingApplications.map((app) => (
                <Card key={app.id} className="overflow-hidden">
                  <div className="h-3 bg-yellow-400 w-full"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {app.event.createdBy.brandProfile?.companyName || "Marca"}
                      </Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Pendiente
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{app.event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {app.event.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-violet-500" />
                      <span>Aplicaste: {formatDate(new Date(app.createdAt))}</span>
                    </div>
                    {app.message && (
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4 text-violet-500" />
                        <span>Incluiste mensaje</span>
                      </div>
                    )}
                    {app.event.compensation && (
                      <div className="flex items-center">
                        <span className="font-medium">Compensación: </span>
                        <span className="ml-1">{app.event.compensation}</span>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/influencer/events/${app.eventId}`)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver detalle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600"
                      onClick={() => handleCancelApplication(app.eventId)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {pendingApplications.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                <div className="mb-4 rounded-full bg-violet-100 p-3">
                  <CheckCircle className="h-6 w-6 text-violet-500" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No tienes aplicaciones pendientes</h3>
                <p className="mb-4 text-sm text-gray-500">
                  Todas tus aplicaciones han sido aprobadas o aún no has aplicado a eventos.
                </p>
                <Button onClick={() => router.push("/dashboard/influencer/events")}>
                  Explorar eventos
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="approved">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {approvedApplications.map((app) => (
                <Card key={app.id} className="overflow-hidden">
                  <div className="h-3 bg-green-500 w-full"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {app.event.createdBy.brandProfile?.companyName || "Marca"}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        Aprobado
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{app.event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {app.event.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4 text-violet-500" />
                      <span>
                        {app.event.startDate 
                          ? `Fecha: ${formatDate(new Date(app.event.startDate))}` 
                          : "Fecha no definida"}
                      </span>
                    </div>
                    {app.event.compensation && (
                      <div className="flex items-center">
                        <span className="font-medium">Compensación: </span>
                        <span className="ml-1">{app.event.compensation}</span>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => router.push(`/dashboard/influencer/events/${app.eventId}`)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver detalle
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {approvedApplications.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
                <div className="mb-4 rounded-full bg-violet-100 p-3">
                  <Clock className="h-6 w-6 text-violet-500" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Aún no tienes aplicaciones aprobadas</h3>
                <p className="mb-4 text-sm text-gray-500">
                  Cuando una marca apruebe tu participación, aparecerá aquí.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}