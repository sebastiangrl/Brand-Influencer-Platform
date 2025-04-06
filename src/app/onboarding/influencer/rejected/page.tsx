// app/onboarding/influencer/rejected/page.tsx
"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { db } from "@/lib/db";

export default function RejectedPage() {
  const { data: session } = useSession();
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  
  useEffect(() => {
    // Obtener el motivo del rechazo desde la API
    const fetchRejectionReason = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/influencer/rejection-reason?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setRejectionReason(data.reason);
          }
        } catch (error) {
          console.error("Error al obtener el motivo del rechazo:", error);
        }
      }
    };

    fetchRejectionReason();
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-3 rounded-full bg-red-100">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Solicitud rechazada</h1>
        
        <p className="text-gray-600 mb-4">
          Lo sentimos, tu solicitud para unirte como influencer ha sido rechazada.
        </p>
        
        {rejectionReason && (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-sm mb-6">
            <p>
              <strong>Motivo del rechazo:</strong>
            </p>
            <p className="mt-2">{rejectionReason}</p>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Si crees que esto es un error o deseas obtener más información,
          por favor contáctanos a través de nuestro correo de soporte.
        </p>

        <div className="flex flex-col space-y-3">
          <Link
            href="/"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Volver a la página principal
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}