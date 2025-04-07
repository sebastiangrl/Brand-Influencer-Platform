// lib/admin-actions.ts
import { db } from "@/lib/db";
import { ApprovalStatus } from "@/lib/constants";
// import { Resend } from "resend";

// Configurar cliente de Resend cuando lo necesites
// const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Enviar correo de aprobación al influencer
    try {
      // Descomentar si tienes configurado Resend
      /*
      await resend.emails.send({
        from: 'BrandConnect <noreply@brandconnect.com>',
        to: updatedProfile.user.email,
        subject: '¡Tu cuenta ha sido aprobada!',
        html: `
          <h1>¡Felicidades ${updatedProfile.user.name || 'Influencer'}!</h1>
          <p>Nos complace informarte que tu cuenta en BrandConnect ha sido aprobada.</p>
          <p>Ahora puedes acceder a todas las funcionalidades de la plataforma y comenzar a conectar con marcas para colaboraciones.</p>
          <p>Accede a tu cuenta desde <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">aquí</a>.</p>
          <p>¡Gracias por formar parte de nuestra comunidad!</p>
          <p>El equipo de BrandConnect</p>
        `,
      });
      */
      console.log("Se enviaría correo de aprobación a:", updatedProfile.user.email);
    } catch (emailError) {
      console.error("Error al enviar correo de aprobación:", emailError);
      // No detenemos el flujo si el correo falla
    }
    
    return updatedProfile;
  } catch (error) {
    console.error("Error al aprobar influencer:", error);
    throw error;
  }
}

// Añadir a lista de espera (anteriormente "rechazar")
export async function addToWaitingList(id: string, reason: string) {
  try {
    const updatedProfile = await db.influencerProfile.update({
      where: {
        id,
      },
      data: {
        approvalStatus: ApprovalStatus.REJECTED, // Mantenemos el enum existente
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

    // Enviar correo de lista de espera al influencer
    try {
      // Descomentar si tienes configurado Resend
      /*
      await resend.emails.send({
        from: 'BrandConnect <noreply@brandconnect.com>',
        to: updatedProfile.user.email,
        subject: 'Actualización sobre tu cuenta en BrandConnect',
        html: `
          <h1>Hola ${updatedProfile.user.name || 'Influencer'},</h1>
          <p>Gracias por registrarte en BrandConnect.</p>
          <p>Hemos revisado tu perfil y actualmente tu cuenta ha sido añadida a nuestra lista de espera.</p>
          <p>Motivo: ${reason || 'No especificado'}</p>
          <p>No te preocupes, esto no significa un rechazo definitivo. Estaremos revisando tu cuenta periódicamente y te notificaremos cuando sea aprobada.</p>
          <p>Si deseas proporcionar información adicional que nos ayude a reconsiderar tu aplicación, por favor responde a este correo.</p>
          <p>¡Gracias por tu interés en BrandConnect!</p>
          <p>El equipo de BrandConnect</p>
        `,
      });
      */
      console.log("Se enviaría correo de lista de espera a:", updatedProfile.user.email);
    } catch (emailError) {
      console.error("Error al enviar correo de lista de espera:", emailError);
      // No detenemos el flujo si el correo falla
    }
    
    return updatedProfile;
  } catch (error) {
    console.error("Error al añadir a lista de espera:", error);
    throw error;
  }
}

// Obtener estadísticas del dashboard
export async function getDashboardStats() {
  try {
    // Contar influencers por estado
    const influencerCounts = await db.influencerProfile.groupBy({
      by: ['approvalStatus'],
      _count: {
        id: true
      }
    });

    // Contar total de marcas
    const brandCount = await db.brandProfile.count();

    // Formatear los resultados
    const stats = {
      influencers: {
        pending: 0,
        approved: 0,
        waitingList: 0, // Antes 'rejected'
        total: 0
      },
      brands: brandCount
    };

    // Asignar conteos de influencers
    influencerCounts.forEach((count: { approvalStatus: string; _count: { id: number; }; }) => {
      if (count.approvalStatus === 'PENDING') {
        stats.influencers.pending = count._count.id;
      } else if (count.approvalStatus === 'APPROVED') {
        stats.influencers.approved = count._count.id;
      } else if (count.approvalStatus === 'REJECTED') {
        stats.influencers.waitingList = count._count.id;
      }
    });

    stats.influencers.total = stats.influencers.pending + stats.influencers.approved + stats.influencers.waitingList;

    return stats;
  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error);
    throw error;
  }
}