"use client";

import React from "react";
import { BarChart2 } from "lucide-react";

export default function StatsTab() {
  return (
    <div className="space-y-5 mt-4">
      {/* Estadísticas generales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Resumen estadísticas</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-violet-50 to-white rounded-lg p-4">
              <p className="text-xs font-medium text-violet-600 mb-1">Alcance promedio</p>
              <p className="text-xl font-bold text-violet-900">12.5K</p>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-white rounded-lg p-4">
              <p className="text-xs font-medium text-pink-600 mb-1">Engagement rate</p>
              <p className="text-xl font-bold text-pink-900">4.2%</p>
            </div>
          </div>
          
          <AudienceGender />
          <AudienceAge />
        </div>
      </div>
      
      <BestPosts />
    </div>
  );
}

// Componente para mostrar las mejores publicaciones
function BestPosts() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Mejores publicaciones</h2>
      </div>
      
      <div className="p-6 text-center">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
          <BarChart2 className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">Estadísticas próximamente</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
          Estamos preparando analíticas detalladas para tu perfil
        </p>
      </div>
    </div>
  );
}

// Componente para mostrar demografía por género
function AudienceGender() {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-medium text-gray-500">Audiencia por género</p>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-violet-500" 
          style={{ width: "65%" }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <p className="text-xs text-gray-600">Mujeres: 65%</p>
        <p className="text-xs text-gray-600">Hombres: 35%</p>
      </div>
    </div>
  );
}

// Componente para mostrar demografía por edad
function AudienceAge() {
  const ageGroups = [
    { range: "18-24", percentage: 42, color: "bg-violet-500", textColor: "text-violet-700" },
    { range: "25-34", percentage: 38, color: "bg-pink-500", textColor: "text-pink-700" },
    { range: "35-44", percentage: 15, color: "bg-violet-500", textColor: "text-violet-700" },
    { range: "45+", percentage: 5, color: "bg-pink-500", textColor: "text-pink-700" }
  ];
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Audiencia por edad</h3>
      <div className="space-y-2">
        {ageGroups.map((group) => (
          <div key={group.range}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{group.range}</span>
              <span className={`font-medium ${group.textColor}`}>{group.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${group.color}`} style={{ width: `${group.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}