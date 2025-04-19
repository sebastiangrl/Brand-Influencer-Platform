// components/dashboard/brand/events/event-detail.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CalendarDays, 
  Users, 
  MapPin, 
  Clock, 
  Edit, 
  Trash2, 
  Plus,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Share2,
  MessageSquare,
  User
} from "lucide-react";
import InstagramIcon from "@/components/icons/instagram-icon";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { EventStatus } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event, EventInterest } from "@/types/brand";

interface EventDetailProps {
  event: Event & {
    interests: EventInterest[];
  };
}

export default function EventDetail({ event }: EventDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("details");

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el evento");
      }

      toast.success("Evento eliminado correctamente");
      router.push("/dashboard/brand/events");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo eliminar el evento");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleApproveInfluencer = async (interestId: string) => {
    try {
      const response = await fetch(`/api/events/interests/${interestId}/approve`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Error al aprobar al influencer");
      }

      toast.success("Influencer aprobado correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo aprobar al influencer");
    }
  };

  const handleRejectInfluencer = async (interestId: string) => {
    try {
      const response = await fetch(`/api/events/interests/${interestId}/reject`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Error al rechazar al influencer");
      }

      toast.success("Influencer rechazado correctamente");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo rechazar al influencer");
    }
  };

  const copyEventLink = () => {
    const url = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Enlace copiado al portapapeles");
  };

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

  const formatDate = (date: string | Date | null) => {
    if (!date) return "No definida";
    return new Date(date).toLocaleDateString();
  };

  const getPendingApplications = () => {
    return event.interests.filter((interest) => !interest.approved);
  };

  const getApprovedApplications = () => {
    return event.interests.filter((interest) => interest.approved);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => router.push("/dashboard/brand/events")}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {event.title}
            </h1>
            {getStatusBadge(event.status)}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={copyEventLink}
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => router.push(`/dashboard/brand/events/${event.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Eliminar evento?</DialogTitle>
                  <DialogDescription>
                    Esta acción no se puede deshacer. El evento será eliminado permanentemente.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteEvent}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs 
              defaultValue="details" 
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="applications">
                  Aplicaciones ({event.interests.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Detalles del evento</CardTitle>
                    <CardDescription>
                      Información completa sobre el evento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-2 font-semibold">Descripción</h3>
                      <p className="text-gray-700">{event.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-semibold">Requisitos</h3>
                      <p className="text-gray-700">{event.requirements || "Sin requisitos especificados"}</p>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-semibold">Compensación</h3>
                      <p className="text-gray-700">{event.compensation}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="mb-2 font-semibold">Detalles del evento</h3>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">Fecha límite:</span>
                            <span>{formatDate(event.deadline)}</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarDays className="h-4 w-4" />
                            <span className="font-medium">Inicio:</span>
                            <span>{formatDate(event.startDate)}</span>
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarDays className="h-4 w-4" />
                            <span className="font-medium">Fin:</span>
                            <span>{formatDate(event.endDate)}</span>
                          </li>
                          {event.location && (
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">Ubicación:</span>
                              <span>{event.location}</span>
                            </li>
                          )}
                          {event.maxInfluencers && (
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">Máximo de influencers:</span>
                              <span>{event.maxInfluencers}</span>
                            </li>
                          )}
                          {event.minFollowers && (
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-4 w-4" />
                              <span className="font-medium">Mínimo de seguidores:</span>
                              <span>{event.minFollowers.toLocaleString()}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="mb-2 font-semibold">Categorías</h3>
                        <div className="flex flex-wrap gap-2">
                          {event.categories.map((category: string) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="applications">
                <Card>
                  <CardHeader>
                    <CardTitle>Aplicaciones al evento</CardTitle>
                    <CardDescription>
                      Influencers que han mostrado interés en tu evento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="pending" className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="pending">
                          Pendientes ({getPendingApplications().length})
                        </TabsTrigger>
                        <TabsTrigger value="approved">
                          Aprobados ({getApprovedApplications().length})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="pending">
                        {getPendingApplications().length === 0 ? (
                          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
                            <p className="text-gray-500">Aún no hay aplicaciones pendientes</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {getPendingApplications().map((interest) => (
                              <div 
                                key={interest.id} 
                                className="flex flex-col justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 sm:flex-row sm:items-center"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border">
                                    <AvatarImage 
                                      src={interest.influencer.user?.image || ""} 
                                      alt={interest.influencer.nickname || "Influencer"} 
                                    />
                                    <AvatarFallback>
                                      {interest.influencer.nickname?.charAt(0) || 
                                       interest.influencer.user.name?.charAt(0) || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">
                                      {interest.influencer.nickname || interest.influencer.user.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      {interest.influencer.instagramFollowers && (
                                        <span className="flex items-center gap-1">
                                          <InstagramIcon className="h-3 w-3" />
                                          {interest.influencer.instagramFollowers.toLocaleString()}
                                        </span>
                                      )}
                                      {interest.message && (
                                        <span className="flex items-center gap-1">
                                          <MessageSquare className="h-3 w-3" />
                                          "Incluye mensaje"
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1">
                                        <CalendarDays className="h-3 w-3" />
                                        {new Date(interest.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 flex gap-2 sm:mt-0">
                                  {interest.message && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1">
                                          <MessageSquare className="h-4 w-4" />
                                          Ver mensaje
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Mensaje del influencer</DialogTitle>
                                        </DialogHeader>
                                        <div className="mt-4 whitespace-pre-wrap rounded-lg bg-gray-50 p-4">
                                          {interest.message}
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => router.push(`/dashboard/brand/influencers/${interest.influencer.id}`)}
                                  >
                                    <User className="h-4 w-4" />
                                    Ver perfil
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-green-600"
                                    onClick={() => handleApproveInfluencer(interest.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-red-600"
                                    onClick={() => handleRejectInfluencer(interest.id)}
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Rechazar
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="approved">
                        {getApprovedApplications().length === 0 ? (
                          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
                            <p className="text-gray-500">Aún no has aprobado ninguna aplicación</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {getApprovedApplications().map((interest) => (
                              <div 
                                key={interest.id} 
                                className="flex flex-col justify-between rounded-lg border border-green-100 bg-green-50 p-4 transition-all sm:flex-row sm:items-center"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border">
                                    <AvatarImage 
                                      src={interest.influencer.user?.image || ""} 
                                      alt={interest.influencer.nickname || "Influencer"} 
                                    />
                                    <AvatarFallback>
                                      {interest.influencer.nickname?.charAt(0) || 
                                       interest.influencer.user.name?.charAt(0) || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">
                                      {interest.influencer.nickname || interest.influencer.user.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      {interest.influencer.instagramFollowers && (
                                        <span className="flex items-center gap-1">
                                          <InstagramIcon className="h-3 w-3" />
                                          {interest.influencer.instagramFollowers.toLocaleString()}
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                        Aprobado
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 flex gap-2 sm:mt-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => router.push(`/dashboard/brand/influencers/${interest.influencer.id}`)}
                                  >
                                    <User className="h-4 w-4" />
                                    Ver perfil
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1"
                                    onClick={() => {
                                      router.push(`/dashboard/brand/messages?to=${interest.user.id}`);
                                    }}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                    Enviar mensaje
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del evento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <div className="mt-1">{getStatusBadge(event.status)}</div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Fecha límite para aplicar</p>
                    <p className="font-medium">{formatDate(event.deadline)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Aplicaciones recibidas</p>
                    <p className="font-medium">{event.interests.length}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Influencers aprobados</p>
                    <p className="font-medium">{getApprovedApplications().length}</p>
                  </div>
                  
                  {event.maxInfluencers && (
                    <div>
                      <p className="text-sm text-gray-500">Plazas restantes</p>
                      <p className="font-medium">
                        {Math.max(0, event.maxInfluencers - getApprovedApplications().length)} de {event.maxInfluencers}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {event.status === EventStatus.DRAFT && (
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/events/${event.id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            ...event,
                            status: EventStatus.PUBLISHED,
                          }),
                        });
                        
                        if (!response.ok) {
                          throw new Error("Error al publicar el evento");
                        }
                        
                        toast.success("Evento publicado correctamente");
                        router.refresh();
                      } catch (error) {
                        console.error("Error:", error);
                        toast.error("No se pudo publicar el evento");
                      }
                    }}
                  >
                    Publicar evento
                  </Button>
                )}
                
                {event.status === EventStatus.PUBLISHED && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/events/${event.id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            ...event,
                            status: EventStatus.CLOSED,
                          }),
                        });
                        
                        if (!response.ok) {
                          throw new Error("Error al cerrar el evento");
                        }
                        
                        toast.success("Evento cerrado correctamente");
                        router.refresh();
                      } catch (error) {
                        console.error("Error:", error);
                        toast.error("No se pudo cerrar el evento");
                      }
                    }}
                  >
                    Cerrar evento
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Acciones rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    if (event.status === EventStatus.PUBLISHED) {
                      copyEventLink();
                    } else {
                      toast.info("El evento debe estar publicado para compartirlo");
                    }
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Compartir enlace
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push(`/dashboard/brand/events/${event.id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                  Editar evento
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedTab("applications")}
                >
                  <Users className="h-4 w-4" />
                  Ver aplicaciones
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push("/dashboard/brand/events/create")}
                >
                  <Plus className="h-4 w-4" />
                  Crear nuevo evento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}