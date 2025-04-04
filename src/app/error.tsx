'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar el error en el servidor
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Algo salió mal
        </h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, ha ocurrido un error inesperado.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="block px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}