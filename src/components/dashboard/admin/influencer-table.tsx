// components/dashboard/admin/influencer-table.tsx

import { ApprovalStatus } from "@/lib/constants";
import { User, CheckCircle, XCircle } from "lucide-react";
import InstagramIcon from "@/components/icons/instagram-icon";
import TiktokIcon from "@/components/icons/tiktok-icon";
import { InfluencerProfile } from "@/types/influencer";
import { formatFollowers } from "@/lib/utils";

interface InfluencerTableProps {
  requests: InfluencerProfile[];
  activeTab: string;
  isLoading: boolean;
  onViewDetails: (request: InfluencerProfile) => void;
  onApprove: (id: string) => void;
  onAddToWaitingList: (request: InfluencerProfile) => void;
}

export default function InfluencerTable({
  requests,
  activeTab,
  isLoading,
  onViewDetails,
  onApprove,
  onAddToWaitingList
}: InfluencerTableProps) {
  if (requests.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-8 text-center text-gray-500 rounded-lg">
        {activeTab === "pendientes" && "No hay solicitudes pendientes"}
        {activeTab === "aprobadas" && "No hay influencers aprobados"}
        {activeTab === "listaespera" && "No hay influencers en lista de espera"}
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Influencer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Redes Sociales
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nicho
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">
                      {request.nickname || request.user.name}
                    </div>
                    <div className="text-sm text-gray-500">{request.user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  {request.instagramUsername && (
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <InstagramIcon className="h-4 w-4 mr-1 text-pink-500" />
                      @{request.instagramUsername}
                      {request.instagramFollowers && 
                        <span className="ml-1 text-xs bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded">
                          {formatFollowers(request.instagramFollowers)}
                        </span>
                      }
                    </div>
                  )}
                  {request.tiktokUsername && (
                    <div className="flex items-center text-sm text-gray-600">
                      <TiktokIcon className="h-4 w-4 mr-1" />
                      @{request.tiktokUsername}
                      {request.tiktokFollowers && 
                        <span className="ml-1 text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                          {formatFollowers(request.tiktokFollowers)}
                        </span>
                      }
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {request.niche ? (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {request.niche}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">No especificado</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(request.user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewDetails(request)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Ver detalles
                </button>
                
                {request.approvalStatus === ApprovalStatus.PENDING && (
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => onApprove(request.id)}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Aprobar
                    </button>
                    <button
                      onClick={() => onAddToWaitingList(request)}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Lista de espera
                    </button>
                  </div>
                )}
                
                {request.approvalStatus === ApprovalStatus.REJECTED && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => onApprove(request.id)}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Aprobar ahora
                    </button>
                  </div>
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
}