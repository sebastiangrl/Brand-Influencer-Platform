//src/components/dashboard/brand/influencers/invite-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ArrowLeft, 
  Calendar,
  CalendarDays,
  Send,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { EventStatus } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

// Definir tipo para eventos
interface Event {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  categories: string[];
  compensation: string | null;
  images: string[];
  hasInvited?: boolean;
}

// Definir tipo para influencer
interface Influencer {
  id: string;
  nickname: string | null;
  bio: string | null;
  instagramUsername: string | null;
  instagramFollowers: number | null;
  tiktokUsername: string | null;
  tiktokFollowers: number | null;
  niche: string | null;
  categories: string[];
  audienceSize: number | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

// Esquema de validación para el formulario
const inviteSchema = z.object({
  eventId: z.string({
    required_error: "Debes seleccionar un evento",
  }),
  message: z.string().max(1000, {
    message: "El mensaje no debe exceder los 1000 caracteres",
  }).optional(),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteFormProps {
  influencerId: string;
}

export default function InviteForm({ influencerId }: InviteFormProps) {
  const router = useRouter();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      message: "",
    },
  });
  
  // Cargar datos del influencer y eventos disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del influencer
        const influencerResponse = await fetch(`/api/influencers/${influencerId}`);
        if (!influencerResponse.ok) {
          throw new Error("Error al cargar información del influencer");
        }
        const influencerData = await influencerResponse.json();
        setInfluencer(influencerData);
        
        // Obtener eventos de la marca
        const eventsResponse = await fetch("/api/events?status=PUBLISHED");
        if (!eventsResponse.ok) {
          throw new Error("Error al cargar eventos");
        }
        const eventsData = await eventsResponse.json();
        
        // Verificar cuáles eventos ya tienen invitación
        const eventsWithInvitationStatus = await Promise.all(
          eventsData.map(async (event: Event) => {
            try {
              const interestResponse = await fetch(`/api/events/${event.id}/invite`);
              if (interestResponse.ok) {
                const interests = await interestResponse.json();
                // Verificar si ya se ha invitado a este influencer
                const hasInvited = interests.some(
                  (interest: any) => interest.influencerId === influencerId
                );
                return { ...event, hasInvited };
              }
              return { ...event, hasInvited: false };
            } catch (error) {
              return { ...event, hasInvited: false };
            }
          })
        );
        
        // Filtrar solo eventos publicados y que no tienen invitación activa
        const availableEvents = eventsWithInvitationStatus.filter(
          (event: Event) => 
            event.status === EventStatus.PUBLISHED && 
            !event.hasInvited
        );
        
        setEvents(availableEvents);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    if (influencerId) {
      fetchData();
    }
  }, [influencerId]);
  
  // Manejar envío del formulario
  const onSubmit = async (values: InviteFormValues) => {
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/events/${values.eventId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          influencerId: influencerId,
          message: values.message || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar la invitación");
      }

      toast.success("Invitación enviada correctamente");
      
      // Redireccionar al detalle del evento
      router.push(`/dashboard/brand/events/${values.eventId}`);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Error al enviar la invitación");
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizar componente
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Si no hay datos del influencer
  if (!influencer) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Influencer no encontrado</h2>
        <p className="text-gray-600 mb-4">
          No se pudo cargar la información del influencer.
        </p>
        <Button onClick={() => router.push("/dashboard/brand/influencers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al directorio
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold ml-2">
          Invitar a Evento
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar evento</CardTitle>
              <CardDescription>
                Elige un evento para invitar a {influencer.nickname || influencer.user.name || "este influencer"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <Calendar className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">No hay eventos disponibles</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                    No tienes eventos publicados disponibles para invitar a este influencer.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => router.push("/dashboard/brand/events/create")}
                  >
                    Crear nuevo evento
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="eventId"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="space-y-4">
                            {events.map((event) => (
                              <div
                                key={event.id}
                                className={`flex items-start border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer ${
                                  field.value === event.id ? "border-primary bg-primary/5" : ""
                                }`}
                                onClick={() => field.onChange(event.id)}
                              >
                                <div className="flex-shrink-0 mr-4">
                                  {event.images && event.images.length > 0 ? (
                                    <div className="h-16 w-16 rounded-md overflow-hidden">
                                      <img
                                        src={event.images[0]}
                                        alt={event.title}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                                      <Calendar className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{event.title}</h3>
                                    <Checkbox
                                      checked={field.value === event.id}
                                      onCheckedChange={() => field.onChange(event.id)}
                                    />
                                  </div>
                                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                    {event.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="flex items-center text-xs text-gray-500">
                                      <CalendarDays className="mr-1 h-3 w-3" />
                                      {event.startDate ? formatDate(new Date(event.startDate)) : "Sin fecha definida"}
                                    </div>
                                    {event.compensation && (
                                      <Badge variant="outline" className="text-xs">
                                        {event.compensation}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mensaje personalizado (opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Escribe un mensaje personalizado para el influencer..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Incluye más detalles o información específica para el influencer.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={submitting}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={submitting || !form.watch("eventId")}>
                        {submitting ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar invitación
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Detalles del influencer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-14 w-14 mr-3">
                  <AvatarImage src={influencer.user?.image || ""} alt={influencer.nickname || "Influencer"} />
                  <AvatarFallback>
                    {influencer.nickname?.charAt(0) || influencer.user.name?.charAt(0) || "I"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{influencer.nickname || influencer.user.name}</h3>
                  <p className="text-sm text-gray-500">{influencer.niche || "Creador de contenido"}</p>
                </div>
              </div>

              {influencer.bio && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Biografía</h4>
                  <p className="text-sm text-gray-600">{influencer.bio}</p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Estadísticas</h4>
                <div className="space-y-2">
                  {influencer.instagramFollowers && (
                    <div className="flex justify-between">
                      <span className="text-sm">Instagram</span>
                      <span className="text-sm font-medium">{influencer.instagramFollowers.toLocaleString()}</span>
                    </div>
                  )}
                  {influencer.tiktokFollowers && (
                    <div className="flex justify-between">
                      <span className="text-sm">TikTok</span>
                      <span className="text-sm font-medium">{influencer.tiktokFollowers.toLocaleString()}</span>
                    </div>
                  )}
                  {influencer.audienceSize && (
                    <div className="flex justify-between">
                      <span className="text-sm">Audiencia total</span>
                      <span className="text-sm font-medium">{influencer.audienceSize.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Categorías</h4>
                <div className="flex flex-wrap gap-1">
                  {influencer.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/dashboard/brand/influencers/${influencerId}`)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ver perfil completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}