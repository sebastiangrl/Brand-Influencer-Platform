// components/dashboard/admin/influencer-details-modal.tsx

// components/dashboard/admin/influencer-details-modal.tsx

import { ApprovalStatus } from "@/lib/constants";
import { Phone, ExternalLink, X } from "lucide-react";
import InstagramIcon from "@/components/icons/instagram-icon";
import TiktokIcon from "@/components/icons/tiktok-icon";
import { InfluencerProfile } from "@/types/influencer";
import { formatFollowers } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface InfluencerDetailsModalProps {
  influencer: InfluencerProfile;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onAddToWaitingList: () => void;
}

export default function InfluencerDetailsModal({
  influencer,
  isOpen,
  onClose,
  onApprove,
  onAddToWaitingList
}: InfluencerDetailsModalProps) {
  if (!isOpen) return null;
  
  // Preparar datos para el gráfico
  const hasSocialData = (influencer.instagramFollowers || influencer.tiktokFollowers);
  
  const chartData = [];
  if (influencer.instagramFollowers) {
    chartData.push({
      name: 'Instagram',
      value: influencer.instagramFollowers,
      color: '#E1306C'
    });
  }
  
  if (influencer.tiktokUsername) {
    chartData.push({
      name: 'TikTok',
      value: influencer.tiktokFollowers || 0,
      color: '#000000'
    });
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto my-8 overflow-hidden animate-in fade-in duration-300">
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-900">Detalles del Influencer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <span className="sr-only">Cerrar</span>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3 text-lg flex items-center">
                <span className="w-1 h-5 bg-blue-500 rounded mr-2"></span>
                Información básica
              </h4>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-medium">{influencer.user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{influencer.user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de registro</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(influencer.user.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estado</dt>
                  <dd className="mt-1">
                    {influencer.approvalStatus === ApprovalStatus.PENDING && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Pendiente
                      </span>
                    )}
                    {influencer.approvalStatus === ApprovalStatus.APPROVED && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Aprobado
                      </span>
                    )}
                    {influencer.approvalStatus === ApprovalStatus.REJECTED && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        Lista de espera
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
            
            {/* Redes sociales */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3 text-lg flex items-center">
                <span className="w-1 h-5 bg-pink-500 rounded mr-2"></span>
                Redes sociales
              </h4>
              <dl className="space-y-4">
                {influencer.instagramUsername && (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <InstagramIcon className="h-5 w-5 text-pink-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">@{influencer.instagramUsername}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {influencer.instagramFollowers && (
                        <span className="text-xs bg-pink-100 text-pink-800 px-2.5 py-1 rounded-full">
                          {formatFollowers(influencer.instagramFollowers)} seguidores
                        </span>
                      )}
                      <a 
                        href={`https://instagram.com/${influencer.instagramUsername}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-full transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
                
                {influencer.tiktokUsername && (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <TiktokIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">@{influencer.tiktokUsername}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {influencer.tiktokFollowers && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
                          {formatFollowers(influencer.tiktokFollowers)} seguidores
                        </span>
                      )}
                      <a 
                        href={`https://tiktok.com/@${influencer.tiktokUsername}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-full transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
                
                {influencer.whatsappContact && (
                  <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-900 font-medium">{influencer.whatsappContact}</span>
                    </div>
                    <a 
                      href={`https://wa.me/${influencer.whatsappContact.replace(/[+\s-]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded-full transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Gráfico de seguidores */}
          {hasSocialData && (
            <div className="mt-6 bg-gray-50 p-5 rounded-lg shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3 text-lg flex items-center">
                <span className="w-1 h-5 bg-indigo-500 rounded mr-2"></span>
                Comparativa de seguidores
              </h4>
              <div className="h-64 bg-white rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatFollowers(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* Biografía e información adicional */}
          <div className="mt-6 bg-gray-50 p-5 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900 mb-3 text-lg flex items-center">
              <span className="w-1 h-5 bg-green-500 rounded mr-2"></span>
              Biografía y detalles
            </h4>
            <div className="space-y-4">
              {influencer.bio && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{influencer.bio}</p>
                </div>
              )}
              
              {influencer.niche && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-500 block mb-2">Nicho/Categoría:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {influencer.niche}
                  </span>
                </div>
              )}
              
              {influencer.approvalStatus === ApprovalStatus.REJECTED && influencer.rejectionReason && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-500 block mb-2">Motivo lista de espera:</span>
                  <p className="text-sm text-gray-700 bg-gray-100 p-3 rounded border border-gray-200">{influencer.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          {influencer.approvalStatus === ApprovalStatus.PENDING && (
            <>
              <button
                onClick={onAddToWaitingList}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Lista de espera
              </button>
              <button
                onClick={() => onApprove(influencer.id)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Aprobar
              </button>
            </>
          )}
          
          {influencer.approvalStatus === ApprovalStatus.REJECTED && (
            <button
              onClick={() => onApprove(influencer.id)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Aprobar ahora
            </button>
          )}
          
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}