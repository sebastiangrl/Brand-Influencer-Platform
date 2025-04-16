// app/dashboard/brand/events/create/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/constants";
import CreateEventForm from "@/components/dashboard/brand/events/create-event-form";

export default async function CreateEventPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/login");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  // Verificar si la marca tiene un perfil (se asume que esta verificación ya se realizó en la ruta padre)

  return <CreateEventForm />;
}