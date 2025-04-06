// app/dashboard/admin/page.tsx
import AdminDashboardContent from "@/components/dashboard/admin/dashboard-content";
import { getInfluencerRequests } from "@/lib/admin-actions";

export const metadata = {
  title: "Panel de Administración",
};

export default async function AdminDashboardPage() {
  const influencerRequests = await getInfluencerRequests();
  
  return <AdminDashboardContent initialRequests={influencerRequests} />;
}