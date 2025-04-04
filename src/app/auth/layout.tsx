// app/(auth)/layout.tsx
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="BrandConnect Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8"
            />
            <span className="font-bold text-xl">BrandConnect</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="flex-1 flex items-center justify-center">
          {children}
        </div>
        
        <div className="hidden md:block flex-1 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="h-full flex flex-col items-center justify-center text-white p-12">
            <h2 className="text-3xl font-bold mb-6">Conecta. Colabora. Crece.</h2>
            <p className="text-lg mb-8 max-w-md text-center">
              La plataforma que conecta marcas con influencers para crear 
              campañas impactantes y colaboraciones exitosas.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-bold text-xl mb-1">10k+</p>
                <p className="text-sm">Influencers</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-bold text-xl mb-1">500+</p>
                <p className="text-sm">Marcas</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                <p className="font-bold text-xl mb-1">2k+</p>
                <p className="text-sm">Campañas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}