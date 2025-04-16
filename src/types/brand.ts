// types/brand.ts
import { SubscriptionPlan, UserRole } from "@/lib/constants";

export interface User {
  image: string;
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  role: UserRole;
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
  subscription: SubscriptionPlan;
  subscriptionId: string | null;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
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
  status: string;
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
  approvalStatus: string;
  user: User;
}

export interface EventInterest {
  id: string;
  eventId: string;
  influencerId: string;
  userId: string;
  message: string | null;
  approved: boolean;
  createdAt: Date;
  influencer: Influencer;
}