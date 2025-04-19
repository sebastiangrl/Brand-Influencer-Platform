// components/dashboard/brand/influencers/influencer-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter,  
  Youtube, 
  Facebook, 
  Twitter, 
  MessageSquare,
  User,
  Info,
  Tag,
} from "lucide-react";
import InstagramIcon from "@/components/icons/instagram-icon";
import TiktokIcon from "@/components/icons/tiktok-icon";
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
import { Influencer } from "@/types/brand";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InfluencerDetailDialog from "./influencer-detail-dialog";
import { AVAILABLE_CATEGORIES } from "@/lib/constants";
import { formatFollowers, getInitials } from "@/lib/utils";

interface InfluencerListProps {
  initialInfluencers: Influencer[];
}

export default function InfluencerList({ initialInfluencers }: InfluencerListProps) {
  const router = useRouter();
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [followersSort, setFollowersSort] = useState<"asc" | "desc" | null>("desc");
  const [minFollowers, setMinFollowers] = useState<number | null>(null);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filtrar y ordenar influencers
  const filteredInfluencers = influencers
    .filter((influencer) => {
      // Filtro por búsqueda
      const matchesSearch =
        !searchQuery ||
        influencer.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.niche?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por categoría
      const matchesCategory = !categoryFilter || influencer.categories.includes(categoryFilter);

      // Filtro por número mínimo de seguidores
      const matchesFollowers =
        !minFollowers ||
        (influencer.instagramFollowers && influencer.instagramFollowers >= minFollowers) ||
        (influencer.tiktokFollowers && influencer.tiktokFollowers >= minFollowers);

      return matchesSearch && matchesCategory && matchesFollowers;
    })
    .sort((a, b) => {
      if (followersSort === "asc") {
        return (a.instagramFollowers || 0) - (b.instagramFollowers || 0);
      } else if (followersSort === "desc") {
        return (b.instagramFollowers || 0) - (a.instagramFollowers || 0);
      }
      return 0;
    });

  // Función para iniciar una conversación con un influencer
  const startConversation = async (influencerId: string) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: influencerId,
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

  const openInfluencerDetails = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setDialogOpen(true);
  };
  
  return (
    <div className="flex-1 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Directorio de Influencers</h1>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex w-full max-w-md">
          <Input
            type="search"
            placeholder="Buscar influencers..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select
            onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {AVAILABLE_CATEGORIES.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            onValueChange={(value) => setFollowersSort(value as "asc" | "desc" | null)}
            defaultValue="desc"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por seguidores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Más seguidores primero</SelectItem>
              <SelectItem value="asc">Menos seguidores primero</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="number"
            placeholder="Mín. seguidores"
            className="w-[150px]"
            onChange={(e) => setMinFollowers(e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
      </div>

      {filteredInfluencers.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
          <p className="mb-2 text-gray-500">No hay influencers que coincidan con tu búsqueda</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter(null);
              setMinFollowers(null);
              setFollowersSort("desc");
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInfluencers.map((influencer) => (
            <Card key={influencer.id} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage src={influencer.user?.image || ""} alt={influencer.nickname || "Influencer"} />
                      <AvatarFallback>
                        {getInitials(influencer.nickname || influencer.user?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{influencer.nickname || influencer.user?.name}</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {influencer.niche || "Creador de contenido"}
                      </CardDescription>
                    </div>
                  </div>
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openInfluencerDetails(influencer)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver detalles</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 line-clamp-2 text-sm text-gray-600">
                  {influencer.bio || "Sin biografía"}
                </div>
                
                <div className="mb-3 flex flex-wrap gap-1">
                  {influencer.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {AVAILABLE_CATEGORIES.find(c => c.id === category)?.label || category}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3">
                  {influencer.instagramUsername && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <InstagramIcon className="h-4 w-4 text-purple-600" />
                            <span>{formatFollowers(influencer.instagramFollowers)}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Instagram: @{influencer.instagramUsername}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {influencer.tiktokUsername && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <TiktokIcon className="h-4 w-4 text-black" />
                            <span>{formatFollowers(influencer.tiktokFollowers)}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>TikTok: @{influencer.tiktokUsername}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {influencer.youtubeUrl && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Youtube className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  
                  {influencer.facebookUrl && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Facebook className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  
                  {influencer.twitterUrl && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Twitter className="h-4 w-4 text-blue-400" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => startConversation(influencer.user.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Contactar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => router.push(`/dashboard/brand/events/create?influencer=${influencer.id}`)}
                >
                  <Tag className="h-4 w-4" />
                  Invitar a evento
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Componente de diálogo para detalles del influencer */}
      {selectedInfluencer && (
        <InfluencerDetailDialog 
          influencer={selectedInfluencer}
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          onStartConversation={startConversation}
          onInviteToEvent={(influencerId: any) => {
            router.push(`/dashboard/brand/events/create?influencer=${influencerId}`);
          }}
          availableCategories={AVAILABLE_CATEGORIES}
          formatFollowers={formatFollowers}
        />
      )}
    </div>
  );
}