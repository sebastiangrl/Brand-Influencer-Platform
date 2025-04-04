'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { UserRole } from '@/lib/constants';
import { signOut, useSession } from 'next-auth/react';

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN]}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Administrador</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {session?.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Panel de administración</h2>
            <p className="text-gray-600">
              Desde aquí podrás administrar todos los aspectos de la plataforma, usuarios, campañas y más.
            </p>
          </div>
          
          {/* Sección de ejemplo con tarjetas */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Gestión de Usuarios</h3>
              <p className="text-gray-600 mb-4">
                Gestiona los usuarios de la plataforma.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                Ver usuarios
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Aprobación de influencers</h3>
              <p className="text-gray-600 mb-4">
                No hay solicitudes pendientes de aprobación.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                Ver solicitudes
              </button>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Estadísticas</h3>
              <p className="text-gray-600 mb-4">
                Consulta estadísticas de uso de la plataforma.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                Ver estadísticas
              </button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}