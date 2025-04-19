// lib/constants.ts

export enum UserRole {
  ADMIN = "ADMIN",
  BRAND = "BRAND",
  INFLUENCER = "INFLUENCER"
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED"
}

// Constantes para notificaciones
export const NOTIFICATION_TYPES = {
  NEW_EVENT: "NEW_EVENT",
  APPLICATION_APPROVED: "APPLICATION_APPROVED",
  APPLICATION_REJECTED: "APPLICATION_REJECTED",
  NEW_APPLICATION: "NEW_APPLICATION",
  NEW_MESSAGE: "NEW_MESSAGE"
};

// Otras constantes útiles para la aplicación
export const DEFAULT_AVATAR = "/images/default-avatar.png";
export const DEFAULT_EVENT_IMAGE = "/images/default-event.jpg";

// Constantes para los límites
export const LIMITS = {
  MAX_IMAGES_PER_EVENT: 5,
  MAX_CATEGORY_LENGTH: 30,
  MAX_BIO_LENGTH: 500,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_MESSAGE_LENGTH: 1000
};

// Lista de categorías disponibles
export const AVAILABLE_CATEGORIES = [
  { id: "moda", label: "Moda" },
  { id: "belleza", label: "Belleza" },
  { id: "fitness", label: "Fitness y Salud" },
  { id: "gastronomia", label: "Gastronomía" },
  { id: "viajes", label: "Viajes" },
  { id: "tecnologia", label: "Tecnología" },
  { id: "gaming", label: "Gaming" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "educacion", label: "Educación" },
  { id: "entretenimiento", label: "Entretenimiento" }
];