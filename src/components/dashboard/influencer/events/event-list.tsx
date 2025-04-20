//src/components/dashboard/influencer/events/event-list.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CalendarDays, 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Clock,
  BadgeCheck,
  Tag,
  Info,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "react-toastify";
import { AVAILABLE_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  compensation: string | null;
  deadline: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  status: string;
  maxInfluencers: number | null;
  minFollowers: number | null;
  categories: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
    brandProfile: {
      companyName: string;
      logo: string | null;
      industry: string | null;
      location: string | null;
    } | null;
  };
  // Para el estado de interés
  hasInterest?: boolean;
  interestApproved?: boolean;
}

export default function InfluencerEventList() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [interestFilter, setInterestFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events?status=PUBLISHED");
        
        if (!response.ok) {
          throw new Error("Error al cargar eventos");
        }
        
        const eventsData = await response.json();
        
        // Para cada evento, verificar si el influencer ha expresado interés
        const eventsWithInterest = await Promise.all(
          eventsData.map(async (event: Event) => {
            try {
              const interestResponse = await fetch(`/api/events/${event.id}/interest`);
              if (interestResponse.ok) {
                const { hasInterest, interest } = await interestResponse.json();
                return { 
                  ...event, 
                  hasInterest, 
                  interestApproved: interest?.approved || false 
                };
              }
              return { ...event, hasInterest: false, interestApproved: false };
            } catch (error) {
              console.error(`Error checking interest for event ${event.id}:`, error);
              return { ...event, hasInterest: false, interestApproved: false };
            }
          })
        );
        
        setEvents(eventsWithInterest);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("No se pudieron cargar los eventos");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filtrar eventos basados en la búsqueda y filtros
  const filteredEvents = events.filter((event) => {
    // Filtro de búsqueda
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.createdBy.brandProfile?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro de categoría
    const matchesCategory = 
      !categoryFilter || event.categories.includes(categoryFilter);
    
    // Filtro de interés
    const matchesInterest = 
      !interestFilter || 
      (interestFilter === "interested" && event.hasInterest) ||
      (interestFilter === "not-interested" && !event.hasInterest) ||
      (interestFilter === "approved" && event.interestApproved);
    
    return matchesSearch && matchesCategory && matchesInterest;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-violet-900">
          Explorar Oportunidades
        </h1>
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
          <Select 
            value={categoryFilter || ""} 
            onValueChange={(value) => setCategoryFilter(value || null)}
          >
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoría" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las categorías</SelectItem>
              {AVAILABLE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select 
            value={interestFilter || ""} 
            onValueChange={(value) => setInterestFilter(value || null)}
          >
            <SelectTrigger>
              <div className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los eventos</SelectItem>
              <SelectItem value="interested">Me interesa</SelectItem>
              <SelectItem value="not-interested">No aplicado</SelectItem>
              <SelectItem value="approved">Aprobado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de eventos */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-violet-600"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <div className="mb-4 rounded-full bg-violet-100 p-3">
            <CalendarDays className="h-6 w-6 text-violet-500" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No hay eventos disponibles</h3>
          <p className="mb-4 text-sm text-gray-500">
            {searchTerm || categoryFilter || interestFilter
              ? "No se encontraron eventos con los filtros aplicados."
              : "Actualmente no hay eventos disponibles para ti."}
          </p>
          <Button onClick={() => {
            setSearchTerm("");
            setCategoryFilter(null);
            setInterestFilter(null);
          }}>
            Limpiar filtros
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
                    <CalendarDays className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">
                    {event.createdBy.brandProfile?.companyName || "Marca"}
                  </Badge>
                  {event.hasInterest && (
                    <Badge className={event.interestApproved 
                      ? "bg-green-100 text-green-800" 
                      : "bg-violet-100 text-violet-800"
                    }>
                      {event.interestApproved ? "Aprobado" : "Aplicado"}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-1 text-lg">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">{event.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-violet-500" />
                    <span className="font-medium">Compensación: </span>
                    <span className="ml-1">{event.compensation}</span>
                  </div>
                  {event.deadline && (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-violet-500" />
                      <span className="font-medium">Fecha límite: </span>
                      <span className="ml-1">{formatDate(new Date(event.deadline))}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-violet-500" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.minFollowers && (
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-violet-500" />
                      <span>Min. seguidores: {event.minFollowers.toLocaleString()}</span>
                    </div>
                  )}
                  {event.categories && event.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {event.categories.slice(0, 3).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {AVAILABLE_CATEGORIES.find(c => c.id === category)?.label || category}
                        </Badge>
                      ))}
                      {event.categories.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.categories.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter>
                {event.hasInterest ? (
                  <Button 
                    variant={event.interestApproved ? "outline" : "default"}
                    className="w-full"
                    onClick={() => router.push(`/dashboard/influencer/events/${event.id}`)}
                  >
                    {event.interestApproved ? (
                      <>
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        Ver detalles
                      </>
                    ) : (
                      <>
                        <Info className="mr-2 h-4 w-4" />
                        Ver aplicación
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/influencer/events/${event.id}`)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver detalles
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}