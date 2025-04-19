// types/brand.ts
import { UserRole, EventStatus, ApprovalStatus } from "@/lib/constants";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  role: UserRole | string;
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
  contactPhone: string | null;
  user: User;
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
  status: EventStatus | string;
  maxInfluencers: number | null;
  minFollowers: number | null;
  categories: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    interests: number;
  };
}

export interface Influencer {
  id: string;
  userId: string;
  nickname: string | null;
  bio: string | null;
  instagramUsername: string | null;
  instagramFollowers: number | null;
  instagramUrl: string | null;
  tiktokUsername: string | null;
  tiktokFollowers: number | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  whatsappContact: string | null;
  niche: string | null;
  categories: string[];
  audienceSize: number | null;
  approvalStatus: ApprovalStatus | string;
  user: User | {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

// Actualizamos la interfaz EventInterest para que coincida con lo que devuelve Prisma
export interface EventInterest {
  id: string;
  eventId: string;
  influencerId: string;
  userId: string;
  message: string | null;
  approved: boolean;
  createdAt: Date;
  influencer: Influencer;
  user: User | {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}