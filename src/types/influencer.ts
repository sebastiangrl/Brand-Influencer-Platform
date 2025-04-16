// types/influencer.ts

import { ApprovalStatus } from "@/lib/constants";

export interface InfluencerProfile {
  coverImage: any;
  profileImage: any;
  id: string;
  userId: string;
  nickname: string;
  bio: string | null;
  approvalStatus: ApprovalStatus;
  approvedAt: Date | null;
  rejectionReason: string | null;
  instagramUsername: string | null;
  instagramFollowers: number | null;
  tiktokUsername: string | null;
  tiktokFollowers: number | null;
  whatsappContact: string | null;
  niche: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
  };
}