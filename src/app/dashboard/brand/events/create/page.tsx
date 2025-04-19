// app/dashboard/brand/events/create/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/constants";
import EventForm from "@/components/dashboard/brand/events/event-form";

export default async function CreateEventPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return redirect("/auth/login?callbackUrl=/dashboard/brand/events/create");
  }

  // Verificar si el usuario es una marca
  if (session.user.role !== UserRole.BRAND) {
    return redirect("/dashboard");
  }

  // Aquí simplemente pasamos el componente sin propiedades necesarias
  return <EventForm />;
}