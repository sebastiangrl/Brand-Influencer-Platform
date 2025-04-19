// components/dashboard/brand/events/event-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Event } from "@/types/brand";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Calendar, 
  Filter, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  Users
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { EventStatus } from "@/lib/constants";

interface EventListProps {
  initialEvents: Event[];
}

export default function EventList({ initialEvents }: EventListProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filtrar eventos basado en la búsqueda y filtros
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Función para eliminar un evento
  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Actualizar la lista de eventos
          setEvents(events.filter((event) => event.id !== eventId));
          toast.success("Evento eliminado correctamente");
        } else {
          const error = await response.json();
          console.error("Error al eliminar el evento:", error);
          toast.error("Error al eliminar el evento. Inténtalo de nuevo.");
        }
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
        toast.error("Error al eliminar el evento. Inténtalo de nuevo.");
      }
    }
  };

  // Función para obtener el color de la insignia basado en el estado del evento
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case EventStatus.DRAFT:
        return "bg-gray-200 text-gray-800";
      case EventStatus.PUBLISHED:
        return "bg-green-100 text-green-800";
      case EventStatus.CLOSED:
        return "bg-blue-100 text-blue-800";
      case EventStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para traducir el estado del evento
  const getStatusText = (status: string) => {
    switch (status) {
      case EventStatus.DRAFT:
        return "Borrador";
      case EventStatus.PUBLISHED:
        return "Publicado";
      case EventStatus.CLOSED:
        return "Cerrado";
      case EventStatus.CANCELLED:
        return "Cancelado";
      default:
        return status;
    }
  };

  // Función para formatear fecha
  const formatDate = (date: Date | null) => {
    if (!date) return "No definida";
    return format(new Date(date), "dd MMM yyyy", { locale: es });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Mis Eventos</h1>
            <Button onClick={() => router.push("/dashboard/brand/events/create")}>
              <Plus className="mr-2 h-4 w-4" /> Crear Evento
            </Button>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar eventos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  <SelectItem value={EventStatus.DRAFT}>Borradores</SelectItem>
                  <SelectItem value={EventStatus.PUBLISHED}>Publicados</SelectItem>
                  <SelectItem value={EventStatus.CLOSED}>Cerrados</SelectItem>
                  <SelectItem value={EventStatus.CANCELLED}>Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de eventos */}
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No hay eventos</h3>
              <p className="mb-4 text-sm text-gray-500">
                {searchTerm || statusFilter !== "ALL"
                  ? "No se encontraron eventos con los filtros aplicados."
                  : "Aún no has creado ningún evento. ¡Comienza creando uno ahora!"}
              </p>
              <Button onClick={() => router.push("/dashboard/brand/events/create")}>
                <Plus className="mr-2 h-4 w-4" /> Crear Evento
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    {event.images && event.images.length > 0 ? (
                      <img
                        src={event.images[0]}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Calendar className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusBadgeColor(event.status)}>
                        {getStatusText(event.status)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="5" r="1" />
                              <circle cx="12" cy="19" r="1" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/brand/events/${event.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Ver detalle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/brand/events/${event.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 focus:text-red-500"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Fecha: {formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-gray-500" />
                        <span>
                          {event._count?.interests ?? 0} solicitudes de influencers
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push(`/dashboard/brand/events/${event.id}`)}
                    >
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}