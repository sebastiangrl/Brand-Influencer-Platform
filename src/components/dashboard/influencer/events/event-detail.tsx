//src/components/dashboard/influencer/events/event-detail.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CalendarDays, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft,
  Tag,
  Share2,
  BadgeCheck,
  Ban,
  Building,
  Heart,
  MessageSquare,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Textarea
} from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  _count?: {
    interests: number;
  };
}

interface EventInterestState {
  hasInterest: boolean;
  interest: {
    id: string;
    message: string | null;
    approved: boolean;
    createdAt: string;
  } | null;
}

interface EventDetailProps {
  eventId: string;
}

export default function EventDetail({ eventId }: EventDetailProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [interestState, setInterestState] = useState<EventInterestState>({
    hasInterest: false,
    interest: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interestMessage, setInterestMessage] = useState("");
  const [interestDialogOpen, setInterestDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Cargar datos del evento
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del evento
        const eventResponse = await fetch(`/api/events/${eventId}`);
        if (!eventResponse.ok) {
          throw new Error("Error al cargar el evento");
        }
        const eventData = await eventResponse.json();
        setEvent(eventData);
        
        // Verificar si el influencer ha expresado interés
        const interestResponse = await fetch(`/api/events/${eventId}/interest`);
        if (interestResponse.ok) {
          const interestData = await interestResponse.json();
          setInterestState(interestData);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("No se pudo cargar el evento");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  // Expresar interés en el evento
  const handleExpressInterest = async () => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/events/${eventId}/interest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: interestMessage.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al expresar interés");
      }

      const data = await response.json();
      
      setInterestState({
        hasInterest: true,
        interest: data,
      });
      
      toast.success("Has expresado interés en este evento");
      setInterestDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Error al expresar interés");
    } finally {
      setSubmitting(false);
    }
  };

  // Cancelar interés en el evento
  const handleCancelInterest = async () => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/events/${eventId}/interest`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al cancelar interés");
      }
      
      setInterestState({
        hasInterest: false,
        interest: null,
      });
      
      toast.success("Has cancelado tu interés en este evento");
      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Error al cancelar interés");
    } finally {
      setSubmitting(false);
    }
  };

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no se encontró el evento
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <Ban className="h-6 w-6 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Evento no encontrado</h2>
        <p className="text-gray-600 mb-4">
          El evento que buscas no existe o no está disponible.
        </p>
        <Button onClick={() => router.push("/dashboard/influencer/events")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a eventos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => router.push("/dashboard/influencer/events")}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      {/* Encabezado del evento */}
      <Card className="border-none shadow-md">
        <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-gradient-to-r from-violet-600 to-pink-500">
          {event.images && event.images.length > 0 ? (
            <img
              src={event.images[0]}
              alt={event.title}
              className="h-full w-full object-cover opacity-70"
            />
          ) : null}
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 to-transparent">
            <Badge className="mb-2 inline-flex w-auto bg-white/20 backdrop-blur-sm text-white">
              {event.createdBy.brandProfile?.companyName || "Marca"}
            </Badge>
            <h1 className="text-2xl font-bold text-white">{event.title}</h1>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center">
              <Clock className="mr-3 h-5 w-5 text-violet-500" />
              <div>
                <p className="text-sm text-gray-500">Fecha límite</p>
                <p className="font-medium">
                  {event.deadline ? formatDate(new Date(event.deadline)) : "No definida"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Tag className="mr-3 h-5 w-5 text-violet-500" />
              <div>
                <p className="text-sm text-gray-500">Compensación</p>
                <p className="font-medium">{event.compensation || "No especificada"}</p>
              </div>
            </div>
            
            {event.location && (
              <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-violet-500" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Estado de la aplicación */}
          {interestState.hasInterest && (
            <div className={`mt-6 rounded-lg p-4 ${
              interestState.interest?.approved
                ? "bg-green-50 border border-green-100"
                : "bg-violet-50 border border-violet-100"
            }`}>
              <div className="flex items-center">
                {interestState.interest?.approved ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Clock className="h-5 w-5 text-violet-500 mr-2" />
                )}
                <h3 className="font-medium">
                  {interestState.interest?.approved
                    ? "¡Has sido aprobado para este evento!"
                    : "Has aplicado a este evento"}
                </h3>
              </div>
              <p className="mt-1 text-sm">
                {interestState.interest?.approved
                  ? "La marca ha aprobado tu participación. Próximamente te contactarán con más detalles."
                  : "Tu solicitud está pendiente de revisión por parte de la marca."}
              </p>
              {interestState.interest?.message && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Tu mensaje:</p>
                  <p className="text-sm mt-1 italic">"{interestState.interest.message}"</p>
                </div>
              )}
              {!interestState.interest?.approved && (
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 border-red-200"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Cancelar aplicación
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contenido del evento */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Descripción</h3>
            <p className="text-gray-700">{event.description}</p>
          </div>
          
          {event.requirements && (
            <div>
              <h3 className="mb-2 font-semibold">Requisitos</h3>
              <p className="text-gray-700">{event.requirements}</p>
            </div>
          )}
          
          <Separator />
          
          <div>
            <h3 className="mb-2 font-semibold">Fechas importantes</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4 text-violet-500" />
                <span className="font-medium">Fecha límite:</span>
                <span className="ml-1">
                  {event.deadline ? formatDate(new Date(event.deadline)) : "No definida"}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4 text-violet-500" />
                <span className="font-medium">Inicio:</span>
                <span className="ml-1">
                  {event.startDate ? formatDate(new Date(event.startDate)) : "No definida"}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <CalendarDays className="mr-2 h-4 w-4 text-violet-500" />
                <span className="font-medium">Fin:</span>
                <span className="ml-1">
                  {event.endDate ? formatDate(new Date(event.endDate)) : "No definida"}
                </span>
              </div>
              
              {event.minFollowers && (
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-violet-500" />
                  <span className="font-medium">Seguidores mínimos:</span>
                  <span className="ml-1">{event.minFollowers.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="mb-2 font-semibold">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              {event.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {AVAILABLE_CATEGORIES.find(c => c.id === category)?.label || category}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <Button
            variant="outline"
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              toast.success("Enlace copiado al portapapeles");
            }}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
          
          {!interestState.hasInterest ? (
            <Button onClick={() => setInterestDialogOpen(true)}>
              <Heart className="mr-2 h-4 w-4" />
              Me interesa
            </Button>
          ) : interestState.interest?.approved ? (
            <Button variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <BadgeCheck className="mr-2 h-4 w-4" />
              Aprobado
            </Button>
          ) : (
            <Button variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
              <Clock className="mr-2 h-4 w-4" />
              Solicitud pendiente
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Sobre la marca */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre la marca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={event.createdBy.brandProfile?.logo || ""} alt={event.createdBy.brandProfile?.companyName || "Marca"} />
              <AvatarFallback className="bg-violet-100 text-violet-600">
                <Building className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{event.createdBy.brandProfile?.companyName || "Marca"}</h3>
              {event.createdBy.brandProfile?.industry && (
                <p className="text-sm text-gray-600">{event.createdBy.brandProfile.industry}</p>
              )}
              {event.createdBy.brandProfile?.location && (
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {event.createdBy.brandProfile.location}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para expresar interés */}
      <Dialog open={interestDialogOpen} onOpenChange={setInterestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Expresar interés en el evento</DialogTitle>
            <DialogDescription>
              Envía un mensaje a la marca explicando por qué estás interesado en participar.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder="Escribe un mensaje para la marca (opcional)"
              className="min-h-[100px]"
              value={interestMessage}
              onChange={(e) => setInterestMessage(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setInterestDialogOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleExpressInterest}
              disabled={submitting}
            >
              {submitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para cancelar interés */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar solicitud</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar tu solicitud para este evento?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
              disabled={submitting}
            >
              Volver
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancelInterest}
              disabled={submitting}
            >
              {submitting ? "Cancelando..." : "Cancelar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}