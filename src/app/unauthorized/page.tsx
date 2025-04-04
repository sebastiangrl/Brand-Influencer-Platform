// app/unauthorized/page.tsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-red-500 text-6xl mb-4">403</div>
        <h1 className="text-2xl font-bold mb-2">Acceso no autorizado</h1>
        <p className="text-gray-600 mb-6">
          No tienes permiso para acceder a esta sección. Por favor, contacta con el
          administrador si crees que esto es un error.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}