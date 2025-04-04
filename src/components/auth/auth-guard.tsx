// components/auth/auth-guard.tsx
'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { UserRole } from "@/lib/constants";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role as UserRole)) {
      router.push("/unauthorized");
    }
  }, [session, status, router, allowedRoles, redirectTo]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role as UserRole)) {
    return null;
  }

  return <>{children}</>;
}