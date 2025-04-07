// components/dashboard/admin/waiting-list-modal.tsx
import { InfluencerProfile } from "@/types/influencer";

interface WaitingListModalProps {
  influencer: InfluencerProfile;
  isOpen: boolean;
  isLoading: boolean;
  reason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function WaitingListModal({
  influencer,
  isOpen,
  isLoading,
  reason,
  onReasonChange,
  onClose,
  onConfirm
}: WaitingListModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Añadir a lista de espera</h3>
        <p className="text-gray-600 mb-4">
          ¿Por qué deseas añadir a{" "}
          <span className="font-semibold text-gray-900">
            {influencer?.nickname || influencer?.user.name}
          </span>{" "}
          a la lista de espera?
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Motivo (obligatorio)
          </label>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Explica el motivo para añadir a la lista de espera..."
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading || !reason.trim()}
            className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              reason.trim() 
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Procesando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}