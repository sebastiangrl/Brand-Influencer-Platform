// app/onboarding/influencer/pending-approval/page.tsx
"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <svg
              className="w-12 h-12 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Cuenta pendiente de aprobación</h1>
        
        <p className="text-gray-600 mb-6">
          Tu cuenta está siendo revisada por nuestro equipo. Te notificaremos por
          correo electrónico cuando tu cuenta sea aprobada. Este proceso puede
          tardar hasta 48 horas hábiles.
        </p>

        <div className="bg-blue-50 p-4 rounded-lg text-blue-700 text-sm mb-6">
          <p>
            <strong>¿Por qué es necesaria la aprobación?</strong>
          </p>
          <p className="mt-2">
            Para mantener la calidad de las colaboraciones en nuestra plataforma,
            verificamos que todos los influencers cumplan con nuestros estándares
            de calidad y autenticidad.
          </p>
        </div>

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