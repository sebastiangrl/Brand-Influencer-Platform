// app/dashboard/layout.tsx
"use client";
import { Header } from "@/components/dashboard/header";
import { Footer } from "@/components/dashboard/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     <Header />
      
      {/* Main content */}
      <main className="flex-1 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}