//src/components/dashboard/influencer/tabs/profile-tab.tsx
"use client";

import React from "react";
import { Grid, BarChart2, Instagram, ChevronRight } from "lucide-react";
import { InfluencerProfile } from "@/types/influencer";
import { formatFollowers } from "@/lib/utils";

interface ProfileTabProps {
  influencer: InfluencerProfile;
}

export default function ProfileTab({ influencer }: ProfileTabProps) {
  // Calcular estadísticas generales
  const totalFollowers = (influencer.instagramFollowers || 0) + (influencer.tiktokFollowers || 0);

  return (
    <div className="space-y-5">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl p-4 shadow-sm border border-violet-100">
          <h3 className="text-sm font-medium text-violet-800 mb-2">Total seguidores</h3>
          <p className="text-2xl font-bold text-violet-900">{formatFollowers(totalFollowers)}</p>
          <div className="mt-2 flex items-center text-xs text-violet-700">
            <Grid className="w-3 h-3 mr-1" />
            <span>Todas las redes</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-4 shadow-sm border border-pink-100">
          <h3 className="text-sm font-medium text-pink-800 mb-2">Engagement</h3>
          <p className="text-2xl font-bold text-pink-900">4.2%</p>
          <div className="mt-2 flex items-center text-xs text-pink-700">
            <BarChart2 className="w-3 h-3 mr-1" />
            <span>Último mes</span>
          </div>
        </div>
      </div>
      
      {/* Cuentas vinculadas */}
      <SocialAccountsCard influencer={influencer} />
      
      {/* Bio y detalles */}
      <BioCard influencer={influencer} />
    </div>
  );
}

// Componente para las cuentas sociales vinculadas
function SocialAccountsCard({ influencer }: { influencer: InfluencerProfile }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Cuentas vinculadas</h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {influencer.instagramUsername && (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Instagram</p>
                <p className="text-xs text-gray-500">@{influencer.instagramUsername}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-violet-600 mr-2">
                {formatFollowers(influencer.instagramFollowers || 0)}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
        
        {influencer.tiktokUsername && (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                  <path d="M19.321 5.562a5.122 5.122 0 01-3.614-5.447h-3.64v13.334c0 1.999-1.645 3.604-3.625 3.584a3.57 3.57 0 01-3.526-3.583 3.57 3.57 0 013.526-3.584c.39 0 .76.074 1.104.208v-3.66a7.29 7.29 0 00-1.104-.086C4.15 6.327 1 9.509 1 13.45c0 3.941 3.15 7.123 7.042 7.123 3.892 0 7.041-3.182 7.041-7.123V8.553c1.424.99 3.055 1.53 4.738 1.53v-3.645a5.125 5.125 0 01-.5-.876z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">TikTok</p>
                <p className="text-xs text-gray-500">@{influencer.tiktokUsername}</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-semibold text-violet-600 mr-2">
                {formatFollowers(influencer.tiktokFollowers || 0)}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        )}
        
        <div className="p-3">
          <button className="w-full py-2 px-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            Vincular otra cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente para la biografía
function BioCard({ influencer }: { influencer: InfluencerProfile }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800">Sobre mí</h2>
        <button className="text-violet-600 text-sm font-medium">Editar</button>
      </div>
      
      <div className="p-4">
        {influencer.bio ? (
          <p className="text-sm text-gray-700">{influencer.bio}</p>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Añade una biografía para que las marcas te conozcan mejor
          </p>
        )}
        
        {influencer.niche && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Categoría</p>
            <div className="flex flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
                {influencer.niche}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}