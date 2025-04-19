// components/dashboard/brand/influencers/influencer-detail.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar, 
  MessageSquare, 
  Tag, 
  Users, 
  TrendingUp,
  MapPin,
  Mail,
  Phone,
  Share2
} from "lucide-react";
import InstagramIcon from "@/components/icons/instagram-icon";
import TiktokIcon from "@/components/icons/tiktok-icon";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatFollowers, getInitials } from "@/lib/utils";
import { AVAILABLE_CATEGORIES } from "@/lib/constants";

interface InfluencerDetailProps {
  influencer: any; // Usar el tipo específico cuando esté disponible
}

export default function InfluencerDetail({ influencer }: InfluencerDetailProps) {
  const router = useRouter();

  // Función para iniciar conversación
  const startConversation = async () => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: influencer.user.id,
          content: "¡Hola! Me interesa trabajar contigo en una colaboración.",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar la conversación");
      }

      toast.success("Mensaje enviado con éxito");
      router.push("/dashboard/brand/messages");
    } catch (error) {
      console.error("Error:", error);
      toast.error("No se pudo enviar el mensaje");
    }
  };

  // Función para invitar a un evento
  const inviteToEvent = () => {
    router.push(`/dashboard/brand/events/create?influencer=${influencer.id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-3 gap-1"
            onClick={() => router.push("/dashboard/brand/influencers")}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al directorio
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Perfil de Influencer
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Información de perfil */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage 
                      src={influencer.user?.image || ""} 
                      alt={influencer.nickname || "Influencer"} 
                    />
                    <AvatarFallback>
                      {getInitials(influencer.nickname || influencer.user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">
                      {influencer.nickname || influencer.user.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {influencer.niche || "Creador de contenido"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2 font-semibold">Biografía</h3>
                  <p className="text-gray-700">{influencer.bio || "Sin biografía"}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="mb-3 font-semibold">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    {influencer.categories?.map((category: string) => (
                      <Badge key={category} variant="secondary">
                        {AVAILABLE_CATEGORIES.find(c => c.id === category)?.label || category}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />

                <div>
                  <h3 className="mb-3 font-semibold">Métricas</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {influencer.instagramFollowers && (
                      <div className="rounded-md bg-gray-50 p-3 text-center">
                        <div className="mb-1 flex items-center justify-center">
                          <InstagramIcon className="mr-1 h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-sm font-medium">Instagram</p>
                        <p className="text-lg font-semibold">
                          {formatFollowers(influencer.instagramFollowers)}
                        </p>
                      </div>
                    )}
                    
                    {influencer.tiktokFollowers && (
                      <div className="rounded-md bg-gray-50 p-3 text-center">
                        <div className="mb-1 flex items-center justify-center">
                          <TiktokIcon className="mr-1 h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium">TikTok</p>
                        <p className="text-lg font-semibold">
                          {formatFollowers(influencer.tiktokFollowers)}
                        </p>
                      </div>
                    )}
                    
                    <div className="rounded-md bg-gray-50 p-3 text-center">
                      <div className="mb-1 flex items-center justify-center">
                        <Users className="mr-1 h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium">Alcance Total</p>
                      <p className="text-lg font-semibold">
                        {formatFollowers(influencer.audienceSize || 
                          (influencer.instagramFollowers || 0) + (influencer.tiktokFollowers || 0))}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociales</CardTitle>
                  <CardDescription>
                    Perfiles del influencer en redes sociales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {influencer.instagramUsername && (
                    <div className="flex justify-between rounded-md border p-4">
                      <div className="flex items-center gap-3">
                        <InstagramIcon className="h-7 w-7 text-purple-600" />
                        <div>
                          <p className="font-medium">Instagram</p>
                          <p className="text-sm text-gray-500">@{influencer.instagramUsername}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://instagram.com/${influencer.instagramUsername}`, '_blank')}
                      >
                        Ver perfil
                      </Button>
                    </div>
                  )}
                  
                  {influencer.tiktokUsername && (
                    <div className="flex justify-between rounded-md border p-4">
                      <div className="flex items-center gap-3">
                        <TiktokIcon className="h-7 w-7" />
                        <div>
                          <p className="font-medium">TikTok</p>
                          <p className="text-sm text-gray-500">@{influencer.tiktokUsername}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://tiktok.com/@${influencer.tiktokUsername}`, '_blank')}
                      >
                        Ver perfil
                      </Button>
                    </div>
                  )}
                  
                  {/* Mostrar otras redes sociales si están disponibles */}
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Acciones y estadísticas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start gap-2"
                  onClick={startConversation}
                >
                  <MessageSquare className="h-4 w-4" />
                  Contactar influencer
                </Button>
                <Button 
                  className="w-full justify-start gap-2"
                  onClick={inviteToEvent}
                >
                  <Tag className="h-4 w-4" />
                  Invitar a evento
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    toast.success("Enlace copiado al portapapeles");
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Compartir perfil
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {influencer.whatsappContact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-green-600" />
                    <span className="font-medium">WhatsApp:</span>
                    <span>{influencer.whatsappContact}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{influencer.user.email}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de interacción</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tasa de respuesta</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tiempo promedio de respuesta</span>
                  <span className="font-medium">24 horas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Colaboraciones previas</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tasa de engagement</span>
                  <span className="font-medium">4.8%</span>
                </div>
                <div className="mt-2 rounded-md bg-gray-50 p-3 text-center text-xs text-gray-500">
                  Los datos mostrados son aproximados y pueden variar
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}