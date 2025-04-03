// app/(marketing)/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-10 max-w-2xl md:mb-0">
              <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                Conectando marcas e influencers de forma efectiva
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                La plataforma que simplifica la relación entre marcas e influencers, 
                permitiendo colaboraciones exitosas y campañas de alto impacto.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href="/auth/register?role=brand" className="rounded-md bg-blue-600 px-6 py-3 text-center font-medium text-white shadow-md hover:bg-blue-700">
                  Soy una marca
                </Link>
                <Link href="/auth/register?role=influencer" className="rounded-md border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 shadow-md hover:bg-gray-50">
                  Soy influencer
                </Link>
              </div>
            </div>
            <div className="w-full max-w-md">
              <div className="rounded-lg bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                  ¿Por qué elegirnos?
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="mr-3 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Conexiones personalizadas basadas en tu audiencia</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-3 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Proceso de verificación para garantizar calidad</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-3 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Comunicación directa y segura en la plataforma</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-3 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Gestión completa de campañas y colaboraciones</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Características principales
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 inline-block rounded-full bg-blue-100 p-3 text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Conecta con los mejores</h3>
              <p className="text-gray-600">
                Accede a una red curada de marcas e influencers verificados para 
                garantizar colaboraciones de calidad.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 inline-block rounded-full bg-blue-100 p-3 text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Gestión de campañas</h3>
              <p className="text-gray-600">
                Crea, gestiona y mide el rendimiento de tus campañas desde un
                único panel de control intuitivo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 inline-block rounded-full bg-blue-100 p-3 text-blue-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Comunicación integrada</h3>
              <p className="text-gray-600">
                Comunícate directamente dentro de la plataforma sin necesidad
                de compartir datos personales o usar otras aplicaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            ¿Listo para transformar tus colaboraciones?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Únete hoy a nuestra plataforma y comienza a crear conexiones 
            significativas que impulsen tu marca o carrera como influencer.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/auth/register?role=brand" className="rounded-md bg-white px-6 py-3 text-center font-medium text-blue-600 shadow-md hover:bg-gray-100">
              Registrar mi marca
            </Link>
            <Link href="/auth/register?role=influencer" className="rounded-md border border-white bg-transparent px-6 py-3 text-center font-medium text-white shadow-md hover:bg-blue-700">
              Registrarme como influencer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}