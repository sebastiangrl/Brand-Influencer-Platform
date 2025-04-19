// components/dashboard/brand/influencers/influencer-detail-dialog.tsx
import { 
  Users, 
  MessageSquare, 
  Tag,
  Youtube,
  Facebook,
  Twitter
} from "lucide-react";
import { Influencer } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InstagramIcon from "@/components/icons/instagram-icon";
import TiktokIcon from "@/components/icons/tiktok-icon";
import { formatFollowers } from "@/lib/utils";

interface CategoryOption {
  id: string;
  label: string;
}

interface InfluencerDetailDialogProps {
  influencer: Influencer;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onStartConversation: (userId: string) => void;
  onInviteToEvent: (influencerId: string) => void;
  availableCategories: CategoryOption[];
  formatFollowers?: (count: number | null) => string;
}

export default function InfluencerDetailDialog({
  influencer,
  isOpen,
  onOpenChange,
  onStartConversation,
  onInviteToEvent,
  availableCategories,
}: InfluencerDetailDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {influencer.nickname || influencer.user.name}
          </DialogTitle>
          <DialogDescription>
            {influencer.niche || "Creador de contenido"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-semibold">Información personal</h3>
            <p className="mb-4 text-gray-700">{influencer.bio || "Sin biografía"}</p>
            
            <h3 className="mb-2 font-semibold">Categorías</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {influencer.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {availableCategories.find(c => c.id === category)?.label || category}
                </Badge>
              ))}
            </div>
            
            <h3 className="mb-2 font-semibold">Alcance de audiencia</h3>
            <p className="text-gray-700">
              {influencer.audienceSize 
                ? `${formatFollowers(influencer.audienceSize)} seguidores en total`
                : "Alcance no especificado"}
            </p>
          </div>
          
          <div>
            <h3 className="mb-2 font-semibold">Redes sociales</h3>
            <div className="space-y-3">
              {influencer.instagramUsername && (
                <div className="flex items-center gap-2">
                  <InstagramIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-gray-500">
                      @{influencer.instagramUsername} · {formatFollowers(influencer.instagramFollowers)} seguidores
                    </p>
                  </div>
                </div>
              )}
              
              {influencer.tiktokUsername && (
                <div className="flex items-center gap-2">
                  <TiktokIcon className="h-5 w-5 text-black" />
                  <div>
                    <p className="font-medium">TikTok</p>
                    <p className="text-sm text-gray-500">
                      @{influencer.tiktokUsername} · {formatFollowers(influencer.tiktokFollowers)} seguidores
                    </p>
                  </div>
                </div>
              )}
              
              {influencer.youtubeUrl && (
                <div className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">YouTube</p>
                    <p className="text-sm text-gray-500 underline">
                      <a href={influencer.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        Canal de YouTube
                      </a>
                    </p>
                  </div>
                </div>
              )}
              
              {influencer.facebookUrl && (
                <div className="flex items-center gap-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Facebook</p>
                    <p className="text-sm text-gray-500 underline">
                      <a href={influencer.facebookUrl} target="_blank" rel="noopener noreferrer">
                        Página de Facebook
                      </a>
                    </p>
                  </div>
                </div>
              )}
              
              {influencer.twitterUrl && (
                <div className="flex items-center gap-2">
                  <Twitter className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="font-medium">Twitter</p>
                    <p className="text-sm text-gray-500 underline">
                      <a href={influencer.twitterUrl} target="_blank" rel="noopener noreferrer">
                        Perfil de Twitter
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cerrar
          </Button>
          <Button 
            variant="outline"
            className="gap-1"
            onClick={() => onStartConversation(influencer.user.id)}
          >
            <MessageSquare className="h-4 w-4" />
            Contactar
          </Button>
          <Button
            className="gap-1"
            onClick={() => {
              onInviteToEvent(influencer.id);
              onOpenChange(false);
            }}
          >
            <Tag className="h-4 w-4" />
            Invitar a evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}