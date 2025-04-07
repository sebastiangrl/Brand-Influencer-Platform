// components/dashboard/admin/dashboard-content.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ApprovalStatus } from "@/lib/constants";
import { Search, Filter, Plus } from "lucide-react";
import InfluencerTable from "@/components/dashboard/admin/influencer-table";
import InfluencerDetailsModal from "./influencer-details-modal";
import WaitingListModal from "@/components/dashboard/admin/waiting-list-modal";
import { InfluencerProfile } from "@/types/influencer";

interface AdminDashboardContentProps {
  initialRequests: InfluencerProfile[];
}

export default function AdminDashboardContent({ initialRequests }: AdminDashboardContentProps) {
  const [requests, setRequests] = useState<InfluencerProfile[]>(initialRequests);
  const [activeRequest, setActiveRequest] = useState<InfluencerProfile | null>(null);
  const [waitingListReason, setWaitingListReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pendientes");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filtrar solicitudes por estado
  const pendingRequests = requests.filter(
    (req) => req.approvalStatus === ApprovalStatus.PENDING
  );
  const approvedRequests = requests.filter(
    (req) => req.approvalStatus === ApprovalStatus.APPROVED
  );
  const waitingListRequests = requests.filter(
    (req) => req.approvalStatus === ApprovalStatus.REJECTED
  );

  // Manejar la aprobación de un influencer
  const handleApprove = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/influencers/${id}/approve`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al aprobar la solicitud");
      }

      toast.success("Solicitud aprobada correctamente");
      
      // Actualizar la lista de solicitudes
      setRequests(
        requests.map((req) =>
          req.id === id
            ? { ...req, approvalStatus: ApprovalStatus.APPROVED, approvedAt: new Date() }
            : req
        )
      );
      
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Ver detalles del influencer
  const viewDetails = (request: InfluencerProfile) => {
    setActiveRequest(request);
    setIsDetailsModalOpen(true);
  };

  // Abrir modal de lista de espera
  const openWaitingListModal = (request: InfluencerProfile) => {
    setActiveRequest(request);
    setWaitingListReason("");
    setIsModalOpen(true);
  };

  // Manejar el envío a lista de espera
  const handleAddToWaitingList = async () => {
    if (!activeRequest) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/influencers/${activeRequest.id}/waiting-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: waitingListReason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al añadir a la lista de espera");
      }

      toast.success("Influencer añadido a la lista de espera correctamente");
      
      // Actualizar la lista de solicitudes
      setRequests(
        requests.map((req) =>
          req.id === activeRequest.id
            ? { 
                ...req, 
                approvalStatus: ApprovalStatus.REJECTED,
                rejectionReason: waitingListReason
              }
            : req
        )
      );
      
      setIsModalOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar qué solicitudes mostrar basado en la tab activa y búsqueda
  const getActiveRequests = () => {
    let filteredRequests;
    
    switch (activeTab) {
      case "pendientes":
        filteredRequests = pendingRequests;
        break;
      case "aprobadas":
        filteredRequests = approvedRequests;
        break;
      case "listaespera":
        filteredRequests = waitingListRequests;
        break;
      default:
        filteredRequests = pendingRequests;
    }

    // Aplicar filtro de búsqueda si existe
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return filteredRequests.filter(req => 
        req.nickname?.toLowerCase().includes(query) || 
        req.user.name?.toLowerCase().includes(query) || 
        req.user.email.toLowerCase().includes(query) ||
        req.instagramUsername?.toLowerCase().includes(query) ||
        req.tiktokUsername?.toLowerCase().includes(query) ||
        req.niche?.toLowerCase().includes(query)
      );
    }

    return filteredRequests;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Gestión de Influencers</h2>
          <p className="text-gray-600 mt-1">Administra las solicitudes y perfiles de influencers</p>
        </div>
        
        {/* Tabs de navegación */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("pendientes")}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "pendientes"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pendientes {pendingRequests.length > 0 && `(${pendingRequests.length})`}
            </button>
            <button
              onClick={() => setActiveTab("aprobadas")}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "aprobadas"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Aprobadas {approvedRequests.length > 0 && `(${approvedRequests.length})`}
            </button>
            <button
              onClick={() => setActiveTab("listaespera")}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "listaespera"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Lista de espera {waitingListRequests.length > 0 && `(${waitingListRequests.length})`}
            </button>
          </nav>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="w-full sm:w-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar influencers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Añadir manualmente
            </button>
          </div>
        </div>
        
        {/* Tabla de solicitudes */}
        <div className="px-6 py-4">
          <InfluencerTable 
            requests={getActiveRequests()} 
            activeTab={activeTab}
            isLoading={isLoading}
            onViewDetails={viewDetails}
            onApprove={handleApprove}
            onAddToWaitingList={openWaitingListModal}
          />
        </div>
      </div>

      {/* Modal de detalles */}
      {isDetailsModalOpen && activeRequest && (
        <InfluencerDetailsModal
          influencer={activeRequest}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onApprove={handleApprove}
          onAddToWaitingList={() => {
            setIsDetailsModalOpen(false);
            openWaitingListModal(activeRequest);
          }}
        />
      )}

      {/* Modal lista de espera */}
      {isModalOpen && activeRequest && (
        <WaitingListModal 
          influencer={activeRequest}
          isOpen={isModalOpen}
          isLoading={isLoading}
          reason={waitingListReason}
          onReasonChange={setWaitingListReason}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleAddToWaitingList}
        />
      )}
    </div>
  );
}