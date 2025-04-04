// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/providers/auth-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | BrandConnect",
    default: "BrandConnect - Conectando Marcas e Influencers",
  },
  description: "Plataforma que conecta marcas con influencers para campañas y colaboraciones efectivas",
  keywords: ["influencers", "marcas", "marketing", "colaboraciones", "eventos", "campañas"],
  authors: [{ name: "BrandConnect" }],
  creator: "BrandConnect",
  publisher: "BrandConnect",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "BrandConnect",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@brandconnect",
    site: "@brandconnect",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

