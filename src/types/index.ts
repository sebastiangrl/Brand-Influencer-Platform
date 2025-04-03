// types/index.ts
import { z } from "zod";

// Enums básicos que reflejarán los de la base de datos
export enum UserRole {
  ADMIN = "ADMIN",
  BRAND = "BRAND",
  INFLUENCER = "INFLUENCER"
}

export enum SubscriptionPlan {
  FREE = "FREE",
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE"
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

// Interfaces principales
export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandProfile {
  id: string;
  userId: string;
  companyName: string;
  website: string | null;
  logo: string | null;
  description: string | null;
  industry: string | null;
  location: string | null;
  subscription: SubscriptionPlan;
  subscriptionId: string | null;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
}

export interface InfluencerProfile {
  id: string;
  userId: string;
  nickname: string | null;
  bio: string | null;
  categories: string[];
  instagramUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  audienceSize: number | null;
  approvalStatus: ApprovalStatus;
  approvedAt: Date | null;
  rejectionReason: string | null;
}

export interface Event {
  id: string;
  createdById: string;
  title: string;
  description: string;
  requirements: string | null;
  compensation: string | null;
  deadline: Date | null;
  startDate: Date | null;
  endDate: Date | null;
  location: string | null;
  status: EventStatus;
  maxInfluencers: number | null;
  minFollowers: number | null;
  categories: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EventInterest {
  id: string;
  eventId: string;
  influencerId: string;
  userId: string;
  message: string | null;
  approved: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  name: SubscriptionPlan;
  price: number;
  description: string;
  features: string[];
  active: boolean;
}

// Esquemas de Zod para validación

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre es demasiado corto").max(50, "El nombre es demasiado largo"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const brandProfileSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa es demasiado corto"),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  description: z.string().max(500, "La descripción es demasiado larga").optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

// types/index.ts (continuación)
export const influencerProfileSchema = z.object({
    nickname: z.string().optional(),
    bio: z.string().max(500, "La biografía es demasiado larga").optional(),
    categories: z.array(z.string()),
    instagramUrl: z.string().url("URL de Instagram inválida").optional().or(z.literal("")),
    tiktokUrl: z.string().url("URL de TikTok inválida").optional().or(z.literal("")),
    youtubeUrl: z.string().url("URL de YouTube inválida").optional().or(z.literal("")),
    facebookUrl: z.string().url("URL de Facebook inválida").optional().or(z.literal("")),
    twitterUrl: z.string().url("URL de Twitter inválida").optional().or(z.literal("")),
    audienceSize: z.number().positive("El tamaño de audiencia debe ser positivo").optional(),
  });
  
  export const eventSchema = z.object({
    title: z.string().min(5, "El título es demasiado corto").max(100, "El título es demasiado largo"),
    description: z.string().min(20, "La descripción es demasiado corta"),
    requirements: z.string().optional(),
    compensation: z.string().optional(),
    deadline: z.date().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    location: z.string().optional(),
    maxInfluencers: z.number().positive().optional(),
    minFollowers: z.number().nonnegative().optional(),
    categories: z.array(z.string()),
    status: z.nativeEnum(EventStatus),
  });
  
  export const eventInterestSchema = z.object({
    message: z.string().max(500, "El mensaje es demasiado largo").optional(),
  });
  
  export const messageSchema = z.object({
    content: z.string().min(1, "El mensaje no puede estar vacío").max(1000, "El mensaje es demasiado largo"),
  });
  
  // Tipos para respuestas API
  export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
  };