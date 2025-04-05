// app/dashboard/brand/layout.tsx
import { Suspense } from "react";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard de Marca</h1>
        <p className="mt-2 text-lg text-gray-600">
          Administra tus campañas y colaboraciones con influencers
        </p>
      </div>
      
      <Suspense fallback={<div className="py-8 text-center">Cargando...</div>}>
        {children}
      </Suspense>
    </div>
  );
}