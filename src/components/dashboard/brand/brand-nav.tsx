// components/dashboard/brand/brand-nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "next-auth";
import { BrandProfile } from "@/types/brand";
import { Bell, Menu, X, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BrandNavProps {
  user: User;
  brand: BrandProfile;
}

export default function BrandNav({ user, brand }: BrandNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Obtener iniciales para el avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userInitials = getInitials(user.name || brand.companyName || "");

  return (
    <header className="bg-white border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-4">
          <button className="rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
            <Bell className="h-6 w-6" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-sm focus:outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{brand.companyName}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/brand/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/dashboard/brand"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/brand/events"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Eventos
            </Link>
            <Link
              href="/dashboard/brand/influencers"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Influencers
            </Link>
            <Link
              href="/dashboard/brand/messages"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Mensajes
            </Link>
            <Link
              href="/dashboard/brand/profile"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
            >
              Perfil
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}