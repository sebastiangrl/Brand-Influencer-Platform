import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Formatea el número de seguidores para mostrarlo de manera más legible
 * Ej: 1500 -> 1.5K, 1500000 -> 1.5M
 */
export function formatFollowers(followers: number | null): string {
  if (!followers) return "N/A";
  
  if (followers >= 1000000) {
    return `${(followers / 1000000).toFixed(1)}M`;
  } else if (followers >= 1000) {
    return `${(followers / 1000).toFixed(1)}K`;
  }
  
  return followers.toString();
}

/**
 * Formatea una fecha a formato local
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return "N/A";
  
  return new Date(date).toLocaleDateString();
}

/**
 * Limpia un número de teléfono para usarlo en enlaces (remueve espacios, guiones, etc.)
 */
export function cleanPhoneNumber(phone: string | null): string {
  if (!phone) return "";
  
  return phone.replace(/[+\s-]/g, '');
}