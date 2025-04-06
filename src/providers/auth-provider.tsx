'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider 
      refetchInterval={0} // No auto-refresh para evitar problemas
      refetchOnWindowFocus={true} // Pero sí cuando vuelve el foco a la ventana
    >
      {children}
    </SessionProvider>
  );
}