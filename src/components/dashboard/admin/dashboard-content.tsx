// components/dashboard/admin/dashboard-content.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ApprovalStatus } from "@/lib/constants";
import { CheckCircle, XCircle, Search, Filter, Plus } from "lucide-react";

// Definición de tipos para las solicitudes de influencers
interface InfluencerProfile {
  id: string;
  userId: string;
  nickname: string;
  bio: string | null;
  approvalStatus: ApprovalStatus;
  approvedAt: Date | null;
  rejectionReason: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
  };
}

interface AdminDashboardContentProps {
  initialRequests: InfluencerProfile[];
}

export default function AdminDashboardContent({ initialRequests }: AdminDashboardContentProps) {
  const [requests, setRequests] = useState<InfluencerProfile[]>(initialRequests);
  const [activeRequest, setActiveRequest] = useState<InfluencerProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pendientes");
  const router = useRouter();

  // Filtrar solicitudes por estado
  const pendingRequests = requests.filter(
    (req) => req.approvalStatus === ApprovalStatus.PENDING
  );
  const approvedRequests = requests.filter(
    (req) => req.approvalStatus === ApprovalStatus.APPROVED
  );
  const rejectedRequests = requests.filter(
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

  // Abrir modal de rechazo
  const openRejectModal = (request: InfluencerProfile) => {
    setActiveRequest(request);
    setRejectionReason("");
    setIsModalOpen(true);
  };

  // Manejar el rechazo de un influencer
  const handleReject = async () => {
    if (!activeRequest) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/influencers/${activeRequest.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al rechazar la solicitud");
      }

      toast.success("Solicitud rechazada correctamente");
      
      // Actualizar la lista de solicitudes
      setRequests(
        requests.map((req) =>
          req.id === activeRequest.id
            ? { 
                ...req, 
                approvalStatus: ApprovalStatus.REJECTED,
                rejectionReason
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

  // Renderizar tabla de solicitudes
  const renderRequestsTable = (requests: InfluencerProfile[]) => {
    if (requests.length === 0) {
      return (
        <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 rounded-lg">
          No hay solicitudes {activeTab}
        </div>
      );
    }

    return (
      <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha de Solicitud
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {request.nickname || request.user.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {request.approvalStatus === ApprovalStatus.PENDING && (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        Aprobar
                      </button>
                      <button
                        onClick={() => openRejectModal(request)}
                        disabled={isLoading}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1.5" />
                        Rechazar
                      </button>
                    </div>
                  )}
                  {request.approvalStatus === ApprovalStatus.REJECTED && (
                    <span className="inline-block px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md">
                      Rechazado: {request.rejectionReason || "No especificado"}
                    </span>
                  )}
                  {request.approvalStatus === ApprovalStatus.APPROVED && (
                    <span className="inline-block px-4 py-2 text-sm text-green-600 bg-green-50 rounded-md">
                      Aprobado: {request.approvedAt ? new Date(request.approvedAt).toLocaleDateString() : ''}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Determinar qué solicitudes mostrar basado en la tab activa
  const getActiveRequests = () => {
    switch (activeTab) {
      case "pendientes":
        return pendingRequests;
      case "aprobadas":
        return approvedRequests;
      case "rechazadas":
        return rejectedRequests;
      default:
        return pendingRequests;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Gestión de Solicitudes</h2>
          <p className="text-gray-600 mt-1">Administra las solicitudes de influencers</p>
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
              onClick={() => setActiveTab("rechazadas")}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === "rechazadas"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Rechazadas {rejectedRequests.length > 0 && `(${rejectedRequests.length})`}
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
              placeholder="Buscar solicitudes..."
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
              Nueva solicitud
            </button>
          </div>
        </div>
        
        {/* Tabla de solicitudes */}
        <div className="px-6 py-4">
          {renderRequestsTable(getActiveRequests())}
        </div>
      </div>

      {/* Modal de rechazo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rechazar Solicitud</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas rechazar la solicitud de{" "}
              <span className="font-semibold text-gray-900">
                {activeRequest?.nickname || activeRequest?.user.name}
              </span>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del rechazo (opcional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Explica la razón del rechazo..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                {isLoading ? "Procesando..." : "Rechazar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}