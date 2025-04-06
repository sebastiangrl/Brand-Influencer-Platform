// lib/admin-actions.ts
import { db } from "@/lib/db";
import { ApprovalStatus } from "@/lib/constants";

// Obtener todas las solicitudes de influencers
export async function getInfluencerRequests() {
  try {
    const influencers = await db.influencerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    });

    return influencers;
  } catch (error) {
    console.error("Error al obtener solicitudes de influencers:", error);
    throw error;
  }
}

// Aprobar una solicitud de influencer
export async function approveInfluencer(id: string) {
  try {
    const updatedProfile = await db.influencerProfile.update({
      where: {
        id,
      },
      data: {
        approvalStatus: ApprovalStatus.APPROVED,
        approvedAt: new Date(),
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Aquí podrías enviar un correo electrónico al influencer
    // usando la biblioteca Resend que ya tienes instalada
    
    return updatedProfile;
  } catch (error) {
    console.error("Error al aprobar influencer:", error);
    throw error;
  }
}

// Rechazar una solicitud de influencer
export async function rejectInfluencer(id: string, reason: string) {
  try {
    const updatedProfile = await db.influencerProfile.update({
      where: {
        id,
      },
      data: {
        approvalStatus: ApprovalStatus.REJECTED,
        rejectionReason: reason,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Aquí podrías enviar un correo electrónico al influencer
    // usando la biblioteca Resend que ya tienes instalada
    
    return updatedProfile;
  } catch (error) {
    console.error("Error al rechazar influencer:", error);
    throw error;
  }
}