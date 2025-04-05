// app/dashboard/influencer/layout.tsx
import { Suspense } from "react";

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard de Influencer</h1>
        <p className="mt-2 text-lg text-gray-600">
          Gestiona tus colaboraciones y perfil desde un solo lugar
        </p>
      </div>
      
      <Suspense fallback={<div className="py-8 text-center">Cargando...</div>}>
        {children}
      </Suspense>
    </div>
  );
}