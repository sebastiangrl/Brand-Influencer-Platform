// components/dashboard/admin/influencers/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ApprovalStatus } from "@/lib/constants";
import { Search, Filter, Download, ExternalLink, Users, Instagram, ChevronDown, BarChart2 } from "lucide-react";
import TiktokIcon from "@/components/icons/tiktok-icon";
import InfluencerDetailsModal from "@/components/dashboard/admin/influencer-details-modal";
import { InfluencerProfile } from "@/types/influencer";
import { formatFollowers } from "@/lib/utils";

interface InfluencersDashboardProps {
  initialInfluencers: InfluencerProfile[];
}

export default function InfluencersDashboard({ initialInfluencers }: InfluencersDashboardProps) {
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>(initialInfluencers);
  const [filteredInfluencers, setFilteredInfluencers] = useState<InfluencerProfile[]>(initialInfluencers);
  const [activeInfluencer, setActiveInfluencer] = useState<InfluencerProfile | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("followers");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  // Obtener todos los nichos únicos para filtrar
  const uniqueNiches = Array.from(
    new Set(
      influencers
        .filter((inf) => inf.niche)
        .map((inf) => inf.niche as string)
    )
  ).sort();

  // Filtrar y ordenar influencers
  useEffect(() => {
    let filtered = [...influencers];

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inf) =>
          inf.user.name?.toLowerCase().includes(query) ||
          inf.nickname?.toLowerCase().includes(query) ||
          inf.user.email.toLowerCase().includes(query) ||
          inf.instagramUsername?.toLowerCase().includes(query) ||
          inf.tiktokUsername?.toLowerCase().includes(query) ||
          inf.niche?.toLowerCase().includes(query)
      );
    }

    // Filtrar por nicho
    if (selectedNiche) {
      filtered = filtered.filter((inf) => inf.niche === selectedNiche);
    }

    // Ordenar por el campo seleccionado
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "followers":
          valueA = (a.instagramFollowers || 0) + (a.tiktokFollowers || 0);
          valueB = (b.instagramFollowers || 0) + (b.tiktokFollowers || 0);
          break;
        case "instagram":
          valueA = a.instagramFollowers || 0;
          valueB = b.instagramFollowers || 0;
          break;
        case "tiktok":
          valueA = a.tiktokFollowers || 0;
          valueB = b.tiktokFollowers || 0;
          break;
        case "name":
          valueA = a.user.name || "";
          valueB = b.user.name || "";
          return sortOrder === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        case "date":
          valueA = new Date(a.user.createdAt).getTime();
          valueB = new Date(b.user.createdAt).getTime();
          break;
        default:
          valueA = (a.instagramFollowers || 0) + (a.tiktokFollowers || 0);
          valueB = (b.instagramFollowers || 0) + (b.tiktokFollowers || 0);
      }

      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });

    setFilteredInfluencers(filtered);
  }, [influencers, searchQuery, selectedNiche, sortBy, sortOrder]);

  // Ver detalles del influencer
  const viewDetails = (influencer: InfluencerProfile) => {
    setActiveInfluencer(influencer);
    setIsDetailsModalOpen(true);
  };

  // Exportar datos a CSV
  const exportToCSV = () => {
    // Implementación básica de exportación a CSV
    const headers = "Nombre,Email,Instagram,Seguidores IG,TikTok,Seguidores TT,Nicho,Fecha Registro\n";
    
    const csvContent = filteredInfluencers.reduce((acc, inf) => {
      const row = [
        `"${inf.user.name || ''}"`,
        `"${inf.user.email}"`,
        `"${inf.instagramUsername || ''}"`,
        `${inf.instagramFollowers || 0}`,
        `"${inf.tiktokUsername || ''}"`,
        `${inf.tiktokFollowers || 0}`,
        `"${inf.niche || ''}"`,
        `"${new Date(inf.user.createdAt).toLocaleDateString('es-ES')}"`
      ].join(',');
      return acc + row + "\n";
    }, headers);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "influencers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Datos exportados correctamente");
  };

  // Calcular estadísticas generales
  const totalInfluencers = filteredInfluencers.length;
  const totalInstagramFollowers = filteredInfluencers.reduce(
    (sum, inf) => sum + (inf.instagramFollowers || 0),
    0
  );
  const totalTiktokFollowers = filteredInfluencers.reduce(
    (sum, inf) => sum + (inf.tiktokFollowers || 0),
    0
  );
  const averageFollowers = Math.round(
    (totalInstagramFollowers + totalTiktokFollowers) / 
    (totalInfluencers || 1)
  );

  // Ordenar por columna
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Manejar la acción de recargar datos
  const refreshData = () => {
    setIsLoading(true);
    // Aquí normalmente harías una llamada a la API para recargar los datos
    // Por ahora simularemos una recarga
    setTimeout(() => {
      setIsLoading(false);
      router.refresh();
      toast.success("Datos actualizados correctamente");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Panel de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Influencers</p>
              <p className="text-2xl font-bold">{totalInfluencers}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Seguidores Instagram</p>
              <p className="text-2xl font-bold">{formatFollowers(totalInstagramFollowers)}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center">
              <Instagram className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Seguidores TikTok</p>
              <p className="text-2xl font-bold">{formatFollowers(totalTiktokFollowers)}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center">
              <TiktokIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border border-gray-200">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Promedio Seguidores</p>
              <p className="text-2xl font-bold">{formatFollowers(averageFollowers)}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de influencers */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Influencers Aprobados</h2>
          <p className="text-gray-600 mt-1">Gestiona y analiza los perfiles de influencers</p>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="px-6 py-4 bg-gray-50 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-3 lg:space-y-0">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, red social..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="relative">
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Todos los nichos</option>
                {uniqueNiches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
            <button 
              onClick={refreshData}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isLoading ? "Cargando..." : "Actualizar"}
            </button>
            <button 
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
        </div>
        
        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Influencer
                    {sortBy === "name" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${
                          sortOrder === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("instagram")}
                >
                  <div className="flex items-center">
                    Instagram
                    {sortBy === "instagram" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${
                          sortOrder === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("tiktok")}
                >
                  <div className="flex items-center">
                    TikTok
                    {sortBy === "tiktok" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${
                          sortOrder === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("followers")}
                >
                  <div className="flex items-center">
                    Total Seguidores
                    {sortBy === "followers" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${
                          sortOrder === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nicho
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Fecha de Registro
                    {sortBy === "date" && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 ${
                          sortOrder === "asc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInfluencers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    {isLoading ? "Cargando influencers..." : "No se encontraron influencers con los filtros actuales"}
                  </td>
                </tr>
              ) : (
                filteredInfluencers.map((influencer) => {
                  const totalFollowers = (influencer.instagramFollowers || 0) + (influencer.tiktokFollowers || 0);
                  
                  return (
                    <tr key={influencer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {influencer.user.name || "Sin nombre"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {influencer.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {influencer.instagramUsername ? (
                          <div className="flex items-center">
                            <Instagram className="h-4 w-4 text-pink-500 mr-2" />
                            <span className="text-sm text-gray-900">
                              @{influencer.instagramUsername}
                            </span>
                            {influencer.instagramFollowers && (
                              <span className="ml-2 text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                                {formatFollowers(influencer.instagramFollowers)}
                              </span>
                            )}
                            <a
                              href={`https://instagram.com/${influencer.instagramUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No disponible</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {influencer.tiktokUsername ? (
                          <div className="flex items-center">
                            <TiktokIcon className="h-4 w-4 mr-2" />
                            <span className="text-sm text-gray-900">
                              @{influencer.tiktokUsername}
                            </span>
                            {influencer.tiktokFollowers && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                {formatFollowers(influencer.tiktokFollowers)}
                              </span>
                            )}
                            <a
                              href={`https://tiktok.com/@${influencer.tiktokUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No disponible</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {formatFollowers(totalFollowers)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {influencer.niche ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {influencer.niche}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No especificado</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(influencer.user.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewDetails(influencer)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación (opcional) */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{filteredInfluencers.length}</span> de{" "}
              <span className="font-medium">{totalInfluencers}</span> influencers
            </p>
            <div className="flex space-x-2">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Anterior
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {isDetailsModalOpen && activeInfluencer && (
        <InfluencerDetailsModal
          influencer={activeInfluencer}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onApprove={() => {}} // No es necesario para influencers ya aprobados
          onAddToWaitingList={() => {}} // No es necesario para influencers ya aprobados
        />
      )}
    </div>
  );
}