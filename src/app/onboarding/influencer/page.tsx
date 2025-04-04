// app/onboarding/influencer/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InfluencerOnboarding() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    // Aquí normalmente actualizarías más información del influencer
    // Por ahora, simplemente redirigimos al dashboard
    
    router.push("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Completa tu perfil de influencer</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">
          ¡Bienvenido/a a nuestra plataforma! Completa tu perfil de influencer
          para comenzar a recibir propuestas de marcas.
        </p>
        
        {/* Aquí irían los campos de formulario para completar el perfil */}
        
        <button
          onClick={handleComplete}
          disabled={isSubmitting}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Procesando..." : "Completar y continuar"}
        </button>
      </div>
    </div>
  );
}